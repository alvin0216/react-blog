// 评论控制器，包括回复内容
const { sequelize } = require('../models')
const { comment: CommentModel, reply: ReplyModel, user: UserModel, article: ArticleModel } = require('../models')
const { decodeToken, checkAuth } = require('../lib/token')
const sendEmail = require('../lib/sendEmail')
const { getEmailData } = require('../lib')
const { emailTransporterConfig, ENABLE_EMAIL_NOTICE } = require('../config')

const Joi = require('joi')
const CommentSchema = require('../schemas/comment')

/**
 * 获取评论列表以及详情
 * @param {Number} commentId - 评论 id
 */
const fetchCommentDetail = commentId =>
  CommentModel.find({
    where: { id: commentId },
    attributes: ['id', 'userId', 'content', 'createdAt'],
    include: [
      {
        model: ReplyModel,
        attributes: ['content', 'createdAt'],
        include: [{ model: UserModel, as: 'user', attributes: ['username', 'email'] }]
      },
      { model: UserModel, as: 'user', attributes: ['username', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  })

/**
 * 获取评论列表
 * @param {Number} articleId - 根据文章 id 获取评论列表
 */
const fetchCommentList = articleId =>
  CommentModel.findAndCountAll({
    where: { articleId },
    attributes: ['id', 'userId', 'content', 'createdAt'],
    include: [
      {
        model: ReplyModel,
        attributes: ['id', 'userId', 'content', 'createdAt'],
        include: [{ model: UserModel, as: 'user', attributes: ['username'] }]
      },
      { model: UserModel, as: 'user', attributes: ['username'] }
    ],
    order: [['createdAt', 'DESC']]
  })

/**
 * 获取文章详情
 * @param {Number} articleId - 文章 id
 */
const fetchAritcleDetail = articleId => ArticleModel.findById(articleId)

module.exports = {
  // 创建评论
  async comment(ctx) {
    const { userId } = decodeToken(ctx)
    const { articleId, content } = ctx.request.body
    const validator = Joi.validate({ userId, articleId, content }, CommentSchema.createComment)
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message }
    } else {
      const comment = await CommentModel.create({ userId, articleId, content })
      const [result, detailData, article] = await Promise.all([
        fetchCommentList(articleId),
        fetchCommentDetail(comment.id),
        fetchAritcleDetail(articleId)
      ])
      const { html, subject } = getEmailData(detailData, article, true)
      ENABLE_EMAIL_NOTICE &&
        sendEmail({ receiver: emailTransporterConfig.auth.user, html, subject })
          .then(res => {
            console.log('发送成功')
          })
          .catch(err => {
            console.log('发送通知失败，尝试再次发送')
            sendEmail({ receiver: emailTransporterConfig.auth.user, html })
          })

      ctx.body = { code: 200, message: 'success', ...result }
    }
  },

  // 创建回复
  async reply(ctx) {
    const { userId } = decodeToken(ctx)
    const { articleId, content, commentId } = ctx.request.body

    const validator = Joi.validate({ userId, articleId, content, commentId }, CommentSchema.createReply)
    if (validator.error) {
      ctx.body = { code: 400, message: validator.error.message }
    } else {
      await ReplyModel.create({ userId, articleId, content, commentId })

      // 获取评论列表 和 评论详情（含个人 email，为保证个人隐私而设计）
      const [result, detailData, article] = await Promise.all([
        fetchCommentList(articleId),
        fetchCommentDetail(commentId),
        fetchAritcleDetail(articleId)
      ])

      const { emailList, html, subject } = getEmailData(detailData, article)

      ENABLE_EMAIL_NOTICE &&
        Promise.all(emailList.map(receiver => sendEmail({ receiver, html, subject })))
          .then(res => {
            console.log('发送成功', emailList)
          })
          .catch(err => {
            console.error(err) // 输出日志
            // 尝试再次发送
            console.log('===== 尝试再次发送中')
            emailList.forEach(receiver => sendEmail({ receiver, html }))
          })

      ctx.body = { code: 200, message: 'success', ...result }
    }
  },

  // 删除评论
  async del(ctx) {
    const isAuth = checkAuth(ctx)
    const { commentId, replyId } = ctx.query
    if (isAuth) {
      if (commentId) {
        await sequelize.query(
          `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.id=${commentId}`
        )
        ctx.body = { code: 200, message: '成功删除该评论！' }
      } else if (replyId) {
        await ReplyModel.destroy({ where: { id: replyId } })
        ctx.body = { code: 200, message: '成功删除该回复！' }
      } else {
        ctx.body = { code: 400, message: 'id 不能为空！' }
      }
    }
  },

  async getAboutComments(ctx) {
    const data = await fetchCommentList(-1)
    ctx.body = { code: 200, ...data }
  }
}
