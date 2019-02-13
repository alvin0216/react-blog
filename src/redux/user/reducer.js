import * as constants from '@/redux/constants'

// state
const defaultState = {
  username: '',
  auth: 2
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case constants.USER_LOGIN:
      return { ...state, ...payload }

    case constants.USER_LOGINOUT:
      return { username: '', auth: 2 }

    default:
      return state
  }
}

export default demoReducer
