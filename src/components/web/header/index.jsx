import React, { Component } from 'react'
import './index.less'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { loginout } from '@/redux/demo/actions'

import { Layout, Menu, Icon, Row, Col, Button, Dropdown, Avatar } from 'antd'
import menus from './menus'
import AuthModal from '../authModal'

const Header = Layout.Header

const NavBar = ({ menus }) => (
  <Menu mode="horizontal" defaultSelectedKeys={[menus[0]['link']]}>
    {menus.map(nav => (
      <Menu.Item key={nav.link}>
        <Link to={nav.link}>
          {nav.icon && <Icon type={nav.icon} />}
          <span className="nav-text">{nav.title}</span>
        </Link>
      </Menu.Item>
    ))}
  </Menu>
)

// use for Avatar
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

@connect(
  state => state.demo,
  { loginout }
)
class BlogHeader extends Component {
  state = {
    loginModalVisible: false,
    registerModalVisible: false,
    avatarColor: colorList[Math.floor(Math.random() * 4)]
  }

  handleClose = type => {
    const visible = `${type}ModalVisible`
    this.setState({ [visible]: false })
  }

  renderAvatarDropdownMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <span className="user-logout" onClick={this.props.loginout}>
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const { loginModalVisible, registerModalVisible } = this.state
    return (
      <Header className="header-contaienr">
        <Row>
          <Col lg={{ span: 4 }} md={{ span: 4 }} xs={{ span: 0 }} />
          <Col lg={{ span: 14 }} md={{ span: 14 }} xs={{ span: 0 }}>
            <NavBar menus={menus} />
          </Col>
          <Col lg={{ span: 0 }} md={{ span: 0 }} xs={{ span: 10 }} />
          <Col lg={{ span: 6 }} md={{ span: 6 }} xs={{ span: 14 }}>
            {!this.props.isLogin ? (
              <div className="nav-auth">
                <Button
                  ghost
                  type="primary"
                  size="small"
                  style={{ marginRight: 20 }}
                  onClick={() => this.setState({ loginModalVisible: true })}>
                  登录
                </Button>
                <Button
                  ghost
                  type="danger"
                  size="small"
                  onClick={() => this.setState({ registerModalVisible: true })}>
                  注册
                </Button>
              </div>
            ) : (
              <Dropdown placement="bottomCenter" overlay={this.renderAvatarDropdownMenu()}>
                <Avatar
                  className="user-avatar"
                  size="large"
                  style={{ backgroundColor: this.state.avatarColor }}>
                  guodada
                </Avatar>
              </Dropdown>
            )}
          </Col>
        </Row>

        {<AuthModal visible={loginModalVisible} type="login" handleClose={() => this.handleClose('login')} />}
        {
          <AuthModal
            visible={registerModalVisible}
            type="register"
            handleClose={() => this.handleClose('register')}
          />
        }
      </Header>
    )
  }
}

export default BlogHeader
