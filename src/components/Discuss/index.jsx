import React, { Component, Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { connect } from 'react-redux'
import { DISCUSS_AVATAR } from '@/config'

// methods
import axios from '@/utils/axios'
import { calcCommentsCount } from '@/utils'
import { login, register, loginout } from '@/redux/user/actions'
import { switchSignModal } from '@/redux/app/actions'

// components
import SvgIcon from '@/components/SvgIcon'
import { Comment, Avatar, Form, Button, Divider, Input, Icon, Menu, Dropdown, message, Modal } from 'antd'
import List from './list' // 评论列表
import AppAvatar from '@/components/Avatar'

const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value, articleId }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} placeholder='说点什么...' onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <div className='controls'>
        <Icon type='info-circle' className='controls-tip-icon' />
        <span className='controls-tip'>支持 Markdown 语法</span>
        <Button className='' htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
          {articleId !== -1 ? '添加评论' : '留言'}
        </Button>
      </div>
    </Form.Item>
  </div>
)

function discuss(props) {
  const { commentList, articleId, userInfo } = props
  const { username, role } = userInfo

  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const renderDropdownMenu = () => {
    return username ? (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='loginout'>注销</Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='login'>登录</Menu.Item>
        <Menu.Item key='register'>注册</Menu.Item>
      </Menu>
    )
  }

  function handleMenuClick(e) {
    switch (e.key) {
      case 'login':
        props.switchSignModal('login', true)
        break

      case 'register':
        props.switchSignModal('register', true)
        break

      case 'loginout':
        props.loginout()
        break

      default:
        break
    }
  }

  function handleSubmit() {
    if (!value) return
    if (!userInfo.username) return message.warn('您未登陆，请登录后再试。')

    setSubmitting(true)

    axios
      .post('/discuss', { articleId: props.articleId, content: value, userId: userInfo.userId })
      .then(res => {
        setSubmitting(false)
        setValue('')
        props.setCommentList(res.rows)
      })
      .catch(e => setSubmitting(false))
  }

  return (
    <div id='discuss'>
      <div className='discuss-header'>
        <span className='discuss-count'>{calcCommentsCount(commentList)}</span>
        {articleId !== -1 ? '条评论' : '条留言'}
        <span className='discuss-user'>
          <Dropdown overlay={renderDropdownMenu()} trigger={['click', 'hover']}>
            <span>
              {username || '未登录用户'} <Icon type='down' />
            </span>
          </Dropdown>
        </span>
        <Divider className='hr' />
      </div>

      <Comment
        avatar={
          username ? (
            <AppAvatar userInfo={userInfo} />
          ) : (
            <Icon type='github' theme='filled' style={{ fontSize: 40, margin: '5px 5px 0 0' }} />
          )
        }
        content={
          <Editor
            onChange={e => setValue(e.target.value)}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
            articleId={articleId}
          />
        }
      />

      <List commentList={commentList} articleId={articleId} setCommentList={props.setCommentList} />
    </div>
  )
}

discuss.propTypes = {
  commentList: PropTypes.array.isRequired
}

export default connect(
  state => ({
    userInfo: state.user
  }),
  {
    switchSignModal,
    loginout
  }
)(discuss)
