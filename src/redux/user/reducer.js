import * as constants from '@/redux/constants'
import jwtDecode from 'jwt-decode'

// state
let defaultState = {
  id: 0,
  username: '',
  auth: 2
}

if (localStorage.token) {
  const { id, username, auth } = jwtDecode(localStorage.token)
  defaultState = { id, username, auth }
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case constants.USER_LOGIN:
      const { id, username, auth } = jwtDecode(payload.token)
      return { ...state, id, username, auth }

    case constants.USER_LOGINOUT:
      return { username: '', auth: 2 }

    default:
      return state
  }
}

export default demoReducer
