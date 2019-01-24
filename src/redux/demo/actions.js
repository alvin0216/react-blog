import * as constants from '@/redux/constants'

// actions
export const addCount = () => {
  return { type: constants.DEMO_ADD_COUNT }
}

export const login = () => ({ 
  type: constants.DEMO_LOGIN
})

export const loginout = () => ({ 
  type: constants.DEMO_LOGINOUT
})