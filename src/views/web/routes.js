import Layout from '@/components/web/layout'
import PageNotFound from '@/components/notFound'
import Home from './home'
import Article from './article'

export default {
  path: '/',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: Home }, 
    { path: 'article', component: Article }, 
    { path: '*', component: PageNotFound },
  ]
}
