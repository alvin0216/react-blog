import React, { useState, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menu from './menu'
const SubMenu = Menu.SubMenu

function getMenuOpenKeys(menu) {
  const list = []
  menu.forEach(item => {
    if (item.children) {
      item.children.forEach(child => {
        list.push({
          pathname: child.path,
          openKey: item.path
        })
      })
    }
  })
  return list
}
const menuMenuOpenKeys = getMenuOpenKeys(menu)

function AdminSidebar(props) {
  // 菜单渲染
  function renderMenu(list) {
    const renderRoute = item => {
      if (item.hidden) return null
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

  const target = menuMenuOpenKeys.find(d => d.pathname === props.selectedKeys[0])
  const openKeys = target ? [target.openKey] : []
  return (
    <Menu
      defaultOpenKeys={openKeys}
      // defaultSelectedKeys={props.selectedKeys}
      selectedKeys={props.selectedKeys}
      mode='inline'
      style={{ height: '100%', borderRight: 0 }}>
      {renderMenu(menu)}
    </Menu>
  )
}

export default withRouter(AdminSidebar)
