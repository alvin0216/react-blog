import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '@/routes/config'
import { connect } from 'react-redux'
import { getTags, getCategories } from '@/redux/article/actions'

@connect(
  null,
  { getTags, getCategories }
)
class Root extends Component {
  static defaultProps = {
    isLogin: false
  }

  componentDidMount() {
    this.props.getTags()
    this.props.getCategories()
  }

  // 如果路由为 protected 且未登录时, 则定向到登录页
  // admin 且未登录时 定向到登录页
  authHandler = (item, routePath) => {
    if ((item.protected || routePath.includes('admin')) && !this.props.isLogin) {
      item = {
        ...item,
        component: () => <Redirect to="/login" />,
        children: []
      }
    }
  }

  /**
   * 根据路由表生成路由组件
   * @param {Array} routes - 路由配置表
   * @param {String} contextPath - 父级路径。比如后台 admin...
   */
  renderRoutes(routes, contextPath) {
    const children = []

    const renderRoute = (item, routeContextPath) => {
      let newContextPath = item.path ? `${routeContextPath}/${item.path}` : routeContextPath
      newContextPath = newContextPath.replace(/\/+/g, '/')

      // auth handler
      this.authHandler(item, newContextPath)

      if (item.component && item.childRoutes) {
        const childRoutes = this.renderRoutes(item.childRoutes, newContextPath)
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

  render() {
    const children = this.renderRoutes(routes, '/')
    return <BrowserRouter>{children}</BrowserRouter>
  }
}

export default Root

// 路由结构大致为
/*
const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/example"
        render={() => (
          <ExampleLayout>
            <Route path="" component={component} exact />
            <Route path="path" component={component} exact />
          </ExampleLayout>
        )}
      />
      <Route
        path="/admin"
        render={() => (
          <ExampleLayout>
            <Route path="path" component={component} exact />
          </ExampleLayout>
        )}
      />
      <Route
        path="/"
        render={() => (
          <ExampleLayout>
            <Route path="/" component={home} exact />
            <Route path="path" component={component} exact />
          </ExampleLayout>
        )}
      />
    </Switch>
  </BrowserRouter>
)
*/
