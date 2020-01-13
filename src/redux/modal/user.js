import * as TYPES from '@/redux/types'
import axios from '@/utils/axios'
import { message } from 'antd'
import { save, get, remove } from '@/utils/storage'

export const login = params => {
  return dispatch =>
    axios.post('/login', params).then(res => {
      dispatch({
        type: TYPES.USER_LOGIN,
        payload: res
      })
      message.success(`登录成功, 欢迎您 ${res.username}`)
      return res
    })
}

export const register = params => {
  return dispatch =>
    axios.post('/register', params).then(res => {
      message.success('注册成功，请重新登录您的账号！')
    })
}

export const loginout = () => ({
  type: TYPES.USER_LOGIN_OUT
})

// ====== state
let defaultState = {
  username: '',
  role: 2,
  userId: 0,
  github: null
}

const userInfo = get('userInfo')

if (userInfo) {
  defaultState = { ...defaultState, ...userInfo }
}

// console.log('%c defaultState', 'background: yellow', defaultState)
/**
 * UserReducer
 */
export default function UserReducer(state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case TYPES.USER_LOGIN:
      const { username, userId, role, github = null, token } = payload
      save('userInfo', { username, userId, role, github, token })
      return { ...state, username, userId, role, github }

    case TYPES.USER_LOGIN_OUT:
      remove('userInfo')
      return { ...state, username: '', userId: 0, role: 2, github: null }

    default:
      return state
  }
}
