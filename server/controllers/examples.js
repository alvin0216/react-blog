const ExampleModel = require('../models').examples
const { encrypt, comparePassword } = require('../lib/bcrypt')

module.exports = {
  async login(ctx) {
    try {
      const { username, password } = ctx.request.body
      const user = await ExampleModel.findOne({ where: { username } })
      if (!user) {
        ctx.body = { code: 403, message: '用户不存在' }
      } else {
        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
          ctx.body = { code: 403, message: '密码不正确' }
        } else {
          ctx.body = { code: 200, message: '登录成功' }
        }
      }
    } catch (err) {
      ctx.body = { code: 500, message: 'Internal Server Error.' }
    }
  },

  async register(ctx) {
    const { username, password } = ctx.request.body
    const checkUser = await ExampleModel.findOne({ where: { username } })
    if (checkUser) {
      ctx.body = { code: 403, message: '用户名已被注册' }
    } else {
      try {
        const saltPassword = await encrypt(password)
        await ExampleModel.create({ username, password: saltPassword })
        ctx.body = { code: 200, message: '注册成功' }
      } catch (err) {
        console.log(err)
        ctx.throw(500, 'Internal Server Error.')
      }
    }
  }
}
