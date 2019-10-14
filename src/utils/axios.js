import axios from 'axios'
import { API_BASE_URL } from '@/config'

import { message } from 'antd'
import { clear, get } from '@/utils/storage'
import store from '@/redux'
import { USER_LOGIN_OUT } from '@/redux/types'
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
    if (response.headers['content-type'] && response.headers['content-type'].includes('text/markdown')) {
      return response.data.data || response.data
    }
    if (response.data.code !== 200) {
      response.data.message && message.warning(response.data.message)
      return Promise.reject(response.data)
    } else {
      return response.data.data || response.data
    }
  },
  err => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            // store.dispatch({ type: USER_LOGIN_OUT })
            message.error('登录信息过期或未授权，请重新登录！')
            break

          default:
            message.error(`连接错误 ${err.response.status}！`)
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
