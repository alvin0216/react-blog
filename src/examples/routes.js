import lazy from '@/components/helper/lazy'

import Layout from '@/components/examples/layout'
import WelcomePage from './index'
import FormBuilder from './FormBuilder'
import CodeSplitting from './Code-Splitting'

const Demo = lazy(() => import('./Code-Splitting/demo'))
const AuthPage = lazy(() => import('./AuthPage'))
const Write = lazy(() => import('./markdown/write'))
const Show = lazy(() => import('./markdown/show'))
const Hooks = lazy(() => import('./hooks'))
const Test = lazy(() => import('./test'))

export default {
  path: 'examples',
  component: Layout,
  childRoutes: [
    { path: '', name: 'Welcome page', component: WelcomePage },
    { path: 'form/:formId', component: FormBuilder },
    { path: 'code-splitting', component: CodeSplitting },
    { path: 'demo', component: Demo },
    { path: 'auth', protected: true, component: AuthPage },
    {
      path: 'markdown',
      childRoutes: [{ path: 'write', component: Write }, { path: 'show', component: Show }]
    },
    { path: 'hooks', component: Hooks },
    { path: 'test', component: Test }
  ]
}
