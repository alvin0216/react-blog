import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

// config
import routes from '@/routes'

// components
import PublicComponent from '@/components/Public'

const App = props => {
  const role = useSelector(state => state.user.role) // 相当于 connect(state => state.user.role)(App)

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
      if (!item.component) return

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

    routes.forEach(item => renderRoute(item, contextPath))

    return <Switch>{children}</Switch>
  }

  const children = renderRoutes(routes, '/')
  return (
    <BrowserRouter>
      {children}
      <PublicComponent />
    </BrowserRouter>)
}

export default App
