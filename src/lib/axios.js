import axios from 'axios'
import { message } from 'antd'
import NProgress from 'nprogress'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:6060' : '', // api的base_url
  timeout: 20000 // 请求超时时间
})

//拦截请求
instance.interceptors.request.use(
  config => {
    NProgress.start()
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    message.error('bed request')
    // Do something with request error
    Promise.reject(error)
  }
)
//拦截响应
instance.interceptors.response.use(
  response => {
    NProgress.done()
    return response.data
  },
  error => {
    NProgress.done()
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('您未被授权，请重新登录')
          break
        case 500:
          message.error('服务器出问题了，请稍后再试')
          break
        default:
          message.error('未知异常')
          break
      }
      localStorage.clear()
    }
    return Promise.reject(error)
  }
)

export default instance
