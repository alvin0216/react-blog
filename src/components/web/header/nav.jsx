import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

@withRouter
class Nav extends Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    mode: PropTypes.string
  }

  static defaultProps = {
    mode: 'horizontal'
  }

  render() {
    const { navList, mode } = this.props
    return (
      <Menu mode={mode} defaultSelectedKeys={[this.props.location.pathname]} className="header-nav">
        {navList.map(nav => (
          <Menu.Item key={nav.link}>
            <Link to={nav.link}>
              {nav.icon && <Icon type={nav.icon} />}
              <span className="nav-text">{nav.title}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    )
  }
}

export default Nav
