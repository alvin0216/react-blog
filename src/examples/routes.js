import { lazy } from 'react'

import Layout from '@/components/Layout'
import WelcomePage from './index'
import FormBuilder from './FormBuilder'
import CodeSplitting from './Code-Splitting'

const Demo = lazy(() => import('./Code-Splitting/demo'))
const AuthPage = lazy(() => import('./AuthPage'))

export default {
  path: 'examples',
  component: Layout,
  childRoutes: [
    { path: '', name: 'Welcome page', component: WelcomePage },
    { path: 'form/:formId', component: FormBuilder },
    { path: 'code-splitting', component: CodeSplitting },
    { path: 'demo', component: Demo },
    { path: 'auth', protected: true, component: AuthPage }
  ]
}
