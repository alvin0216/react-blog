const Router = require('koa-router')
const router = new Router({ prefix: '/article' })
const {
  create,
  getList,
  output,
  upload,
  checkExist,
  uploadConfirm,
  outputAll,
  findById,
  update,
  delete: del,
  outputList,
  delList
} = require('../controllers/article')

router
  .post('/', create) // 创建文章
  .get('/list', getList) // 获取文章列表
  .get('/md/:id', output) // 导出指定文章
  .post('/upload', upload) // 上传文章
  .post('/checkExist', checkExist) // 确认文章是否存在
  .post('/upload/confirm', uploadConfirm) // 确认上传的文章 读取 upload 文件文章 插入数据库
  .get('/output/all', outputAll) // 导出所有文章
  .get('/output/:id', output) // 导出文章
  .get('/output/list/:list', outputList) // 导出指定文章
  .get('/:id', findById) // 获取文章
  .put('/:id', update) // 修改文章
  .delete('/list/:list', delList) // 删除指定文章列表
  .delete('/:id', del) // 删除指定文章

module.exports = router
