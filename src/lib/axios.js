import axios from 'axios'
import { message } from 'antd'

const instance = axios.create({
  // baseURL: 'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api', // api的base_url
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
    // Do something with request error
    Promise.reject(error)
  }
)
//拦截响应
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    message.error(error.response.statusText)
    return Promise.reject(error)
  }
)

export default instance
