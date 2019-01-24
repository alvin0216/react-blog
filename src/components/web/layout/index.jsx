import React, { Component } from 'react'
import './index.less'
import PropTypes from 'prop-types'

import Header from '../header'
import { Layout, Icon } from 'antd'

const { Content, Footer, Sider } = Layout

class WebLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <Layout>
        <div className="app-container">
          <Header />
          <Layout>
            <Content>{this.props.children}</Content>
            <Sider theme="light">Sider</Sider>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            © 2019 <Icon type="user" /> Guodada
          </Footer>
        </div>
      </Layout>
    )
  }
}

export default WebLayout
