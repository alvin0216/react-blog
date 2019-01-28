const { SALT_WORK_FACTOR } = require('../config')
const bcrypt = require('bcrypt')

/**
 * @func encrypt - 加密
 * @param {String} - 密码
 */
exports.encrypt = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) resolve(password)
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) resolve(password)
        resolve(hash)
      })
    })
  })
}

/**
 * @func comparePassword - 密码校验
 * @param {String} _password - 需要校验的密码
 * @param {String} hash - 加密后的密码
 */
exports.comparePassword = (_password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_password, hash, function(err, isMatch) {
      if (!err) resolve(isMatch)
      else reject(err)
    })
  })
}
