// sequelize test

const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = new Sequelize('demo', 'root', '123456', {
  host: 'localhost', // 连接的 host 地址
  dialect: 'mysql', // 连接到 mysql
  port: 3306 // 数据库服务器端口
})

const Article = sequelize.define('article', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT
  },
  category: {
    type: Sequelize.STRING(50)
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

const Tag = sequelize.define(
  'tag',
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    }
  },
  {
    timestamps: false // 不创建 createAt / updateAt 字段
  }
)

const ArticleTag = sequelize.define(
  'articleTag',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: Sequelize.STRING
  },
  {
    timestamps: false // 不创建 createAt / updateAt 字段
  }
)

// Article.hasMany(Tag)
Tag.belongsToMany(Article, { through: ArticleTag })
Article.belongsToMany(Tag, { through: ArticleTag })

sequelize.sync({ force: true }).then(async () => {
  const article = await Article.create({
    title: '11',
    content: 'aa',
    category: 'cc'
  })
  const tag1 = await Tag.create({ name: 'react.js' })
  const tag2 = await Tag.create({ name: 'vue.js' })
  // console.log(article.)
  await article.addTags([tag1, tag2])
})
