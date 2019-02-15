import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import axios from '@/lib/axios'
import { connect } from 'react-redux'

import AuthorAvatar from '@/components/web/AuthorAvatar'
import { getCommentsCount } from '@/lib'
import { openAuthModal } from '@/redux/common/actions'
import { logout } from '@/redux/user/actions'

import { Comment, Avatar, Form, Button, Divider, Input, Icon, Menu, Dropdown } from 'antd'
import CommentList from './commentList'

const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} placeholder="说点什么..." onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <div className="controls">
        <i className="iconfont icon-tips" />
        <span className="support-tip">支持 Markdown 语法</span>
        <Button className="" htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          添加评论
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
    articleId: PropTypes.number.isRequired,
    commentList: PropTypes.array,
    setCommentList: PropTypes.func
  }

  static defaultProps = {
    commentList: []
  }

  constructor(props) {
    super(props)
    this.state = {
      commentList: this.props.commentList,
      submitting: false,
      value: ''
    }
  }

  /**
   * 提交评论
   */
  handleSubmit = () => {
    if (!this.state.value) return
    this.setState({ submitting: true })
    axios
      .post('/user/comment', { articleId: this.props.articleId, content: this.state.value })
      .then(res => {
        this.setState({ submitting: false, commentList: res.rows, value: '' })
      })
      .catch(err => this.setState({ submitting: false }))
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
  }

  /**
   *  子组件 添加 reply 时需要重新设置 list
   */
  setCommentList = commentList => {
    this.setState({ commentList })
  }

  handleMenuClick = e => {
    switch (e.key) {
      case 'login':
        this.props.openAuthModal('login')
        break
      case 'register':
        this.props.openAuthModal('register')
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
    const { submitting, value, commentList } = this.state
    const { username, articleId, userId } = this.props

    return (
      <div className="comment-wrapper">
        <div className="comment-header">
          <span className="count">{getCommentsCount(commentList)}</span> 条评论
          <span className="menu-wrap">
            <Dropdown overlay={this.renderDropdownMenu()}>
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
            <Editor onChange={this.handleChange} onSubmit={this.handleSubmit} submitting={submitting} value={value} />
          }
        />
        <CommentList commentList={commentList} articleId={articleId} setCommentList={this.setCommentList} />
      </div>
    )
  }
}

export default ArticleComment
