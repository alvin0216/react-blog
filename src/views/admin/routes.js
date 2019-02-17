import lazy from '@/components/helper/lazy'
import Layout from '@/components/admin/layout'
import PageNotFound from '@/components/404'

import Home from './home'
const Edit = lazy(() => import('./article/edit'))
const Login = lazy(() => import('./login'))
const ArticleManage = lazy(() => import('./manage'))
const UserManage = lazy(() => import('./user'))

export default {
  path: 'admin',
  component: Layout,
  childRoutes: [
    {
      path: '',
      icon: 'home',
      name: '首页',
      component: Home
    },
    {
      path: 'articles',
      icon: 'edit',
      name: '文章管理',
      childRoutes: [
        { path: 'edit', icon: 'edit', name: '新增文章', component: Edit },
        { path: 'manage', icon: 'folder', name: '管理文章', component: ArticleManage }
      ]
    },
    { path: 'usermanage', name: '用户管理', icon: 'user', component: UserManage },
    { path: 'login', component: Login },
    { path: '*', component: PageNotFound }
  ]
}
