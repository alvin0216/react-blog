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

const fs = require('fs')
const { uploadPath, outputPath, findOrCreateFilePath, decodeFile, generateFile } = require('../utils/file')
const archiver = require('archiver') // 打包 zip
const send = require('koa-send') // 文件下载

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
      const { title, content, categoryList = [], tagList = [], authorId } = ctx.request.body
      const result = await ArticleModel.findOne({ where: { title } })
      if (result) {
        ctx.throw(403, '创建失败，该文章已存在！')
      } else {
        const tags = tagList.map(t => ({ name: t }))
        const categories = categoryList.map(c => ({ name: c }))
        const data = await ArticleModel.create(
          { title, content, authorId, tags, categories },
          { include: [TagModel, CategoryModel] }
        )
        ctx.body = data
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
      ctx.body = data
    }
  }

  // 获取文章列表
  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string().allow(''), // 关键字查询
      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string()
    })

    if (validator) {
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

      ctx.body = data
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
      ctx.status = 204
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
      ctx.status = 204
    }
  }

  // 删除多个文章
  static async delList(ctx) {
    const validator = ctx.validate(ctx.params, {
      list: Joi.string().required()
    })

    if (validator) {
      const list = ctx.params.list.split(',')
      console.log(list)
      await TagModel.destroy({ where: { articleId: list } })
      await ArticleModel.destroy({ where: { id: list } })
      await sequelize.query(
        `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.articleId in (${list})`
      )
      ctx.status = 204
    }
  }

  /**
   * 确认文章是否存在
   *
   * @response existList: 数据库中已存在有的文章（包含文章的具体内容）
   * @response noExistList: 解析 md 文件 并且返回数据库中不存在的 具体有文件名 解析后的文件标题
   */
  static async checkExist(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      fileNameList: Joi.array().required()
    })

    if (validator) {
      const { fileNameList } = ctx.request.body
      const list = await Promise.all(
        fileNameList.map(async fileName => {
          const filePath = `${uploadPath}/${fileName}`
          const file = decodeFile(filePath)
          const title = file.title || fileName.replace(/\.md/, '')
          const article = await ArticleModel.findOne({ where: { title }, attributes: ['id'] })
          const result = { fileName, title }
          if (article) {
            result.exist = true
            result.articleId = article.id
          }
          return result
        })
      )
      ctx.body = list
    }
  }

  // 上传文章
  static async upload(ctx) {
    const file = ctx.request.files.file // 获取上传文件

    await findOrCreateFilePath(uploadPath) // 创建文件目录

    const upload = file => {
      const reader = fs.createReadStream(file.path) // 创建可读流
      const fileName = file.name
      const filePath = `${uploadPath}/${fileName}`
      const upStream = fs.createWriteStream(filePath)
      reader.pipe(upStream)

      reader.on('end', function() {
        console.log('上传成功')
      })
    }
    Array.isArray(file) ? file.forEach(it => upload(it)) : upload(file)
    ctx.status = 204
  }

  // 确认插入文章
  static async uploadConfirm(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number(),
      uploadList: Joi.array()
    })
    if (validator) {
      const { uploadList, authorId } = ctx.request.body
      await findOrCreateFilePath(uploadPath) // 检查目录
      // const insertList = []
      // const updateList = []
      // uploadList.forEach(file => {
      //   file.exist ? updateList.push(file) : insertList.push(file)
      // })

      const _parseList = list => {
        return list.map(item => {
          const filePath = `${uploadPath}/${item.fileName}`
          const result = decodeFile(filePath)
          const { title, date, categories = [], tags = [], content } = result
          const data = {
            title: title || item.fileName.replace(/\.md/, ''),
            categories: categories.map(d => ({ name: d })),
            tags: tags.map(d => ({ name: d })),
            content,
            authorId
          }
          if (date) data.createdAt = date
          if (item.articleId) data.articleId = item.articleId
          return data
        })
      }

      const list = _parseList(uploadList)
      const updateList = list.filter(d => !!d.articleId)
      const insertList = list.filter(d => !d.articleId)

      // 插入文章
      const insertResultList = await Promise.all(
        insertList.map(data => ArticleModel.create(data, { include: [TagModel, CategoryModel] }))
      )

      const updateResultList = await Promise.all(
        updateList.map(async data => {
          const { title, content, categories = [], tags = [], articleId } = data
          await ArticleModel.update({ title, content }, { where: { id: articleId } })
          await TagModel.destroy({ where: { articleId } })
          await TagModel.bulkCreate(tags)
          await CategoryModel.destroy({ where: { articleId } })
          await CategoryModel.bulkCreate(categories)
          return ArticleModel.findOne({ where: { id: articleId } })
        })
      )

      ctx.body = { message: 'success', insertList: insertResultList, updateList: updateResultList }
    }
  }

  // 导出文章
  static async output(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required()
    })

    if (validator) {
      const article = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 查找 分类
          { model: TagModel, attributes: ['name'] },
          { model: CategoryModel, attributes: ['name'] }
        ]
      })

      const { filePath, fileName } = await generateFile(article)
      ctx.attachment(decodeURI(fileName))
      await send(ctx, fileName, { root: outputPath })
    }
  }

  static async outputList(ctx) {
    const validator = ctx.validate(ctx.params, {
      list: Joi.string().required()
    })
    if (validator) {
      const articleList = ctx.params.list.split(',')

      const list = await ArticleModel.findAll({
        where: {
          id: articleList
        },
        include: [
          // 查找 分类
          { model: TagModel, attributes: ['name'] },
          { model: CategoryModel, attributes: ['name'] }
        ]
      })

      // const filePath = await generateFile(list[0])
      await Promise.all(list.map(article => generateFile(article)))

      // 打包压缩 ...
      const zipName = 'mdFiles.zip'
      const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
      const zip = archiver('zip')
      zip.pipe(zipStream)
      list.forEach(item => {
        zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
          name: `${item.title}.md` // 压缩文件名
        })
      })
      await zip.finalize()

      ctx.attachment(decodeURI(zipName))
      await send(ctx, zipName, { root: outputPath })
    }
  }

  static async outputAll(ctx) {
    const list = await ArticleModel.findAll({
      where: {
        id: {
          $not: -1 // 过滤关于页面的副本
        }
      },
      include: [
        // 查找 分类
        { model: TagModel, attributes: ['name'] },
        { model: CategoryModel, attributes: ['name'] }
      ]
    })

    // const filePath = await generateFile(list[0])
    await Promise.all(list.map(article => generateFile(article)))

    // 打包压缩 ...
    const zipName = 'mdFiles.zip'
    const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
    const zip = archiver('zip')
    zip.pipe(zipStream)
    list.forEach(item => {
      zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
        name: `${item.title}.md` // 压缩文件名
      })
    })
    await zip.finalize()

    ctx.attachment(decodeURI(zipName))
    await send(ctx, zipName, { root: outputPath })
  }
}

module.exports = ArticleController
