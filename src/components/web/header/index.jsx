import React, { Component } from 'react'
import './index.less'

import { Layout, Row, Col } from 'antd'
import Search from './search'
import Nav from './nav'
import UserInfo from './userInfo'

const Header = Layout.Header

const BlogHeader = () => {
  const responsiveLeft = { xxl: 4, xl: 5, lg: 5, sm: 24, xs: 24 }
  let responsiveRight = {}
  Object.keys(responsiveLeft).forEach(key => {
    responsiveRight[key] = 24 - responsiveLeft[key]
  })

  return (
    <Header className="header-contaienr">
      <Row>
        <Col {...responsiveLeft} />
        <Col {...responsiveRight}>
          <Search />
          <UserInfo />
          <Nav />
        </Col>
      </Row>
    </Header>
  )
}

export default BlogHeader
