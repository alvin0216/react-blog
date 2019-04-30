const Joi = require('joi')

const create = Joi.object().keys({
  title: Joi.string()
    .required()
    .error(new Error('标题不能为空')),
  content: Joi.string(),
  categories: Joi.array(),
  tags: Joi.array()
})

const update = Joi.object().keys({
  articleId: Joi.number(),
  title: Joi.string()
    .required()
    .error(new Error('标题不能为空')),
  content: Joi.string(),
  categories: Joi.array(),
  tags: Joi.array()
})

const getArticleList = Joi.object().keys({
  page: Joi.number(),
  pageSize: Joi.number(),
  title: Joi.string().allow(''),
  tag: Joi.string().allow(''),
  category: Joi.string().allow('')
})

module.exports = {
  create,
  update,
  getArticleList
}
