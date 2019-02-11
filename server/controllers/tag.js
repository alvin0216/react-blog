const { sequelize } = require('../models')
const { tag: TagModel } = require('../models')

module.exports = {
  async getTags(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name'
    })
    ctx.body = { code: 200, data }
  },

  async getArticlesByTag(ctx) {
    const { name } = ctx.params
  }
}
