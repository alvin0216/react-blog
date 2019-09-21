const nodemailer = require('nodemailer') // detail: https://nodemailer.com/
const { EMAIL_NOTICE } = require('../config')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(EMAIL_NOTICE.transporterConfig)

/**
 *
 * @param {Object} params
 * @param {Email} params.receiver - 邮箱地址
 * @param {String} params.html - 发送的内容
 * @example sendMail({ receiver: 'gershonv@163.com', html: 'hellllll' })
 */
exports.sendEmail = async ({ receiver, html, subject, text }) => {
  const info = await transporter.sendMail({
    from: EMAIL_NOTICE.transporterConfig.auth.user, // sender address
    to: receiver, // list of receivers
    subject: subject || EMAIL_NOTICE.subject, // Subject line
    text: text || EMAIL_NOTICE.text, // plain text body
    html: html // html body
  })

  // console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return info
}

/**
 * 获取 email 列表
 * @param {Objec} target - comment { replies: [....] }
 * @param {Number} userId - 发送评论的用户 id
 */
function getEmailList(target, userId) {
  const temp = [EMAIL_NOTICE.transporterConfig.auth.user]
  const loop = item => {
    if (item.user.id !== userId && item.user.notice && item.user.email) {
      temp.push(item.user.email)
    }
  }
  loop(target)
  target.replies && target.replies.forEach(r => loop(r))

  return [...new Set(temp)]
}

exports.getEmailData = (article, disscussData, userId) => {
  const { WEB_HOST } = EMAIL_NOTICE
  const link = article.id !== -1 ? `${WEB_HOST}/article/${article.id}` : `${WEB_HOST}/about`

  const HTML_HEADER = `<h4 class='header'>您在文章 <span class='article-title'><a href="${link}" class='href'>${article.title}</a></span> 中的评论有了新的回复...</h4>`

  const HTML_FOOTER = `<a href="${link}" class='href'>点击查看详情</a> 取消订阅，请回复TD。`

  function createDisscusInfo(item) {
    return `
          <div>
            <span class='username'>${item.user.username}</span> <span class="create-time">${item.createdAt}: </span>
            ${item.content}    
          </div>
          `
  }

  const HTML_CONTENT = `
    ${createDisscusInfo(disscussData)}
    <div style="padding-left: 15px;">${disscussData.replies.map(createDisscusInfo).join('')}</div>
  `

  const html = `
    <style>
      .header {
        margin-bottom: 20px;
      }
      .username {
        color: #555;
        font-size: 16px;
        font-weight: bold;
      }
      .article-title {
        font-size: 24px;
      }
      .href {
        color: #40a9ff;
      }
      .create-time {
        font-size: 12px;
      }
    </style>
    ${HTML_HEADER}
  
    ${HTML_CONTENT}
    <br />
    ${HTML_FOOTER}
  `

  return { html, emailList: getEmailList(disscussData, userId) }
}
