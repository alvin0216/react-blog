import Layout from '@/components/web/layout'
import PageNotFound from '@/components/404'
import Home from './home'
import Article from './article'
import Archives from './archives'
import Categories from './categories'
import List from './list'

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home },
    { path: 'archives', component: Archives },
    { path: 'article/:id', component: Article },
    { path: 'categories', component: Categories },
    { path: 'categories/:name', component: List },
    { path: 'tags/:name', component: List },
    { path: '*', component: PageNotFound }
  ]
}
