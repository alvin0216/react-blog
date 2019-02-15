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