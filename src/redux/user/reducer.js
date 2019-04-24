import * as constants from '@/redux/constants'
import jwtDecode from 'jwt-decode'

// state
let defaultState = {
  userId: 0,
  username: '',
  auth: 0,
  email: '',
  avatarColor: '#52c41a' // 用户头像颜色
}

if (!!localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
  const { userId, username, auth, email } = jwtDecode(localStorage.token)
  defaultState = Object.assign(defaultState, { userId, username, auth, email })
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case constants.USER_LOGIN:
      const { userId, username, auth, email } = jwtDecode(payload.token)
      return { ...state, userId, username, auth, email }

    case constants.USER_LOGINOUT:
      return { id: 0, username: '', auth: 0, avatarColor: '#52c41a', email: '' }

    default:
      return state
  }
}

export default demoReducer
