import Layout from '@/components/Layout'
import WelcomePage from './index'

export default {
  path: 'examples',
  component: Layout,
  childRoutes: [{ path: '', name: 'Welcome page', component: WelcomePage }]
}
