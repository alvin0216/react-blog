const marked = require('marked')
const { emailTransporterConfig, WEB_HOST } = require('../config')

/**
 * md 转化为 html
 *
 * @param {String} plainText - md string
 */
const translateMarkdown = plainText => {
  return marked(plainText, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
  })
}
exports.translateMarkdown = translateMarkdown

/**
 * 生成 emailList 列表 以及 html
 *
 * @param {Object} commentData - 评论以及回复的数据
 * @param {Object} article - 文章详情
 * @param {Boolean} onlyComment - 是否只新增了评论
 * 
 * @return { emailList, html, subject }
 */
exports.getEmailData = (commentData, article, onlyComment = false) => {
  function prefix(origin) {
    return `<strong style="font-size: 1rem;">${
      origin.user.username
    }</strong> <span style="font-size: .8rem; color: #796565">${origin.createdAt}: </span>`
  }

  let emailList = [emailTransporterConfig.auth.user], // 发送邮件到博主邮箱
    contentList = []

  // 生成 emailList 列表 以及 contentList
  commentData.user.email && emailList.push(commentData.user.email)
  contentList.push(translateMarkdown(`${prefix(commentData)}${commentData.content}`))

  commentData.replies.forEach(reply => {
    const replyEmail = reply.user.email
    contentList.push(translateMarkdown(`&nbsp;&nbsp;&nbsp;&nbsp;${prefix(reply)}${reply.content}`))
    replyEmail && !emailList.includes(replyEmail) && emailList.push(replyEmail)
  })

  // html 处理
  let link = article.id !== -1 ? `${WEB_HOST}/article/${article.id}` : `${WEB_HOST}/about`,
    title = article.id !== -1 ? article.title : '关于页面',
    pos = article.id !== -1 ? '文章' : '',
    content = contentList.join(''),
    subject = !onlyComment ? `郭大大的博客 - 您在${pos}【${title}】中的评论得到了新的回复` : `郭大大的博客 - 您的${pos}【${title}】有了新的评论`

  let html = `
    您在${pos}【<a href="${link}">${title}</a>】中的评论得到了新的回复： 
    <hr />
    ${content}
    <br />
    <a href="${link}">点击查看详情</a>  如有打扰，请联系博主删除相关账户。
  `

  if (onlyComment) {
    html = `
      您的 ${pos}【<a href="${link}">${title}</a>】有了新的评论： 
      <hr />
      ${content}
      <a href="${link}">点击查看详情</a> 
    `
  }

  return { emailList, html, subject }
}
