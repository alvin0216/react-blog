const moment = require('moment')
// article 表
module.exports = (sequelize, dataTypes) => {
  const Tag = sequelize.define('tag', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: dataTypes.STRING(100),
      allowNull: false
    }
  })

  Tag.associate = models => {
    Tag.belongsTo(models.article, {
      as: 'article',
      foreignKey: 'articleId',
      targetKey: 'id',
      constraints: false
    })
  }

  return Tag
}
