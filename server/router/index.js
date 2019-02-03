const router = require('koa-router')()
const examplesRouter = require('./examples')
const ArticleRouter = require('./article')

router.use('/examples', examplesRouter.routes())
router.use('/article', ArticleRouter.routes())

router.get('/', async ctx => {
  ctx.body = 'hello koa2'
})

module.exports = router
