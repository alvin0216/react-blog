const Router = require('koa-router')
const router = new Router()
const UserController = require('../controllers/user')
const CommentController = require('../controllers/comment')

router.post('/comment', CommentController.comment) // 创建评论
router.post('/reply', CommentController.reply) // 创建回复
router.put('/:id', UserController.updateUser) // 更新账户信息
router.get('/getUserList', UserController.getUserList) // 获取用户列表
router.delete('/delete', UserController.delete) // 删除用户

module.exports = router
