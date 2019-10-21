import React, { Component } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

// methods
import { switchSignModal, switchUploadModal } from '@/redux/app/actions'
import { loginout } from '@/redux/user/actions'

// components
import { Button, Dropdown, Menu, Avatar } from 'antd'
import SignModal from '@/components/SignModal'
import UploadModal from '@/components/UploadModal'
import ResultModal from '@/components/UploadModal/result'
import AppAvatar from '@/components/Avatar'

function UserInfo(props) {
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user)
  const { username, github, role } = userInfo

  const MenuOverLay = (
    <Menu>
      {role === 1 && (
        <Menu.Item>
          <span onClick={e => dispatch(switchUploadModal(true))}>导入文章</span>
        </Menu.Item>
      )}
      {role === 1 && (
        <Menu.Item>
          <span onClick={e => props.history.push('/admin')}>后台管理</span>
        </Menu.Item>
      )}
      <Menu.Item>
        <span className='user-logout' onClick={e => dispatch(loginout())}>
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
            <AppAvatar userInfo={userInfo} popoverVisible={false} />
          </div>
        </Dropdown>
      ) : (
        <>
          <Button
            ghost
            type='primary'
            size='small'
            style={{ marginRight: 20 }}
            onClick={e => dispatch(switchSignModal('login', true))}>
            登录
          </Button>
          <Button ghost type='danger' size='small' onClick={e => dispatch(switchSignModal('register', true))}>
            注册
          </Button>
        </>
      )}
      <SignModal />
      <UploadModal />
      <ResultModal />
    </div>
  )
}

export default withRouter(UserInfo)
