import Layout from '@/components/web/layout'
import PageNotFound from '@/components/404'
import Home from './home'
import Article from './article'
import Archives from './archives'
import Categories from './categories'

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home },
    { path: 'archives', component: Archives },
    { path: 'article/:id', component: Article },
    { path: 'categories', component: Categories },
    { path: '*', component: PageNotFound }
  ]
}
