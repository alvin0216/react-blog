import webRoutes from './web'
import adminRoutes from './admin'
import Example from '@/views/examples'

const routes = [
  { path: '/e', component: Example },
  adminRoutes,
  webRoutes

  // ..
]

export default routes
