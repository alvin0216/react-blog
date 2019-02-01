import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Menu, Icon } from 'antd'

import menus from './menus'

@withRouter
class Nav extends Component {
  render() {
    return (
      <div>
        <Menu mode="horizontal" defaultSelectedKeys={[this.props.location.pathname]} id="nav">
          {menus.map(nav => (
            <Menu.Item key={nav.link}>
              <Link to={nav.link}>
                {nav.icon && <Icon type={nav.icon} />}
                <span className="nav-text">{nav.title}</span>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    )
  }
}

export default Nav
