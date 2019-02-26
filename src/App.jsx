import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import routes from '@/routes/config'
import { connect } from 'react-redux'
import { getTags, getCategories } from '@/redux/article/actions'
import { getWindowWidth } from '@/redux/common/actions'

@connect(
  state => state.user,
  { getTags, getCategories, getWindowWidth }
)
class Root extends Component {
  static defaultProps = {
    isLogin: false
  }

  componentDidMount() {
    this.props.getTags()
    this.props.getCategories()
    this.props.getWindowWidth()
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
      if ((item.protected || newContextPath.includes('admin')) && this.props.auth !== 1) {
        item = {
          ...item,
          component: () => <Redirect to="/login" />,
          children: []
        }
      }

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
