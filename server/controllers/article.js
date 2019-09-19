const Joi = require('joi')

// import models
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  sequelize
} = require('../models')

class ArticleController {
  // 初始化数据 关于页面（用于评论关联）
  static async initAboutPage() {
    const result = await ArticleModel.findOne({ where: { id: -1 } })
    if (!result) {
      ArticleModel.create({
        id: -1,
        title: '关于页面',
        content: '关于页面存档，勿删'
      })
    }
  }

  // 创建文章
  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number().required(),
      title: Joi.string().required(),
      content: Joi.string(),
      categoryList: Joi.array(),
      tagList: Joi.array()
    })

    if (validator) {
      try {
        const { title, content, categoryList = [], tagList = [], authorId } = ctx.request.body
        const tags = tagList.map(t => ({ name: t }))
        const categories = categoryList.map(c => ({ name: c }))
        const data = await ArticleModel.create(
          { title, content, authorId, tags, categories },
          { include: [TagModel, CategoryModel] }
        )
        ctx.client(200, '成功创建文章', data)
      } catch (error) {
        throw error
        // ctx.client(500, '失败创建文章') // authorId 要在 user 表中存在才可以创建，有关联关系
      }
    }
  }

  // 获取文章详情
  static async findById(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        id: Joi.number().required(),
        type: Joi.number() // type 用于区分是否增加浏览次数 1 新增浏览次数 0 不新增
      }
    )
    if (validator) {
      try {
        const data = await ArticleModel.findOne({
          where: { id: ctx.params.id },
          include: [
            // 查找 分类 标签 评论 回复...
            { model: TagModel, attributes: ['name'] },
            { model: CategoryModel, attributes: ['name'] },
            {
              model: CommentModel,
              attributes: ['id', 'content', 'createdAt'],
              include: [
                { model: UserModel, as: 'user', attributes: ['id', 'username', 'role', 'github'] },
                {
                  model: ReplyModel,
                  attributes: ['id', 'userId', 'content', 'createdAt'],
                  include: [{ model: UserModel, as: 'user', attributes: ['id', 'username', 'role', 'github'] }]
                }
              ]
            }
          ],
          order: [[CommentModel, 'createdAt', 'DESC']], // comment model order
          row: true
        })

        const { type = 1 } = ctx.query
        // viewer count ++
        type === 1 && ArticleModel.update({ viewCount: ++data.viewCount }, { where: { id: ctx.params.id } })

        // JSON.parse(github)
        data.comments.forEach(comment => {
          comment.user.github = JSON.parse(comment.user.github)
          comment.replies.forEach(reply => {
            reply.user.github = JSON.parse(reply.user.github)
          })
        })
        ctx.client(200, 'success', data)
      } catch (error) {
        throw error
      }
    }
  }

  // 获取文章列表
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string(), // 关键字查询
      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string()
    })

    if (validator) {
      try {
        const { page = 1, pageSize = 10, preview = 1, keyword = '', tag, category, order } = ctx.query
        const tagFilter = tag ? { name: tag } : null
        const categoryFilter = category ? { name: category } : null

        let articleOrder = [['createdAt', 'DESC']]
        if (order) {
          articleOrder = [order.split(' ')]
        }

        const data = await ArticleModel.findAndCountAll({
          where: {
            id: {
              $not: -1 // 过滤关于页面的副本
            },
            $or: {
              title: {
                $like: `%${keyword}%`
              },
              content: {
                $like: `%${keyword}%`
              }
            }
          },
          include: [
            { model: TagModel, attributes: ['name'], where: tagFilter },
            { model: CategoryModel, attributes: ['name'], where: categoryFilter },
            {
              model: CommentModel,
              attributes: ['id'],
              include: [{ model: ReplyModel, attributes: ['id'] }]
            }
          ],
          offset: (page - 1) * pageSize,
          limit: parseInt(pageSize),
          order: articleOrder,
          row: true,
          distinct: true // count 计算
        })
        if (preview === 1) {
          data.rows.forEach(d => {
            d.content = d.content.slice(0, 1000) // 只是获取预览，减少打了的数据传输。。。
          })
        }

        ctx.client(200, 'success', data)
      } catch (error) {
        ctx.client(500, '查找失败', error)
        throw error
      }
    }
  }

  // 修改文章
  static async update(ctx) {
    const validator = ctx.validate(
      {
        articleId: ctx.params.id,
        ...ctx.request.body
      },
      {
        articleId: Joi.number().required(),
        title: Joi.string(),
        content: Joi.string(),
        categories: Joi.array(),
        tags: Joi.array()
      }
    )
    if (validator) {
      const { title, content, categories = [], tags = [] } = ctx.request.body
      const articleId = parseInt(ctx.params.id)
      const tagList = tags.map(tag => ({ name: tag, articleId }))
      const categoryList = categories.map(cate => ({ name: cate, articleId }))
      await ArticleModel.update({ title, content }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)
      await CategoryModel.destroy({ where: { articleId } })
      await CategoryModel.bulkCreate(categoryList)
      ctx.client(200)
    }
  }

  // 删除文章
  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required()
    })
    if (validator) {
      const articleId = ctx.params.id
      await TagModel.destroy({ where: { articleId } })
      await ArticleModel.destroy({ where: { id: articleId } })
      await sequelize.query(
        // `
        //   delete article, tag, category, comment, reply
        //   from article
        //   left join comment on article.id=comment.articleId
        //   left join reply on comment.id=reply.commentId
        //   left join tag on article.id=tag.articleId
        //   left join category on article.id=category.articleId
        //   where article.id=${articleId}
        // `
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.articleId=${articleId}`
      )
      ctx.client(200)
    }
  }
}

module.exports = ArticleController
