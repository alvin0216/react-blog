const Router = require('koa-router')
const router = new Router()

// controllers
const UserController = require('../controllers/user')
const ArticleController = require('../controllers/article')
const DiscussController = require('../controllers/discuss')
const TagController = require('../controllers/tag')

// ==== article router
const articleRouter = new Router()

articleRouter
  .post('/', ArticleController.create) // 创建文章
  .get('/list', ArticleController.getList) // 获取文章列表
  .get('/:id', ArticleController.findById) // 获取文章
  .put('/:id', ArticleController.update) // 修改文章
  .delete('/:id', ArticleController.delete) // 删除指定文章

router.use('/article', articleRouter.routes())

// ==== discuss router
const discussRouter = new Router()

discussRouter
  .post('/', DiscussController.create) // 创建评论或者回复 articleId 文章 id
  .delete('/comment/:commentId', DiscussController.deleteComment) // 删除一级评论
  .delete('/reply/:replyId', DiscussController.deleteReply) // 删除回复

router.use('/discuss', discussRouter.routes())

// tag category
router.get('/tag/list', TagController.getTagList) // 获取所有的 tag 列表
router.get('/category/list', TagController.getCategoryList) // 获取 category 列表

// root
router.post('/login', UserController.login) // 登录
router.post('/register', UserController.register) // 注册

// user
const userRouter = new Router()

userRouter
  // ..
  .get('/list', UserController.getList) // 获取列表
  .put('/:userId', UserController.updateUser) // 更新用户信息
  .delete('/:userId', UserController.delete) // 删除用户

router.use('/user', userRouter.routes())

// ...
router.get('/', async ctx => {
  ctx.body = 'hello koa2'
})

module.exports = router
