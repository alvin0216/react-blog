const Router = require('koa-router')
const router = new Router()

router.get('/', async ctx => {
  ctx.body = 'exmaples router test'
})

module.exports = router
