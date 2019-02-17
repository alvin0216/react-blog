import * as constants from '@/redux/constants'
import jwtDecode from 'jwt-decode'

// state
let defaultState = {
  userId: 0,
  username: '',
  auth: 0,
  avatarColor: '#52c41a' // 用户头像颜色
}

if (localStorage.token) {
  const { userId, username, auth } = jwtDecode(localStorage.token)
  defaultState = Object.assign(defaultState, { userId, username, auth })
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case constants.USER_LOGIN:
      const { userId, username, auth } = jwtDecode(payload.token)
      return { ...state, userId, username, auth }

    case constants.USER_LOGINOUT:
      return { id: 0, username: '', auth: 0, avatarColor: '#52c41a' }

    default:
      return state
  }
}

export default demoReducer
