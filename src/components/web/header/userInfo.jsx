import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { loginout } from '@/redux/demo/actions'

import { Button, Dropdown, Avatar, Menu } from 'antd'
import AuthModal from '../authModal'

// use for Avatar
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

@connect(
  state => state.demo,
  { loginout }
)
class UserInfo extends Component {
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
      <div id="header-userInfo">
        {this.props.isLogin ? (
          <Dropdown placement="bottomCenter" overlay={this.renderAvatarDropdownMenu()}>
            <Avatar className="user-avatar" size="large" style={{ backgroundColor: this.state.avatarColor }}>
              guodada
            </Avatar>
          </Dropdown>
        ) : (
          <Fragment>
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
          </Fragment>
        )}

        {<AuthModal visible={loginModalVisible} type="login" handleClose={() => this.handleClose('login')} />}
        {
          <AuthModal
            visible={registerModalVisible}
            type="register"
            handleClose={() => this.handleClose('register')}
          />
        }
      </div>
    )
  }
}

export default UserInfo
