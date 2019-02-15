import React, { Component } from 'react'
import PropTypes from 'prop-types'

import axios from '@/lib/axios'
import { getCommentsCount } from '@/lib'
import { connect } from 'react-redux'
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

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
)

@connect(state => state.user)
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

  setCommentList = commentList => {
    this.setState({ commentList })
  }

  render() {
    const { submitting, value, commentList } = this.state
    const { username, articleId } = this.props
    return (
      <div className="comment-wrapper">
        <div className="comment-header">
          <span className="count">{getCommentsCount(commentList)}</span> 条评论
          <span className="menu-wrap">
            <Dropdown overlay={menu}>
              <span className="ant-dropdown-link" href="#">
                {username ? username : '未登录用户'} <Icon type="down" />
              </span>
            </Dropdown>
          </span>
          <Divider className="hr" />
        </div>

        <Comment
          avatar={
            username ? (
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
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
