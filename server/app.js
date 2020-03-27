const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const error = require('koa-json-error')
const logger = require('koa-logger')

//  config
const config = require('./config')

const loadRouter = require('./router')
const db = require('./models')

// app...
const app = new Koa()
// context binding...
const context = require('./utils/context')
Object.keys(context).forEach(key => {
  app.context[key] = context[key] // 绑定上下文对象
})

// moddlewares
const authHandler = require('./middlewares/authHandler')
const path = require('path')

app
  .use(cors())
  .use(
    koaBody({
      multipart: true,
      formidable: {
        // uploadDir: path.resolve(__dirname, './upload'),
        keepExtensions: true, // 保持文件的后缀
        maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小最大限制，默认20M
      }
    })
  )
  .use(
    error({
      postFormat: (e, { stack, ...rest }) => (process.env.NODE_ENV !== 'development' ? rest : { stack, ...rest })
    })
  )
  .use(authHandler)
  .use(logger())

loadRouter(app)

app.listen(config.PORT, () => {
  db.sequelize
    .sync({ force: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
    .then(async () => {
      const initData = require('./initData')
      initData() // 创建初始化数据
      console.log('sequelize connect success')
      console.log(`sever listen on http://127.0.0.1:${config.PORT}`)
    })
    .catch(err => {
      console.log(err)
    })
})
