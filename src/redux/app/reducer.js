import * as TYPES from '@/redux/types'

// state
const defaultState = {
  count: 1,
  windowWidth: 0,
  signModal: {
    visible: false,
    type: 'login'
  }
}

// reducer
export const appReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.APP_DEMO_ADD_COUNT:
      return { ...state, count: ++state.count }

    case TYPES.APP_UPDATE_WINDOW_WIDTH:
      return { ...state, windowWidth: payload }

    case TYPES.APP_SWITCH_SIGN_MODAL:
      return { ...state, signModal: payload }

    default:
      return state
  }
}

export default appReducer
