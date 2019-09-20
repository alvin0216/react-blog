import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { loginout } from '@/redux/user/actions'

import { Button, Icon, Dropdown, Menu } from 'antd'
import AppAvatar from '@/components/Avatar'

function AdminHeader(props) {
  const { collapsed, onToggle, userInfo } = props

  function backToHome() {
    props.history.push('/')
  }

  const menu = (
    <Menu className='menu'>
      <Menu.Item>
        <span onClick={backToHome}>返回主页</span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={e => {
            props.loginout()
            backToHome()
          }}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} className='trigger' onClick={onToggle} />
      <div className='header-right'>
        <Dropdown overlay={menu}>
          <span>
            <AppAvatar userInfo={props.userInfo} popoverVisible={false} />
          </span>
        </Dropdown>
      </div>
    </>
  )
}

AdminHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

export default connect(
  state => ({
    userInfo: state.user
  }),
  {
    loginout
  }
)(withRouter(AdminHeader))
