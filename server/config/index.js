const db = require('./db')

module.exports = {
  db,
  SALT_WORK_FACTOR: 10, // 生成salt的迭代次数
  TOKEN_SECRET: 'react-blog',
  TOKEN_EXPIRESIN: '720h', // token 有效期
  // 邮箱的 config 
  emailTransporterConfig: {
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'guodadablog@163.com', // generated ethereal user
      pass: '123456XXX' // generated ethereal password 授权码 而非 密码
    }
  }
}
