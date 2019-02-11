const { sequelize } = require('../models')
const { category: CategoryModel } = require('../models')

module.exports = {
  async getCategories(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name'
    })
    ctx.body = { code: 200, data }
  }
}
