const moment = require('moment')
// article 表
module.exports = (sequelize, dataTypes) => {
  const Article = sequelize.define(
    'article',
    {
      id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
      title: { type: dataTypes.STRING(255), allowNull: false },
      content: { type: dataTypes.TEXT },
      createdAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      updatedAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    {
      timestamps: true
    }
  )

  Article.associate = models => {
    Article.hasMany(models.tag)
    Article.hasMany(models.category)
    Article.hasMany(models.comment)
  }

  return Article
}
