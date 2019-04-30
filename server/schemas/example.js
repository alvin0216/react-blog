const Joi = require('joi') // https://github.com/hapijs/joi/blob/v13.1.0/API.md

let demoSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum() // 字母数字
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number()
    .integer()
    .min(1900)
    .max(2013),
  email: Joi.string().email(),
  website: Joi.string().uri({
    scheme: ['git', /git\+https?/]
  }),
  search: Joi.string().allow(''),
  type: Joi.string()
    .valid('disabled', 'normal', 'all')
    .default('all'),
  startTime: Joi.date()
    .min('1-1-1974')
    .max('now'),
  endTime: Joi.when(Joi.ref('startTime'), { is: Joi.date().required(), then: Joi.date().max('1-1-2100') }),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  pageSize: Joi.number()
    .integer()
    .default(8),
  deleteWhenLtTen: Joi.number()
    .integer()
    .max(10)
    .strip(),
  arraySelect: Joi.array().items(
    Joi.string()
      .label('My string')
      .required(),
    Joi.number().required()
  )
})

// use
const loginSchema = Joi.object().keys({
  username: Joi.string()
    .required()
    .description('用户名')
    .error(new Error('用户名不能为空')), // error.message (default child "username" fails because ["username" is required])
  password: Joi.string().required()
})

const testSchema = Joi.object().keys({
  username: Joi.string()
    .required()
    .description('用户名')
})

const validator = Joi.validate({ username: '22', aa: 1 }, testSchema, {
  allowUnknown: true, // 允许其他参数 如 aa
  abortEarly: true, // 如果为true，则停止对第一个错误的验证，否则返回找到的所有错误。 默认为 true
  convert: true // 如果为true，则尝试将值强制转换为所需类型（例如，将字符串转换为数字）。 默认为true
})

if (validator.error) {
  console.log(validator.error.message)
} else {
  console.log('验证通过', validator.value)
}
