import * as constants from '@/redux/constants'
import axios from '@/lib/axios'

// actions
export const addCount = () => {
  return { type: constants.DEMO_ADD_COUNT }
}

export const login = ({ username, password }) => {
  return dispatch =>
    axios.post('/examples/login', { username, password }).then(res => {
      localStorage.setItem('token', res.token)
      dispatch({
        type: constants.DEMO_LOGIN
      })
    })
}

export const register = ({ username, password }) => {
  return dispatch =>
    axios.post('/examples/register', { username, password }).then(res => {
      dispatch({
        type: constants.DEMO_REGISTER
      })
    })
}

export const loginout = () => ({
  type: constants.DEMO_LOGINOUT
})
