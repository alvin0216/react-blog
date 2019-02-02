module.exports = (sequelize, dataTypes) => {
  return sequelize.define(
    'user',
    {
      // id sequelize 默认创建...
      id: {
        type: dataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: dataTypes.STRING(50),
        // primaryKey: true,
        allowNull: false,
        unique: true
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
        comment: '通过 bcrypt 加密后的密码'
      },
      auth: {
        type: dataTypes.TINYINT,
        defaultValue: 0,
        comment: '用户权限：0 - 普通用户, 1 - admin'
      }
    },
    {
      timestamps: false // 不创建 createAt / updateAt 字段
    }
  )
}
