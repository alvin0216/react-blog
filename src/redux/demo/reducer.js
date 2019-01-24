import * as constants from '@/redux/constants'

// state
const defaultState = {
  count: 11,
  isLogin: false
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case constants.DEMO_ADD_COUNT:
      return { ...state, count: ++state.count }

    case constants.DEMO_LOGIN:
      return { ...state, isLogin: true }

    case constants.DEMO_LOGINOUT:
      return { ...state, isLogin: false }

    default:
      return state
  }
}

export default demoReducer
