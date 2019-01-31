const db = require('./db')

module.exports = {
  db,
  SALT_WORK_FACTOR: 10, // 生成salt的迭代次数
  TOKEN_NAME: 'react-blog',
  TOKEN_EXPIRESIN: '24h' // token 有效期
}
