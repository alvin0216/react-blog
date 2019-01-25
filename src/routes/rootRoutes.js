import { lazy } from 'react'
const Login = lazy(() => import('@/views/admin/login'))

export default {
  path: '',
  childRoutes: [{ path: 'login', component: Login }]
}
