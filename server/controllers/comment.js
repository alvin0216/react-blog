// 评论控制器，包括回复内容
const { sequelize } = require('../models')
const { comment: CommentModel, reply: ReplyModel, user: UserModel } = require('../models')
const { decodeToken, checkAuth } = require('../lib/token')
const sendEmail = require('../lib/sendEmail')

/**
 * 获取评论列表以及详情
 * @param {Number} commentId - 评论 id
 */
const getCommentDetail = async commentId => {
  res = await CommentModel.find({
    where: { id: commentId },
    include: [
      {
        model: ReplyModel,
        attributes: ['content'],
        include: [{ model: UserModel, as: 'user', attributes: ['email'] }]
      },
      { model: UserModel, as: 'user', attributes: ['email'] }
    ]
  })
  let emailList = [],
    contentList = []
  res.user.email && emailList.push(res.user.email)
  res.content && contentList.push(res.content)
  res.replies.forEach(reply => {
    const replyEmail = reply.user.email
    contentList.push(reply.content)
    replyEmail && !emailList.includes(replyEmail) && emailList.push(replyEmail)
  })
  return { emailList, contentList }
}

/**
 * 获取评论列表
 * @param {Number} articleId - 根据文章 id 获取评论列表
 */
const fetchCommentList = async articleId =>
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

module.exports = {
  // 创建评论
  async comment(ctx) {
    const { userId } = decodeToken(ctx)
    const { articleId, content } = ctx.request.body
    await CommentModel.create({ userId, articleId, content })

    const data = await fetchCommentList(articleId)

    ctx.body = { code: 200, message: 'success', ...data }
  },

  // 创建回复
  async reply(ctx) {
    const { userId } = decodeToken(ctx)
    const { articleId, content, commentId } = ctx.request.body
    // await ReplyModel.create({ userId, articleId, content, commentId })
    const result = await fetchCommentList(articleId)
    const list = await getCommentDetail(commentId)

    // console.log('==========================')
    // const emailList = getEmailList(result.rows, commentId)
    // console.log(result.rows)
    // console.log('==========================')
    ctx.body = { code: 200, message: 'success', ...result, ...list }
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
