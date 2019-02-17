import axios from 'axios'
import { message } from 'antd'
// import NProgress from 'nprogress'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:6060' : 'http://127.0.0.1:6060', // api的base_url
  timeout: 20000 // 请求超时时间
})

//拦截请求
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    message.error('bed request')
    Promise.reject(error)
  }
)
//拦截响应
instance.interceptors.response.use(
  response => {
    if (response.data.code === 401 && response.data.message) message.warning(response.data.message)
    return response.data
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          message.error('错误请求')
          break
        case 401:
          localStorage.clear()
          message.error('您暂无权限进行此操作，请联系管理员！')
          break
        case 403:
          message.error('拒绝访问！')
          break
        case 404:
          message.error('请求错误,未找到该资源！')
          break
        case 500:
          message.err('服务器出问题了，请稍后再试！')
          break
        default:
          message.err(`连接错误 ${err.response.status}！`)
          break
      }
    } else {
      message.error('服务器出了点小问题，请稍后再试！')
    }
    return Promise.reject(err)
  }
)

export default instance
