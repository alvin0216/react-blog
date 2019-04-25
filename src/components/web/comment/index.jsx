import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import './index.less'

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
@connect(
  state => state.user,
  { openAuthModal, logout }
)
class ArticleComment extends Component {
  static propTypes = {
    articleId: PropTypes.number, // 文章 id，如果为 -1 则代表是自由评论区！
    commentList: PropTypes.array, // 评论列表
    setCommentList: PropTypes.func
  }

  static defaultProps = {
    commentList: []
  }

  state = {
    submitting: false,
    value: ''
  }

  /**
   * 提交评论
   */
  handleSubmit = () => {
    if (!this.state.value) return
    if (!this.props.username) return message.warn('您未登陆，请登录后再试。')
    if (!this.props.email) {
      Modal.confirm({
        title: '温馨提示',
        content: `您未绑定邮箱，是否要绑定邮箱来获取回复的最新动态的通知？`,
        onOk: () => {
          this.props.openAuthModal('updateUser')
        }
      })
    }
    this.setState({ submitting: true })
    
    this.axios
      .post('/user/comment', { articleId: this.props.articleId, content: this.state.value })
      .then(res => {
        this.setState({ submitting: false, value: '' }, () => this.props.setCommentList(res.rows))
      })
      .catch(err => this.setState({ submitting: false }))
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
  }

  handleMenuClick = e => {
    switch (e.key) {
      case 'login':
        this.props.openAuthModal('login')
        break
      case 'register':
        this.props.openAuthModal('register')
        break
      case 'updateUser':
        this.props.openAuthModal('updateUser')
        break
      case 'logout':
        this.props.logout()
        break
      default:
        break
    }
  }

  renderDropdownMenu = () => {
    const { username } = this.props
    return username ? (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="updateUser">修改账户信息</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="login">登录</Menu.Item>
        <Menu.Item key="register">注册</Menu.Item>
      </Menu>
    )
  }

  render() {
    const { submitting, value } = this.state
    const { username, articleId, userId, commentList } = this.props

    return (
      <div className="comment-wrapper">
        <div className="comment-header">
          <span className="count">{getCommentsCount(commentList)}</span> {articleId !== -1 ? '条评论' : '条留言'}
          <span className="menu-wrap">
            <Dropdown overlay={this.renderDropdownMenu()} trigger={['click', 'hover']}>
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
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
              articleId={articleId}
            />
          }
        />
        <CommentList commentList={commentList} articleId={articleId} setCommentList={this.props.setCommentList} />
      </div>
    )
  }
}

export default ArticleComment
