// import PageNotFound from '@/components/NotFound'
import homeRoutes from '@/views/web/routes'
import examplesRoute from '@/examples/routes'
import adminRoutes from '@/views/admin/routes'

const childRoutes = [
  examplesRoute,
  adminRoutes,
  homeRoutes
  //...
]

// generator all the routes
const routes = [
  ...childRoutes.filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0))
  // {
  //   path: '*',
  //   name: 'Page not found',
  //   component: PageNotFound
  // }
]

/**
 * 过滤路由信息，路由信息中含有 isIndex 的在渲染
 *
 * @param {Object} route - 路由对象信息
 */
function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) return
  const indexRoute = route.childRoutes.find(child => child.isIndex)
  if (indexRoute) {
    const first = { ...indexRoute }
    first.path = ''
    first.exact = true
    first.autoIndexRoute = true // mark it so that the simple nav won't show it.
    route.childRoutes.unshift(first)
  }
  route.childRoutes.forEach(handleIndexRoute)
}

routes.forEach(handleIndexRoute)
export default routes
