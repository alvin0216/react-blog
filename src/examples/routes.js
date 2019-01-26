import { lazy } from 'react'

import Layout from '@/components/Layout'
import WelcomePage from './index'
import FormBuilder from './FormBuilder'
import CodeSplitting from './Code-Splitting'

const Demo = lazy(() => import('./Code-Splitting/demo'))
const AuthPage = lazy(() => import('./AuthPage'))
const Write = lazy(() => import('./markdown/write'))

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
      childRoutes: [{ path: 'write', component: Write }, { path: 'show', component: Write }]
    }
  ]
}
