import * as constants from '@/redux/constants'
import axios from '@/lib/axios'
import { message } from 'antd'

export const login = ({ username, password }) => {
  return dispatch =>
    axios.post('/user/login', { username, password }).then(res => {
      if (res.code === 200) {
        const { username, auth } = res
        dispatch({ type: constants.USER_LOGIN, payload: { username, auth } })
      } else {
        message.error(res.message)
      }
    })
}

export const register = ({ username, password }) => {
  return dispatch =>
    axios.post('/user/register', { username, password }).then(res => {
      if (res.code === 200) message.success(res.message)
      else message.error(res.message)
    })
}

export const loginout = () => {
  return { type: constants.USER_LOGINOUT }
}
