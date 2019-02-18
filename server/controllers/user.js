const { user: UserModel, comment: CommentModel, reply: ReplyModel } = require('../models')
const { encrypt, comparePassword } = require('../lib/bcrypt')
const { createToken, checkAuth } = require('../lib/token')

module.exports = {
  async register(ctx) {
    const { username, password } = ctx.request.body
    if (username && password) {
      const checkUser = await UserModel.findOne({ where: { username } })
      let response
      if (checkUser) {
        response = { code: 400, message: '用户名已被注册' }
      } else {
        const saltPassword = await encrypt(password)
        await UserModel.create({ username, password: saltPassword })
        response = { code: 200, message: '注册成功' }
      }
      ctx.body = response
    } else {
      ctx.body = { code: 400, message: '用户名或密码不能为空' }
    }
  },

  async login(ctx) {
    const { username, password } = ctx.request.body
    const user = await UserModel.findOne({ where: { username } })
    let response
    if (!user) {
      response = { code: 400, message: '用户不存在' }
    } else {
      const isMatch = await comparePassword(password, user.password)
      if (!isMatch) {
        response = { code: 400, message: '密码不正确' }
      } else {
        const { id, auth } = user
        const token = createToken({ username, userId: id, auth }) // 生成 token
        response = { code: 200, message: '登录成功', username, auth: user.auth, token }
      }
    }
    ctx.body = response
  },

  async getUserList(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      let { page = 1, pageSize = 10 } = ctx.query
      const offset = (page - 1) * pageSize
      pageSize = parseInt(pageSize)
      const data = await UserModel.findAndCountAll({
        attributes: ['id', 'username'],
        where: { auth: 2 },
        include: [{ model: CommentModel, attributes: ['id'], include: [{ model: ReplyModel, attributes: ['id'] }] }],
        offset,
        limit: pageSize,
        row: true,
        distinct: true
      })
      ctx.body = { code: 200, ...data }
    }
  },

  async delete(ctx) {
    const isAuth = checkAuth(ctx)
    if (isAuth) {
      const { userId } = ctx.query
     
      await UserModel.destroy({ where: { id: userId } })
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${userId}`
      )
      ctx.body = { code: 200, message: '成功删除用户' }
    }
  }
}
