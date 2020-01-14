import * as TYPES from '@/redux/types'
import { genertorColor } from '@/utils'

/**
 * state
 */
const defaultState = {
  categoryList: [],
  tagList: []
}

/**
 * article Reducer
 */
export default function articleReducer(state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case TYPES.ARTICLE_GET_TAG_LIST:
      const tagList = genertorColor(payload)
      return { ...state, tagList }

    case TYPES.ARTICLE_GET_CATEGORY_LIST:
      const categoryList = genertorColor(payload)
      return { ...state, categoryList }

    default:
      return state
  }
}
