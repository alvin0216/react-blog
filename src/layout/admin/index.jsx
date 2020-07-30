import React, { useState, useEffect } from 'react'
import '@/styles/admin.less'

import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { Layout } from 'antd'
import AdminSideBar from './sidebar'
import AdminHeader from './header'
import Breadcrumb from '@/components/Breadcrumb'

const { Sider, Header, Content, Footer } = Layout

const AdminLayout = props => {
  const location = useLocation()

  return (
    <Layout className='admin-container'>

      <Header className='admin-header'>
        <AdminHeader />
      </Header>

      <Layout>
        <Sider width={200} className='admin-sider' >
          <AdminSideBar selectedKeys={[location.pathname]} />
        </Sider>
        <Layout className='admin-content-wrap'>
          <Breadcrumb />
          <Content className='admin-content'>
            {props.children}
          </Content>
        </Layout>

      </Layout>
    </Layout>
  )
}

export default AdminLayout
