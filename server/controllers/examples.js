const ExampleModel = require('../models').examples

module.exports = {
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body
      const user = await ExampleModel.findOne({ username })
      if (!user) {
        ctx.body = {
          code: 1,
          message: '用户名不存在'
        }
      } else {
        if (user.password !== password) {
          ctx.body = {
            code: 1,
            message: '密码不正确'
          }
        } else {
          ctx.body = {
            code: 0,
            message: '登录成功'
          }
        }
      }
    } catch (err) {
      ctx.body = { code: 500, msg: 'Internal Server Error.' }
    }
  },

  async register(ctx) {
    const { username, password } = ctx.request.body
    const checkUser = await ExampleModel.findOne({ username })
    if (checkUser) {
      ctx.body = { code: 403, msg: 'This username account is already in use.' }
    } else {
      const result = await ExampleModel.create({ username, password })

      if (result !== null) {
        ctx.body = {
          code: 0,
          message: '注册成功'
        }
      } else {
        ctx.body = {
          code: 1,
          message: '注册失败'
        }
      }
    }
  }
}
