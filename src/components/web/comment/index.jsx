import React, { Component, Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import axios from '@/lib/axios'

import { connect } from 'react-redux'
import AuthorAvatar from '@/components/web/AuthorAvatar'
import { getCommentsCount } from '@/lib'
import { openAuthModal } from '@/redux/common/actions'
import { logout } from '@/redux/user/actions'

import { Comment, Avatar, Form, Button, Divider, Input, Icon, Menu, Dropdown, message, Modal } from 'antd'
import CommentList from './list'

const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value, articleId }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} placeholder="说点什么..." onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <div className="controls">
        <i className="iconfont icon-tips" />
        <span className="support-tip">支持 Markdown 语法</span>
        <Button className="" htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          {articleId !== -1 ? '添加评论' : '留言'}
        </Button>
      </div>
    </Form.Item>
  </div>
)

function ArticleComment(props) {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!value) return
    if (!props.username) return message.warn('您未登陆，请登录后再试。')
    if (!props.email) {
      Modal.confirm({
        title: '温馨提示',
        content: `您未绑定邮箱，是否要绑定邮箱来获取回复的最新动态的通知？`,
        onOk: () => {
          props.openAuthModal('updateUser')
        }
      })
    }
    setSubmitting(true)

    axios
      .post('/user/comment', { articleId: props.articleId, content: value })
      .then(res => {
        setSubmitting(false)
        setValue('')
        props.setCommentList(res.rows)
      })
      .catch(err => setSubmitting(false))
  }

  const handleMenuClick = e => {
    switch (e.key) {
      case 'login':
        props.openAuthModal('login')
        break
      case 'register':
        props.openAuthModal('register')
        break
      case 'updateUser':
        props.openAuthModal('updateUser')
        break
      case 'logout':
        props.logout()
        break
      default:
        break
    }
  }

  const renderDropdownMenu = () => {
    const { username } = props
    return username ? (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="updateUser">修改账户信息</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="login">登录</Menu.Item>
        <Menu.Item key="register">注册</Menu.Item>
      </Menu>
    )
  }

  const { username, articleId, userId, commentList } = props

  return (
    <div className="comment-wrapper">
      <div className="comment-header">
        <span className="count">{getCommentsCount(commentList)}</span> {articleId !== -1 ? '条评论' : '条留言'}
        <span className="menu-wrap">
          <Dropdown overlay={renderDropdownMenu()} trigger={['click', 'hover']}>
            <span>
              {username ? username : '未登录用户'} <Icon type="down" />
            </span>
          </Dropdown>
        </span>
        <Divider className="hr" />
      </div>

      <Comment
        avatar={
          username ? (
            <Fragment>
              {userId !== 1 ? (
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              ) : (
                <AuthorAvatar />
              )}
            </Fragment>
          ) : (
            <Icon type="github" theme="filled" style={{ fontSize: 40, margin: '5px 5px 0 0' }} />
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
      <CommentList commentList={commentList} articleId={articleId} setCommentList={props.setCommentList} />
    </div>
  )
}

ArticleComment.propTypes = {
  articleId: PropTypes.number, // 文章 id，如果为 -1 则代表是自由评论区！
  commentList: PropTypes.array, // 评论列表
  setCommentList: PropTypes.func
}

export default connect(
  state => state.user,
  { openAuthModal, logout }
)(ArticleComment)