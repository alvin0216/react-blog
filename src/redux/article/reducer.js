import * as TYPES from '@/redux/types'
import { COLOR_LIST } from '@/utils/config'
import { randomIndex } from '@/utils'

// 生成 color
function genertorColor(list = [], colorList = []) {
  const _list = [...list].sort((x, y) => y.count - x.count)
  _list.forEach((l, i) => {
    l.color = colorList[i] || colorList[randomIndex(colorList)]
  })
  return _list
}

// state
const defaultState = {
  categoryList: [],
  tagList: []
}

// reducer
export const articleReducer = (state = defaultState, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.ARTICLE_GET_TAG_LIST:
      const tagList = genertorColor(payload, COLOR_LIST)
      return { ...state, tagList }

    case TYPES.ARTICLE_GET_CATEGORY_LIST:
      const categoryList = genertorColor(payload, COLOR_LIST)
      return { ...state, categoryList }

    default:
      return state
  }
}

export default articleReducer
