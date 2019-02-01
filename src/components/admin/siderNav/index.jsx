import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import routes from '@/views/admin/routes'

const SubMenu = Menu.SubMenu

@withRouter
class SiderNav extends Component {
  state = {
    openKeys: [],
    selectedKeys: []
  }

  componentDidMount() {
    const pathname = this.props.location.pathname
    let index = pathname.lastIndexOf('/')
    const openKeys = [pathname.slice(0, index)]
    this.setState({ selectedKeys: [pathname], openKeys })
  }

  // 菜单渲染
  renderMenu = data => {
    const renderRoute = (item, routeContextPath) => {
      let newContextPath = item.path ? `${routeContextPath}/${item.path}` : routeContextPath
      if (item.childRoutes) {
        return (
          <SubMenu
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                {item.name}
              </span>
            }
            key={newContextPath}>
            {item.childRoutes.map(r => renderRoute(r, newContextPath))}
          </SubMenu>
        )
      } else {
        return (
          item.name && (
            <Menu.Item key={newContextPath}>
              <NavLink to={newContextPath}>
                {item.icon && <Icon type={item.icon} />}
                {item.name}
              </NavLink>
            </Menu.Item>
          )
        )
      }
    }
    return data.childRoutes.map(d => renderRoute(d, '/admin'))
  }

  // SubMenu 展开/关闭的回调
  onOpenChange = openKeys => {
    this.setState({ openKeys })
  }

  render() {
    const { openKeys, selectedKeys } = this.state
    return (
      <div className="sibar-container" style={{ height: '100vh' }}>
        <Menu
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={this.onOpenChange}
          onClick={({ key }) => {
            console.log(key)
            this.setState({ selectedKeys: [key] })
          }}
          theme="dark"
          mode="inline">
          {this.renderMenu(routes)}
        </Menu>
      </div>
    )
  }
}

export default SiderNav
