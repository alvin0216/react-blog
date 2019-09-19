const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const logger = require('koa-logger')

//  config
const config = require('./config')

const router = require('./router')
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

app
  .use(cors())
  .use(bodyParser())
  .use(authHandler)
  .use(logger())

app.use(router.routes(), router.allowedMethods())

app.listen(config.PORT, () => {
  db.sequelize
    .sync({ force: false, logging: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
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
