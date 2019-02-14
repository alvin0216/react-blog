const moment = require('moment')
// article 表
module.exports = (sequelize, dataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      id: {
        type: dataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      articleId: dataTypes.INTEGER(11), // 评论所属文章 id
      content: { type: dataTypes.TEXT, allowNull: false }, // 评论详情
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

  Comment.associate = models => {
    Comment.belongsTo(models.article, {
      as: 'article',
      foreignKey: 'articleId',
      targetKey: 'id',
      constraints: false
    })

    Comment.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
      constraints: false
    })
    Comment.hasMany(models.reply, {
      foreignKey: 'commentId',
      sourceKey: 'id',
      constraints: false // 在表之间添加约束意味着当使用 sequelize.sync 时，表必须以特定顺序在数据库中创建表。我们可以向其中一个关联传递
    })
  }

  return Comment
}
