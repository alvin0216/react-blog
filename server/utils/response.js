// response 设置

// 状态码的匹配列表
const codeMapList = [
  { code: 200, message: 'success' },
  { code: 400, message: 'Bad Request' }, // 客户端请求的语法错误，服务器无法理解
  { code: 401, message: 'Unauthorized' }, // 请求要求用户的身份认证
  { code: 403, message: 'Forbidden' }, // 服务器理解请求客户端的请求，但是拒绝执行此请求
  { code: 404, message: 'Not Found' }, // 服务器无法根据客户端的请求找到资源
  { code: 500, message: 'Internal Server Error' } // 服务器内部错误，无法完成请求
]

/**
 * @param {Number} code - 状态码[status code] required
 * @param {String} message - 提示语
 * @param {any} data - 返回给客户端的值
 *
 * @example app.context.client = func , ctx.client(200)
 */
module.exports = function(code = 200, message, data = null) {
  this.response.set('Content-Type', 'application/json')
  const item = codeMapList.find(d => d.code === code)
  const targetMessage = item ? item.message : ''

  this.response.body = {
    code,
    message: message || targetMessage,
    data
  }
}
