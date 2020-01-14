import { combineReducers } from 'redux'

import article from './article/reducer'
import user from './user/reducer'

export default combineReducers({
  user,
  article
})
