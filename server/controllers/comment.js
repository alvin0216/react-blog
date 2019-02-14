// 评论控制器，包括回复内容
const { sequelize } = require('../models')
const { comment: CommentModel, reply: ReplyModel, user: UserModel } = require('../models')
const { decodeToken } = require('../lib/token')

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
    const { userId, articleId, content, commentId } = ctx.request.body
    await ReplyModel.create({ userId, articleId, content, commentId })
    ctx.body = { code: 200, message: 'success' }
  }
}
