import * as constants from '@/redux/constants'
import axios from '@/lib/axios'
import { message } from 'antd'

export const login = ({ username, password }) => {
  return dispatch =>
    axios.post('/login', { username, password }).then(res => {
      if (res.code === 200) {
        localStorage.setItem('token', res.token)
        dispatch({ type: constants.USER_LOGIN, payload: { token: res.token } })
      } else {
        message.error(res.message)
      }
    })
}

export const register = ({ username, password }) => {
  return dispatch =>
    axios.post('/register', { username, password }).then(res => {
      if (res.code === 200) message.success(res.message)
      else message.error(res.message)
    })
}

export const logout = () => {
  localStorage.removeItem('token')
  return { type: constants.USER_LOGINOUT }
}
