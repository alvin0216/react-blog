import Home from './home'
import Demo from './demo'

export default {
  path: '/',
  childRoutes: [
    { path: '', component: Home }, 
    { path: '/demo', component: Demo }
  ]
}
