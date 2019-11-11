import { GITHUB } from '@/config'
import Layout from '@/layout/web'
import Home from '@/views/web/home'
import Article from '@/views/web/article'
import Archives from '@/views/web/archives'
import Categories from '@/views/web/categories'
import List from '@/views/web/tag'
import About from '@/views/web/about'

import lazy from '@/components/Lazy'
const PageNotFound = lazy(() => import('@/components/404'))
const GithubLogining = lazy(() => import('@/components/GithubLogining'))

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home },
    { path: 'article/:id', component: Article },
    { path: 'archives', component: Archives },
    { path: 'categories', component: Categories },
    { path: 'categories/:name', component: List },
    { path: 'tags/:name', component: List },
    { path: '/github', component: GITHUB.enable && GithubLogining },
    { path: '/about', component: About },
    { path: '*', component: PageNotFound }
  ]
}
