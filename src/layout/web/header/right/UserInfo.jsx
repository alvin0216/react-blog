import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// methods
import { switchSignModal } from '@/redux/app/actions'
import { loginout } from '@/redux/user/actions'

// components
import { Button, Dropdown, Menu, Avatar } from 'antd'
import SignModal from '@/components/SignModal'
import AppAvatar from '@/components/Avatar'

function UserInfo(props) {
  const { username, github, role } = props.userInfo
  const MenuOverLay = (
    <Menu>
      {role === 1 && (
        <Menu.Item>
          <span onClick={e => props.history.push('/admin')}>后台管理</span>
        </Menu.Item>
      )}
      <Menu.Item>
        <span className='user-logout' onClick={props.loginout}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  )
  return (
    <div className='header-userInfo'>
      {username ? (
        <Dropdown placement='bottomCenter' overlay={MenuOverLay} trigger={['click', 'hover']}>
          <div style={{ height: 55 }}>
            <AppAvatar userInfo={props.userInfo} popoverVisible={false} />
          </div>
        </Dropdown>
      ) : (
        <>
          <Button
            ghost
            type='primary'
            size='small'
            style={{ marginRight: 20 }}
            onClick={e => props.switchSignModal('login', true)}>
            登录
          </Button>
          <Button ghost type='danger' size='small' onClick={e => props.switchSignModal('register', true)}>
            注册
          </Button>
        </>
      )}
      <SignModal />
    </div>
  )
}

export default connect(
  state => ({
    userInfo: state.user
  }),
  { switchSignModal, loginout }
)(withRouter(UserInfo))
