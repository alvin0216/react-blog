import * as constants from '@/redux/constants'

/**
 * 打开对话框
 * @param {String} type login / register
 */
export const openAuthModal = type => {
  return { type: constants.AUTH_OPEN_AUTHMODAL, payload: type }
}

export const closeAuthModal = type => {
  return { type: constants.AUTH_CLOSE_AUTHMODAL, payload: type }
}

export const getWindowWidth = () => {
  const body = document.getElementsByTagName('body')[0]
  return { type: constants.COMMON_GET_WINDOW_WIDTH, payload: body.clientWidth }
}

export const openDrawer = () => ({
  type: constants.COMMON_OPEN_DRAWER
})

export const closeDrawer = () => ({
  type: constants.COMMON_CLOSE_DRAWER
})

export const generateColorMap = commentList => ({
  type: constants.COMMON_COLOR_MAP,
  payload: commentList // 生成头像的颜色匹配
})
