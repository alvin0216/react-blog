const { TOKEN_SECRET, TOKEN_EXPIRESIN } = require('../config')
const jwt = require('jsonwebtoken')

exports.createToken = info => {
  const token = jwt.sign(info, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRESIN })
  console.log('generated token', token)
  return token
}

exports.verifyToken = token => {}

exports.decodeToken = (ctx) => {
  const authorizationHeader = ctx.headers['authorization']
  const token = authorizationHeader.split(' ')[1] // 取到 token
  return jwt.decode(token)
}
