// state
const defaultState = {
  categories: ['react', 'vue', 'javascript'],
  tags: ['react', 'vue', 'javascript'],
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  switch (action.type) {
    // case constants.DEMO_ADD_COUNT:
    //   return { ...state, count: ++state.count }

    // case constants.DEMO_LOGIN:
    //   return { ...state, isLogin: true }

    // case constants.DEMO_LOGINOUT:
    //   return { ...state, isLogin: false }

    default:
      return state
  }
}

export default demoReducer
