const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')
const CommentController = require('../controllers/comment')

router.post('/login', UserController.login)
router.post('/register', UserController.register)

router.post('/comment', CommentController.comment) // 创建评论
router.post('/reply', CommentController.reply) // 创建回复

module.exports = router
