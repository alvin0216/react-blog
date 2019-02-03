const Router = require('koa-router')
const router = new Router()
const ArticleController = require('../controllers/article')

router.post('/create', ArticleController.create)
router.put('/update', ArticleController.update)
router.get('/get/:id', ArticleController.getArticleById)
router.get('/getList', ArticleController.getArticleList)
router.delete('/delete', ArticleController.delete)

module.exports = router
