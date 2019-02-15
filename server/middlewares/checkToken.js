const { TOKEN_SECRET } = require('../config')
const koaJwt = require('koa-jwt')

module.exports = koaJwt({ secret: TOKEN_SECRET }).unless({
  // return true 需要被授权
  custom: ctx => {
    // 定义白名单 即需要 token 的请求
    // 1 文章 增删改需要 token
    // 2 用户操作需要 token 评论之类的
    const requireList = [/article\/(create|update|delete)/, /user/]

    return !requireList.find(reg => reg.test(ctx.request.url))
  }
})
