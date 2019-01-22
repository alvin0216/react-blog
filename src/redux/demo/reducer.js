import * as constants from '@/redux/constants'

// state
const defaultState = {
  count: 11
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case constants.DEMO_ADD_COUNT:
      return { ...state, count: ++state.count }
    default:
      return state
  }
}

export default demoReducer