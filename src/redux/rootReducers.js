import { combineReducers } from 'redux'

import demo from './demo/reducer'
import article from './article/reducer'

export default combineReducers({
  demo,
  article
})
