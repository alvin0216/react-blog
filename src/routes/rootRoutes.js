import lazy from '@/components/helper/lazy'
const Login = lazy(() => import('@/views/admin/login'))

export default {
  path: '',
  childRoutes: [{ path: 'login', component: Login }]
}
