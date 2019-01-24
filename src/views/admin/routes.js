import { lazy } from 'react'
import Layout from '@/components/Layout/admin'
import PageNotFound from '@/components/NotFound'

import Home from './home'

const Login = lazy(() => import('./login'))

export default {
  path: 'admin',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: '*', component: PageNotFound }
  ]
}
