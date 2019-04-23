const nodemailer = require('nodemailer') // detail: https://nodemailer.com/
const { emailTransporterConfig } = require('../config')

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: 'smtp.163.com',
//   port: 465,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: 'guodadablog@163.com', // generated ethereal user
//     pass: '123456XXX' // generated ethereal password 授权码 而非 密码
//   }
// })

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(emailTransporterConfig)

/**
 *
 * @param {Object} params
 * @param {Email} params.receiver - 邮箱地址
 * @param {String} params.html - 发送的内容
 * @example sendMail({ receiver: 'gershonv@163.com', html: 'hellllll' })
 */
const sendMail = async ({ receiver, html }) => {
  let info = await transporter.sendMail({
    from: emailTransporterConfig.auth.user, // sender address
    to: receiver, // list of receivers
    subject: '郭大大的博客', // Subject line
    text: '您的评论获得新的回复！', // plain text body
    html: html // html body
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = sendMail
