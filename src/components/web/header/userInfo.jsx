import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { register, logout } from '@/redux/user/actions'

import { Button, Dropdown, Avatar, Menu } from 'antd'
import AuthModal from '../authModal'
import { DEFAULT_AVATAR_COLOR } from '@/redux/constants'

@connect(
  state => state.user,
  { register, logout }
)
class UserInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginModalVisible: false,
      registerModalVisible: false
    }
  }

  handleClose = type => {
    const visible = `${type}ModalVisible`
    this.setState({ [visible]: false })
  }

  renderAvatarDropdownMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <span className="user-logout" onClick={this.props.logout}>
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const { loginModalVisible, registerModalVisible } = this.state
    const { username, avatarColor } = this.props
    return (
      <div id="header-userInfo">
        {username ? (
          <Dropdown placement="bottomCenter" overlay={this.renderAvatarDropdownMenu()}>
            <Avatar className="user-avatar" size="large" style={{ backgroundColor: avatarColor }}>
              {username}
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
            <Button ghost type="danger" size="small" onClick={() => this.setState({ registerModalVisible: true })}>
              注册
            </Button>
          </Fragment>
        )}

        {<AuthModal visible={loginModalVisible} type="login" handleClose={() => this.handleClose('login')} />}
        {<AuthModal visible={registerModalVisible} type="register" handleClose={() => this.handleClose('register')} />}
      </div>
    )
  }
}

export default UserInfo
