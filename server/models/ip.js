// ip 表
module.exports = (sequelize, dataTypes) => {
  const Ip = sequelize.define('ip', {
    id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
    ip: { type: dataTypes.TEXT, allowNull: false }, // ip 地址
    auth: { type: dataTypes.BOOLEAN, defaultValue: true } // 是否可用
  })

  Ip.associate = models => {
    Ip.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
      constraints: false
    })
  }
  return Ip
}
