const router = require('koa-router')()
const examplesRouter = require('./examples')

router.use('/examples', examplesRouter.routes())
router.get('/', async ctx => {
  ctx.body = 'hello koa2'
})

module.exports = router
