const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')

router.post('/login', UserController.login)
router.post('/register', UserController.register)

module.exports = router
