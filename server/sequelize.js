// sequelize test

const Sequelize = require('sequelize')

const sequelize = new Sequelize('demo', 'root', '123456', {
  host: 'localhost', // 连接的 host 地址
  dialect: 'mysql', // 连接到 mysql
  port: 3306 // 数据库服务器端口
})

const UserModel = sequelize.define('user', {
  firstName: Sequelize.STRING,
  lastName: {
    type: Sequelize.STRING
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully')
    User.sync({ force: true }).then(async () => {
      // UserModel
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
