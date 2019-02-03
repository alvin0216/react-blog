// 测试表
module.exports = (sequelize, dataTypes) => {
  return sequelize.define('example', {
    // id sequelize 默认创建...
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    artcle: {
      type: dataTypes.TEXT
    },
    username: {
      type: dataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false
    }
  })
}
