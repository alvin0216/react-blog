import * as constants from '@/redux/constants'
import axios from '@/lib/axios'

export const getTags = () => {
  return dispatch =>
    axios.get('/tags/getList').then(res => {
      dispatch({ type: constants.TAG_GETLIST, payload: res.data })
    })
}

export const getCategories = () => {
  return dispatch =>
    axios.get('/categories/getList').then(res => {
      dispatch({ type: constants.CATEGORY_GETLIST, payload: res.data })
    })
}

