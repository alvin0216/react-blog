import React, { Component } from 'react'
import PropTypes from 'prop-types'

import axios from '@/lib/axios'
import { connect } from 'react-redux'
import { Comment, Avatar, Form, Button, List, Input, Icon } from 'antd'
import CommentList from './commentList'

const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
)

@connect(state => state.user)
class ArticleComment extends Component {
  static propTypes = {
    articleId: PropTypes.number.isRequired,
    commentList: PropTypes.array
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

  render() {
    const { submitting, value, commentList } = this.state
    const { username } = this.props
    return (
      <div className="comment-wrapper">
        <Comment
          avatar={
            username ? (
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
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
            />
          }
        />
        <CommentList commentList={commentList} />
      </div>
    )
  }
}

export default ArticleComment
