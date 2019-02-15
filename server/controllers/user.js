const { user: UserModel } = require('../models')
const { encrypt, comparePassword } = require('../lib/bcrypt')
const { createToken } = require('../lib/token')

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
  }
}
