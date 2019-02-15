// 对错误统一处理
module.exports = (ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = { error: err.originalError ? err.originalError.message : err.message }
      ctx.body = 1
    } else {
      throw err
    }
  })
}
