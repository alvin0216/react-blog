// 评论控制器，包括回复内容
const { sequelize } = require('../models')
const { comment: CommentModel, reply: ReplyModel } = require('../models')

module.exports = {
  // 创建评论
  async comment(ctx) {
    const { userId, articleId, content } = ctx.request.body
    await CommentModel.create({ userId, articleId, content })
    ctx.body = { code: 200, message: 'success' }
  },

  // 创建回复
  async reply(ctx) {
    const { userId, articleId, content, commentId } = ctx.request.body
    await ReplyModel.create({ userId, articleId, content, commentId })
    ctx.body = { code: 200, message: 'success' }
  }
}
