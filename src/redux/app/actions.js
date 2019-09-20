import * as TYPES from '@/redux/types'

// actions
export const addCount = () => ({ type: TYPES.APP_DEMO_ADD_COUNT })

// 获取视口宽度
export const getWindowWidth = () => {
  const body = document.getElementsByTagName('body')[0]
  return { type: TYPES.APP_UPDATE_WINDOW_WIDTH, payload: body.clientWidth }
}

// 切换登录注册框
export const switchSignModal = (type, visible) => ({
  type: TYPES.APP_SWITCH_SIGN_MODAL,
  payload: {
    type,
    visible
  }
})
