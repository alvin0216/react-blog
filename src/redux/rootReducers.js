import { combineReducers } from 'redux'

import app from './app/reducer'
import article from './modal/article'
import user from './user/reducer'

export default combineReducers({
  app,
  article,
  user
})
