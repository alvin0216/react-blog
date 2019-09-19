const jwt = require('jsonwebtoken')
const { TOKEN } = require('../config')

/**
 * @param {Object} info - 存储在token中的值
 */
exports.createToken = info => {
  const token = jwt.sign(info, TOKEN.secret, { expiresIn: TOKEN.expiresIn })
  return token
}

/**
 * @param {Object} ctx - app.context
 * @param {Number} role - 需要具备的权限
 *
 * @return {Boolean} 是否验证通过
 */
exports.checkToken = (ctx, role = 1) => {
  const authorizationHeader = ctx.headers['authorization']
  if (!authorizationHeader) {
    return false
  }

  const token = authorizationHeader.split(' ')[1] // 取到 token
  return jwt.verify(token, TOKEN.secret, function(err, decoded) {
    if (err) {
      return false
    } else if (decoded) {
      return decoded.role === role
    }
    return false
  })
}
