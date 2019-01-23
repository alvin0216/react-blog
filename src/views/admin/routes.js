import Layout from '@/components/Layout/admin'
import PageNotFound from '@/components/NotFound'

import Home from './home'

export default {
  path: 'admin',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home },
    { path: '*', component: PageNotFound }
  ]
}
