const Joi = require('joi')
const axios = require('axios')
const { GITHUB } = require('../config')
const { decodeQuery } = require('../utils')
const { comparePassword, encrypt } = require('../utils/bcrypt')
const { createToken } = require('../utils/token')
const { user: UserModel, comment: CommentModel, reply: ReplyModel, sequelize } = require('../models')

/**
 * 读取 github 用户信息
 * @param {String} username - github 登录名
 */
async function getGithubInfo(username) {
  const result = await axios.get(`${GITHUB.fetch_user}${username}`)
  return result.data
}

class UserController {
  // ===== utils methods
  // 查找用户
  static find(params) {
    return UserModel.findOne({ where: params })
  }

  // 创建用户
  static createGithubUser(data, role = 2) {
    const { id, login, email } = data
    return UserModel.create({
      id,
      username: login,
      role,
      email,
      github: JSON.stringify(data)
    })
  }

  // 更新用户信息
  static updateUserById(userId, data) {
    return UserModel.update(data, { where: { id: userId } })
  }
  // ===== utils methods

  // 登录
  static async login(ctx) {
    const { code } = ctx.request.body
    if (code) {
      await UserController.githubLogin(ctx, code)
    } else {
      await UserController.defaultLogin(ctx)
    }
  }

  // 站内用户登录
  static async defaultLogin(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      account: Joi.string().required(),
      password: Joi.string()
    })
    if (validator) {
      try {
        const { account, password } = ctx.request.body

        const user = await UserModel.findOne({
          where: {
            // $or: { email: account, username: account }
            username: account
          }
        })

        if (!user) {
          ctx.client(403, '用户不存在')
        } else {
          const isMatch = await comparePassword(password, user.password)
          if (!isMatch) {
            ctx.client(403, '密码不正确')
          } else {
            const { id, role } = user
            const token = createToken({ username: user.username, userId: id, role }) // 生成 token
            ctx.client(200, '登录成功', { username: user.username, role, userId: id, token })
          }
        }
      } catch (error) {
        console.log(error)
        // ctx.client(500, null, error)
        throw error
      }
    }
  }

  // github 登录
  static async githubLogin(ctx, code) {
    try {
      const result = await axios.post(GITHUB.access_token_url, {
        client_id: GITHUB.client_id,
        client_secret: GITHUB.client_secret,
        code
      })

      const { access_token } = decodeQuery(result.data)

      if (access_token) {
        // 拿到 access_token 去获取用户信息
        const result2 = await axios.get(`${GITHUB.fetch_user_url}?access_token=${access_token}`)
        const githubInfo = result2.data

        let target = await UserController.find({ id: githubInfo.id }) // 在数据库中查找该用户是否存在

        if (!target) {
          target = await UserModel.create({
            id: githubInfo.id,
            username: githubInfo.name || githubInfo.username,
            github: JSON.stringify(githubInfo),
            email: githubInfo.email
          })
        } else {
          if (target.github !== JSON.stringify(githubInfo)) {
            // github 信息发生了变动
            // console.log(`${githubInfo.login}: github 信息发生改变， 更新 user....`)
            const { id, login, email } = githubInfo
            const data = {
              username: login,
              email,
              github: JSON.stringify(githubInfo)
            }
            await UserController.updateUserById(id, data)
          }
        }
        // username: user.username, role, userId: id, token
        const token = createToken({ userId: githubInfo.id, role: target.role }) // 生成 token

        ctx.client(200, 'success', {
          github: githubInfo,
          username: target.username,
          userId: target.id,
          role: target.role,
          token
        })
      } else {
        ctx.client(403, 'github 授权码已失效！')
      }
    } catch (error) {
      ctx.client(500, 'github 登录超时')
    }
  }

  // 注册
  static async register(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required()
    })

    if (validator) {
      const { username, password, email } = ctx.request.body
      const result = await UserModel.findOne({ where: { email } })
      if (result) {
        ctx.client(403, '邮箱已被注册')
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if (user && !user.github) {
          ctx.client(403, '用户名已被占用')
        } else {
          const saltPassword = await encrypt(password)
          await UserModel.create({ username, password: saltPassword, email })
          ctx.client(200, '注册成功')
        }
      }
    }
  }

  /**
   * 获取用户列表
   */
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      username: Joi.string(),
      page: Joi.string(),
      pageSize: Joi.number()
    })

    if (validator) {
      const { page = 1, pageSize = 10, username } = ctx.query
      const where = {
        role: {
          $not: -1
        }
      }
      if (username) {
        where.username['$like'] = `%${username}%`
      }
      const result = await UserModel.findAndCountAll({
        where,
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        row: true
      })

      ctx.client(200, 'success', result)
    }
  }

  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      userId: Joi.number().required()
    })

    if (validator) {
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${ctx.params.userId}`
      )
      await UserModel.destroy({ where: { id: ctx.params.userId } })
      ctx.client(200)
    }
  }

  /**
   * 更新用户
   */
  static async updateUser(ctx) {
    const validator = ctx.validate(
      {
        ...ctx.params,
        ...ctx.request.body
      },
      {
        userId: Joi.number().required(),
        notice: Joi.boolean()
      }
    )

    if (validator) {
      const { userId } = ctx.params
      const { notice } = ctx.request.body
      await UserController.updateUserById(userId, { notice })
      ctx.client(200)
    }
  }

  /**
   * 初始化用户
   * @param {String} githubName - github name
   */
  static async initGithubUser(githubName) {
    const temp = await UserController.find({ username: githubName })
    if (!temp) {
      const result = await getGithubInfo(githubName)
      UserController.createGithubUser(result, 1)
    }

    // const tempList = await Promise.all(list.map(username => UserController.find({ username }))) // 查找库里是否有这个用户
    // list.forEach(async (username, i) => {
    //   if (!tempList[i]) {
    //     const result = await getGithubInfo(username)
    //     UserController.createGithubUser(result, 1)
    //   }
    // })
  }
}

module.exports = UserController
