const { article: ArticleModel, tag: TagModel, category: CategoryModel } = require('../models')
const { sequelize } = require('../models')

module.exports = {
  // 创建文章
  async create(ctx) {
    const { title, content, categories, tags } = ctx.request.body
    const tagList = tags.map(t => ({ name: t }))
    const categoryList = categories.map(c => ({ name: c }))
    await ArticleModel.create(
      { title, content, tags: tagList, categories: categoryList },
      { include: [TagModel, CategoryModel] }
    )
    ctx.body = { code: 200, message: '成功创建文章' }
  },

  // 修改文章
  async update(ctx) {
    const { articleId, title, content, category, tags } = ctx.request.body
    if (articleId) {
      const tagList = tags.map(tag => ({ name: tag, articleId }))
      await ArticleModel.update({ title, content, category }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)

      ctx.body = { code: 200, message: '成功修改文章' }
    } else {
      ctx.body = { code: 403, message: '文章 id 不能为空' }
    }
  },

  // 获取文章详情
  async getArticleById(ctx) {
    const id = ctx.params.id
    const data = await ArticleModel.findOne({
      where: { id },
      include: [{ model: TagModel, attributes: ['name'] }, { model: CategoryModel, attributes: ['name'] }]
    })
    ctx.body = { code: 200, data }
  },

  /**
   * 查询文章列表
   *
   * @param {Number} offset - 当前页码 默认1
   * @param {Number} limit - 限制查询数量 默认 15
   * ...
   */
  async getArticleList(ctx) {
    let { page = 1, pageSize = 10 } = ctx.query,
      offset = (page - 1) * pageSize

    pageSize = parseInt(pageSize)

    const data = await ArticleModel.findAndCountAll({
      include: [{ model: TagModel, attributes: ['name'] }, { model: CategoryModel, attributes: ['name'] }],
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      distinct: true
    })

    ctx.body = { code: 200, ...data }
  },

  // 删除文章
  async delete(ctx) {
    const { articleId } = ctx.request.body
    if (articleId) {
      await TagModel.destroy({ where: { articleId } })
      await ArticleModel.destroy({ where: { id: articleId } })
      ctx.body = { code: 200, message: '成功删除文章' }
    } else {
      ctx.body = { code: 403, message: '文章 id 不能为空' }
    }
  }
}
