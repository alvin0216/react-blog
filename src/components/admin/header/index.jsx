import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import avatar from '@/assets/admin_avatar.png'
import { Button, Icon, Dropdown, Menu } from 'antd'

const DropdownMenu = () => (
  <Menu className="menu">
    <Menu.ItemGroup title="用户中心" className="menu-group">
      <Menu.Item>你好</Menu.Item>
      <Menu.Item>个人信息</Menu.Item>
      <Menu.Item>
        <span>退出登录</span>
      </Menu.Item>
    </Menu.ItemGroup>
    <Menu.ItemGroup title="设置中心" className="menu-group">
      <Menu.Item>个人设置</Menu.Item>
      <Menu.Item>系统设置</Menu.Item>
    </Menu.ItemGroup>
  </Menu>
)

class AdminHeader extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    onToggle: PropTypes.func
  }

  render() {
    const { collapsed } = this.props
    return (
      <div className="admin-header-container">
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} className="trigger" onClick={this.props.onToggle} />
        <div className="header-right">
          <ul className="header-right-ul">
            <li>
              <Dropdown overlay={DropdownMenu}>
                <img src={avatar} alt="" />
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default AdminHeader
