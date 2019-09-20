import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import AdminSideBar from './sidebar'
import AdminHeader from './header'

const { Sider, Header, Content, Footer } = Layout

const AdminLayout = props => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className='admin-container'>
      <Sider collapsible trigger={null} collapsed={collapsed}>
        <AdminSideBar />
      </Sider>
      <Layout>
        <Header className='admin-header'>
          <AdminHeader collapsed={collapsed} onToggle={e => setCollapsed(!collapsed)} />
        </Header>
        <Content className='admin-main'>{props.children}</Content>
        {/* <Footer style={{ textAlign: 'center' }}>React-Admin ©2019 Created by gershonv@163.com </Footer> */}
      </Layout>
    </Layout>
  )
}

export default AdminLayout
