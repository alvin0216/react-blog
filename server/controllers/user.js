const Joi = require('joi')
const UserSchema = require('../schemas/user')

const { user: UserModel, comment: CommentModel, reply: ReplyModel, sequelize } = require('../models')
const { encrypt, comparePassword } = require('../lib/bcrypt')
const { createToken, checkAuth } = require('../lib/token')

// const emailRegexp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

module.exports = {
  async register(ctx) {
    const { username, password, email } = ctx.request.body
    let response
    const validator = Joi.validate({ username, password, email }, UserSchema.regiester)
    if (validator.error) {
      response = { code: 400, message: validator.error.message }
    } else {
      const result = await UserModel.findOne({ where: { email } })
      if (result) {
        response = { code: 400, message: '邮箱已被注册' }
      } else {
        const user = await UserModel.findOne({ where: { username } })
        if (user) {
          response = { code: 400, message: '用户名已被占用' }
        } else {
          const saltPassword = await encrypt(password)
          await UserModel.create({ username, password: saltPassword, email })
          response = { code: 200, message: '注册成功' }
        }
      }
    }
    ctx.body = response
  },

  async login(ctx) {
    const { account, password } = ctx.request.body
    const validator = Joi.validate({ account, password }, UserSchema.login)
    let response
    if (validator.error) {
      response = { code: 400, message: validator.error.message }
    } else {
      const user = await UserModel.findOne({
        where: {
          $or: { username: account, email: account }
        }
      })
      if (!user) {
        response = { code: 400, message: '用户不存在' }
      } else {
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
          response = { code: 400, message: '密码不正确' }
        } else {
          const { id, auth } = user
          const token = createToken({ username: user.username, userId: id, auth, email: user.email }) // 生成 token
          response = { code: 200, message: '登录成功', username: user.username, auth: user.auth, token }
        }
      }
    }

    ctx.body = response
  },

  /**
   * 更新账户信息
   *
   */
  async updateUser(ctx) {
    const userId = parseInt(ctx.params.id) // userId
    const { username, oldPassword, password, email } = ctx.request.body
    const user = await UserModel.findByPk(userId) // 为什么不直接用 update ==> 防止不法分子直接把博主的密码改了，或者其他...

    let response = {},
      token

    if (!user.email) {
      const result = await UserModel.findOne({ where: { email } })
      if (result) {
        response = { code: 400, message: '该邮箱已被注册' }
      } else {
        await UserModel.update({ email }, { where: { id: userId } })
        response = { code: 200, message: `已成功绑定邮箱 ${email}` }
      }
    } else {
      if (oldPassword) {
        const isMatch = await comparePassword(oldPassword, user.password)
        if (isMatch) {
          if (!username && !password) {
            response = { code: 400, message: '用户名/密码参数错误' }
          } else if (username && !password) {
            const result = await UserModel.findOne({ where: { username } })
            if (result) {
              response = { code: 400, message: '用户名已被占用' }
            } else {
              await UserModel.update({ username }, { where: { id: userId } })
              response = { code: 200, message: '用户名修改成功' }
            }
          } else if (!username && password) {
            const saltPassword = await encrypt(password)
            await UserModel.update({ password: saltPassword }, { where: { id: userId } })
            response = { code: 200, message: '密码修改成功' }
          } else if (username && password) {
            const result = await UserModel.findOne({ where: { username } })
            if (result && result.username !== username) {
              response = { code: 400, message: '用户名已被占用' }
            } else {
              const saltPassword = await encrypt(password)
              await UserModel.update({ username, password: saltPassword }, { where: { id: userId } })
              response = { code: 200, message: '用户名/密码修改成功' }
            }
          }
        } else {
          response = { code: 400, message: '密码不正确' }
        }
      } else {
        response = { code: 400, message: '请输入原密码验证您的身份' }
      }
    }

    if (response.code === 200) {
      const result = await UserModel.findById(userId)
      const { username, id, email, auth } = result
      token = createToken({ username, userId: id, auth, email }) // 生成 token
      response.token = token
    }
    ctx.body = response
  },

  async getUserList(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      let { page = 1, pageSize = 10, username } = ctx.query
      const offset = (page - 1) * pageSize
      pageSize = parseInt(pageSize)

      const params = username ? { username: { $like: `%${username}%` } } : {}

      const data = await UserModel.findAndCountAll({
        attributes: ['id', 'username', 'createdAt'],
        where: { auth: 2, ...params },
        include: [{ model: CommentModel, attributes: ['id'], include: [{ model: ReplyModel, attributes: ['id'] }] }],
        offset,
        limit: pageSize,
        row: true,
        distinct: true,
        order: [['createdAt', 'DESC']]
      })
      ctx.body = { code: 200, ...data }
    }
  },

  async delete(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      let { userId } = ctx.query
      userId = parseInt(userId)
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${userId}`
      )
      await UserModel.destroy({ where: { id: userId } })
      ctx.body = { code: 200, message: '成功删除用户' }
    }
  }
}
