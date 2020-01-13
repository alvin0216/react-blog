import * as TYPES from '@/redux/types'
import axios from '@/utils/axios'
import { genertorColor } from '@/utils'

export const getTagList = () => dispatch =>
  axios.get('/tag/list').then(list => {
    dispatch({
      type: TYPES.ARTICLE_GET_TAG_LIST,
      payload: list
    })
  })

export const getCategoryList = () => dispatch =>
  axios.get('/category/list').then(list => {
    dispatch({
      type: TYPES.ARTICLE_GET_CATEGORY_LIST,
      payload: list
    })
  })

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
