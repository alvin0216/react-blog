import React, { useState, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menu from './menu'

const SubMenu = Menu.SubMenu

function AdminSidebar(props) {
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])

  useEffect(() => {
    // component did mount
    console.log(props.location.pathname)
  }, [])

  // 菜单渲染
  function renderMenu(list) {
    const renderRoute = item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </span>
            }>
            {item.children.map(r => renderRoute(r))}
          </SubMenu>
        )
      } else {
        return (
          item.name && (
            <Menu.Item key={item.path}>
              <NavLink to={item.path}>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </NavLink>
            </Menu.Item>
          )
        )
      }
    }
    return list.map(l => renderRoute(l))
  }

  return (
    <div className='sibar-container'>
      <Menu
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={openKeys => setOpenKeys(openKeys)}
        onClick={({ key }) => setSelectedKeys([key])}
        theme='dark'
        mode='inline'>
        {renderMenu(menu)}
      </Menu>
    </div>
  )
}

export default withRouter(AdminSidebar)
