const { TOKEN_SECRET, TOKEN_EXPIRESIN } = require('../config')
const koaJwt = require('koa-jwt')

module.exports = koaJwt({ secret: TOKEN_SECRET }).unless({
  path: [/\/examples\/login/, /\/examples\/register/] // 白名单
})
