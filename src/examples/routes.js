import Layout from '@/components/Layout'
import WelcomePage from './index'
import FormBuilder from './FormBuilder'

export default {
  path: 'examples',
  component: Layout,
  childRoutes: [{ path: '', name: 'Welcome page', component: WelcomePage }, { path: 'form/:formId', component: FormBuilder }]
}
