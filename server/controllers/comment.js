// 评论控制器，包括回复内容
const { sequelize } = require('../models')
const { comment: CommentModel, reply: ReplyModel, user: UserModel } = require('../models')
const { decodeToken, checkAuth } = require('../lib/token')

const fetchCommentList = async articleId =>
  CommentModel.findAndCountAll({
    where: { articleId },
    attributes: ['id', 'userId', 'content'],
    include: [
      {
        model: ReplyModel,
        attributes: ['id', 'userId', 'content'],
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
    await ReplyModel.create({ userId, articleId, content, commentId })
    const data = await fetchCommentList(articleId)
    ctx.body = { code: 200, message: 'success', ...data }
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
