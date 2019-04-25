const db = require('./db')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  db,
  SALT_WORK_FACTOR: 10, // 生成salt的迭代次数
  TOKEN_SECRET: 'react-blog',
  TOKEN_EXPIRESIN: '720h', // token 有效期
  ENABLE_EMAIL_NOTICE: false, // 是否开启邮件通知功能 
  // 邮箱的 config 
  emailTransporterConfig: {
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: isDev ? 'guodadablog@163.com' : 'gershonv@163.com', // generated ethereal user
      pass: isDev ? '123456XXX' : '123456XXX' // generated ethereal password 授权码 而非 密码
    }
  },
  WEB_HOST: isDev ? 'localhost:3000' : 'https://guodada.fun', // 主机地址（端口）
}
