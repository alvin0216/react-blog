const { checkToken } = require('../utils/token')

/**
 * role === 1 需要权限的路由
 * @required 'all': get post put delete 均需要权限。
 */
const verifyList1 = [
  { regexp: /\/article/, required: 'post, put, delete' }, // 普通用户 禁止修改或者删除、添加文章
  { regexp: /\/discuss/, required: 'delete' }, // 普通用户 禁止删除评论
  { regexp: /\/user/, required: 'get, put, delete' } // 普通用户 禁止获取用户、修改用户、以及删除用户
]

// role === 2 需要权限的路由
const verifyList2 = [
  { regexp: /\/discuss/, required: 'post' } // 未登录用户 禁止评论
]

function checkAuth(method, url) {
  function _verify(list, role) {
    const target = list.find(v => {
      if (v.regexp.test(url)) {
        return v.required === 'all' || v.required.toUpperCase().includes(method)
      }
    })

    return target ? { role, auth: true } : null
  }

  const temp = [_verify(verifyList1, 1), _verify(verifyList2, 2)].filter(Boolean)

  return temp
}

// auth example token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoyLCJpZCI6MSwiaWF0IjoxNTY3MDcyOTE4LCJleHAiOjE1Njk2NjQ5MTh9.-V71bEfuUczUt_TgK0AWUJTbAZhDAN5wAv8RjmxfDKI
module.exports = async (ctx, next) => {
  const authList = checkAuth(ctx.method, ctx.url)
  //  该路由需要验证
  if (authList.length > 0) {
    const isAuth = authList.every(item => checkToken(ctx, item.role)) // 每一项都通过
    if (isAuth) {
      await next()
    } else {
      ctx.status = 401
      ctx.client(401)
    }
  } else {
    await next()
  }
}
