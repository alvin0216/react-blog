const Joi = require('joi')

const regiester = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .required()
    .error(new Error('用户名不能为空')), // required => default child "username" fails because ["username" is required]
  password: Joi.string()
    .required()
    .error(new Error('密码不能为空')),
  email: Joi.string()
    .email()
    .required()
})

const login = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required()
})

/**
 *
 * @param {Number} type - 更新类型
 *
 * 0 绑定邮箱 - email
 * 1 更新用户名 username oldPassword
 * 2 更新密码  username password oldPassword
 *
 */
const updateUser = type => {
  const email = Joi.string()
      .email()
      .required(),
    username = Joi.string().alphanum(),
    password = Joi.string().alphanum(),
    oldPassword = Joi.string().alphanum()

  const typeMap = [{ email }, { username, oldPassword }, { username, password, oldPassword }]

  return Joi.object().keys(typeMap[type])
}

module.exports = {
  regiester,
  login,
  updateUser
}
