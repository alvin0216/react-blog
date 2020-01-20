const moment = require('moment')

module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
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
        allowNull: false
        // unique: true
      },
      password: {
        type: dataTypes.STRING,
        comment: '通过 bcrypt 加密后的密码' // 仅限站内注册用户
      },
      email: {
        type: dataTypes.STRING(50)
      },
      notice: {
        type: dataTypes.BOOLEAN, // 是否开启邮件通知
        defaultValue: true
      },
      role: {
        type: dataTypes.TINYINT,
        defaultValue: 2,
        comment: '用户权限：1 - admin, 2 - 普通用户'
      },
      github: {
        type: dataTypes.TEXT // github 登录用户 直接绑定在 user 表
      },
      disabledDiscuss: {
        type: dataTypes.BOOLEAN, // 是否禁言
        defaultValue: false
      },
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

  User.associate = models => {
    User.hasMany(models.comment)
    User.hasMany(models.reply)
    User.hasMany(models.ip)
  }

  return User
}
