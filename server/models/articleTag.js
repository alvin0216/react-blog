module.exports = (sequelize, dataTypes) => {
  return sequelize.define(
    'articleTag',
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {
      timestamps: false // 不创建 createAt / updateAt 字段
    }
  )
}
