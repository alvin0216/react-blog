import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import routes from '@/routes/config'

function renderRoutes(routes, contextPath) {
  const children = []

  const renderRoute = (item, routeContextPath) => {
    let newContextPath
    if (/^\//.test(item.path)) {
      newContextPath = item.path
    } else {
      newContextPath = `${routeContextPath}/${item.path}`
    }
    newContextPath = newContextPath.replace(/\/+/g, '/')
    console.log(routes, newContextPath)
    if (item.component && item.childRoutes) {
      const childRoutes = renderRoutes(item.childRoutes, newContextPath)
      children.push(
        <Route
          key={newContextPath}
          render={props => <item.component {...props}>{childRoutes}</item.component>}
          path={newContextPath}
        />
      )
    } else if (item.component) {
      children.push(<Route key={newContextPath} component={item.component} path={newContextPath} exact />)
    } else if (item.childRoutes) {
      item.childRoutes.forEach(r => renderRoute(r, newContextPath))
    }
  }

  routes.forEach(item => renderRoute(item, contextPath))

  return <Switch>{children}</Switch>
}

class Root extends Component {
  render() {
    const children = renderRoutes(routes, '/')
    return <BrowserRouter>{children}</BrowserRouter>
  }
}

export default Root
