import React, { Component } from 'react'
import './index.less'
import PropTypes from 'prop-types'

import { Layout, Icon, Row, Col, BackTop } from 'antd'
import Header from '../header'
import BolgSider from '../sider'


const { Content, Footer, Sider } = Layout

class WebLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    // const responsiveLeft = { xxl: 4, xl: 5, lg: 5, sm: 4, xs: 24 }
    // const responsiveRight = { xxl: 20, xl: 19, lg: 19, sm: 20, xs: 0 }
    const siderLayout = { xxl: 4, xl: 5, lg: 5, sm: 0, xs: 0 }
    const contentLayout = { xxl: 20, xl: 19, lg: 19, sm: 24, xs: 24 }

    return (
      <Layout className="app-container">
        <Header />
        <Row className="main-wrapper">
          <Col {...siderLayout}>
            <BolgSider />
          </Col>
          <Col {...contentLayout}>
            <div className="content-wrapper">
              {/* <div className="content-inner-wrapper">{this.props.children}</div> */}
              {this.props.children}
              {/* <Footer className="footer">
                © 2019 <Icon type="user" /> Guodada
              </Footer> */}
            </div>
          </Col>
        </Row>
        <BackTop target={() => document.querySelector('.content-wrapper')} />
      </Layout>
    )
  }
}

export default WebLayout
