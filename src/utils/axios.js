import axios from 'axios'
import { API_BASE_URL } from '@/config'

import { message } from 'antd'
import store from '@/redux'
import { loginout } from '@/redux/user/actions'
import { getToken } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

let timer

// 拦截请求
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.common['Authorization'] = token
    }
    return config
  },
  error => {
    message.error('bed request')
    Promise.reject(error)
  }
)

// 拦截响应
service.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data
  },
  err => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (err.response) {
        const { status, data } = err.response
        switch (status) {
          case 401:
            store.dispatch(loginout())
            message.error((data && data.message) || '登录信息过期或未授权，请重新登录！')
            break

          default:
            message.error(data.message || `连接错误 ${status}！`)
            break
        }
      } else {
        message.error(err.message)
      }
    }, 200) // 200 毫秒内重复报错则只提示一次！

    return Promise.reject(err)
  }
)

export default service
