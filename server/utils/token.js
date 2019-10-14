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
 * @param {Array} roleList - 需要具备的权限 { role: 1, verifyTokenBy: 'url' }
 *
 * @return {Boolean} 是否验证通过
 */
exports.checkToken = (ctx, roleList = []) => {
  let isVerify = false
  function _verify(token) {
    return jwt.verify(token, TOKEN.secret, function(err, decoded) {
      if (err) {
        return false
      } else if (decoded) {
        return !!roleList.find(item => item.role === decoded.role)
      }
      return false
    })
  }

  for (const item of roleList) {
    if (item.verifyTokenBy === 'headers') {
      const authorizationHeader = ctx.headers['authorization']
      if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1] // 取到 token
        const result = _verify(token)
        if (result) {
          isVerify = true
          break
        }
      }
    } else {
      const { token } = ctx.query
      if (token) {
        const _token = token.split(' ')[1] // 取到 token 过滤 Bearer
        const result = _verify(_token)
        if (result) {
          isVerify = true
          break
        }
      }
    }
  }

  return isVerify
}
