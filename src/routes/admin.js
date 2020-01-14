import Layout from '@/layout/admin'
import lazy from '@/components/Lazy'

export default {
  path: '/admin',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: lazy(() => import('@/views/admin/home')) },
    { path: 'article/edit/:id', component: lazy(() => import('@/views/admin/article/edit')) },
    { path: 'article/add', component: lazy(() => import('@/views/admin/article/edit')) },
    { path: 'article/manager', component: lazy(() => import('@/views/admin/article/manager')) },
    { path: 'user', component: lazy(() => import('@/views/admin/user')) }
  ]
}
