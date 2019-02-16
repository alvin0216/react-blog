const router = require('koa-router')()
const examplesRouter = require('./examples')
const ArticleRouter = require('./article')
const UserRouter = require('./user')
const TagController = require('../controllers/tag')
const CategoryController = require('../controllers/category')
const UserController = require('../controllers/user')
const CommentController = require('../controllers/comment')

router.use('/examples', examplesRouter.routes())
router.use('/article', ArticleRouter.routes())
router.use('/user', UserRouter.routes())

// 登录注册
router.post('/login', UserController.login)
router.post('/register', UserController.register)

// 获取所有标签以及每个标签的总数
router.get('/tags/getList', TagController.getTags)
//根据标签的名字获取文章
router.get('/tags/getArticles', TagController.getArticlesByTag)

// 获取所有分类以及分类的总数
router.get('/categories/getList', CategoryController.getCategories)
router.get('/categories/getArticles', CategoryController.getArticlesByCate)

// 删除评论
router.delete('/comment/del', CommentController.del)
router.delete('/reply/del', CommentController.del)
router.get('/comment/getAboutComments', CommentController.getAboutComments)

router.get('/', async ctx => {
  ctx.body = 'hello koa2'
})

module.exports = router
