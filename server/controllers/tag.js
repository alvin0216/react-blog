const { sequelize } = require('../models')
const { tag: TagModel, article: ArticleModel, category: CategoryModel } = require('../models')

module.exports = {
  async getTags(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name'
    })
    ctx.body = { code: 200, data }
  },

  async getArticlesByTag(ctx) {
    let { page = 1, pageSize = 15, name } = ctx.query,
      offset = (page - 1) * pageSize

    pageSize = parseInt(pageSize)

    const data = await ArticleModel.findAndCountAll({
      attributes: ['id', 'title', 'createdAt'],
      include: [{ model: TagModel, where: { name } }, { model: CategoryModel }],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    ctx.body = { code: 200, ...data }
  }
}
