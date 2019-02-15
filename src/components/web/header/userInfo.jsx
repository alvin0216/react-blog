import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'
import { register, logout } from '@/redux/user/actions'
import { openAuthModal, closeAuthModal } from '@/redux/common/actions'

import { Button, Dropdown, Avatar, Menu } from 'antd'
import AuthModal from '../authModal'

const mapStateToProps = (state, ownProps) => ({
  username: state.user.username,
  avatarColor: state.user.avatarColor,
  loginModalVisible: state.common.loginModalVisible,
  registerModalVisible: state.common.registerModalVisible
})

@connect(
  mapStateToProps,
  { register, logout, openAuthModal, closeAuthModal }
)
class UserInfo extends Component {
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
    // const { loginModalVisible, registerModalVisible } = this.state
    const { username, avatarColor, loginModalVisible, registerModalVisible } = this.props
    return (
      <div id="header-userInfo">
        {username ? (
          <Dropdown
            placement="bottomCenter"
            overlay={this.renderAvatarDropdownMenu()}
            trigger={['click', 'hover']}>
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
              onClick={() => this.props.openAuthModal('login')}>
              登录
            </Button>
            <Button ghost type="danger" size="small" onClick={() => this.props.openAuthModal('register')}>
              注册
            </Button>
          </Fragment>
        )}

        {
          <AuthModal
            visible={loginModalVisible}
            type="login"
            handleClose={() => this.props.closeAuthModal('login')}
          />
        }
        {
          <AuthModal
            visible={registerModalVisible}
            type="register"
            handleClose={() => this.props.closeAuthModal('register')}
          />
        }
      </div>
    )
  }
}

export default UserInfo
