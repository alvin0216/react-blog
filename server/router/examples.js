const Router = require('koa-router')
const router = new Router()
const ExampleController = require('../controllers/examples')

router.get('/', async ctx => {
  ctx.body = 'exmaples router test'
})

router.post('/login', ExampleController.login)
router.post('/register', ExampleController.register)

module.exports = router
