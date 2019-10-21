import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'

import routes from '@/routes'
import { getWindowWidth } from '@/redux/app/actions'
import { getTagList, getCategoryList } from '@/redux/article/actions'

const App = props => {
  const dispatch = useDispatch() // dispatch hooks
  const role = useSelector(state => state.user.role) // 相当于 connect(state => state.user.role)(App)

  // 初始化数据 类似 componentDidMount
  useEffect(() => {
    dispatch(getWindowWidth())
    dispatch(getTagList())
    dispatch(getCategoryList())
    // props.getWindowWidth()
    // props.getTagList()
    // props.getCategoryList()
    //
    console.log('app did mount')
    /*eslint react-hooks/exhaustive-deps: "off"*/
  }, [])

  // 解构 route
  function renderRoutes(routes, contextPath) {
    const children = []

    const renderRoute = (item, routeContextPath) => {
      let newContextPath = item.path ? `${routeContextPath}/${item.path}` : routeContextPath
      newContextPath = newContextPath.replace(/\/+/g, '/')
      if (newContextPath.includes('admin') && role !== 1) {
        item = {
          ...item,
          component: () => <Redirect to='/' />,
          children: []
        }
      }

      if (item.component) {
        if (item.childRoutes) {
          const childRoutes = renderRoutes(item.childRoutes, newContextPath)
          children.push(
            <Route
              key={newContextPath}
              render={props => <item.component {...props}>{childRoutes}</item.component>}
              path={newContextPath}
            />
          )
          item.childRoutes.forEach(r => renderRoute(r, newContextPath))
        } else {
          children.push(<Route key={newContextPath} component={item.component} path={newContextPath} exact />)
        }
      }
    }

    routes.forEach(item => renderRoute(item, contextPath))

    return <Switch>{children}</Switch>
  }

  const children = renderRoutes(routes, '/')
  return <BrowserRouter>{children}</BrowserRouter>
}

export default App

// export default connect(
//   state => ({
//     role: state.user.role
//   }),
//   { getWindowWidth, getTagList, getCategoryList }
// )(App)

// example test
// import WebLayout from '@/layout/web'
// import AdminLayout from '@/layout/admin'
// import Example from '@/views/examples'

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Switch>
//         <Route path='/test' component={Example} />
//         <Route
//           path='/admin'
//           render={props => (
//             <AdminLayout>
//               <Route path='/admin/e' component={Example} exact />
//             </AdminLayout>
//           )}
//         />
//         <Route
//           path='/'
//           render={props => (
//             <WebLayout>
//               <Route path='/e' component={Example} />
//             </WebLayout>
//           )}
//         />
//       </Switch>
//     </BrowserRouter>
//   )
// }
