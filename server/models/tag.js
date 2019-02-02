const moment = require('moment')
// article 表
module.exports = (sequelize, dataTypes) => {
  const Tag = sequelize.define(
    'tag',
    {
      id: {
        type: dataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: dataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      timestamps: false // 不创建 createAt / updateAt 字段
    }
  )

  Tag.associate = models => {
    Tag.belongsToMany(models.article, { through: 'articleTag' })
  }

  return Tag
}
