import * as constants from '@/redux/constants'

// state
const defaultState = {
  colorList: ['magenta', 'blue', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'geekblue', 'purple'], // 标签颜色
  loginModalVisible: false,
  registerModalVisible: false
}

// reducer
export const commonReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case constants.AUTH_OPEN_AUTHMODAL:
      return { ...state, [`${payload}ModalVisible`]: true }

    case constants.AUTH_CLOSE_AUTHMODAL:
      return { ...state, [`${payload}ModalVisible`]: false }

    default:
      return state
  }
}

export default commonReducer
