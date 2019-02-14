import React, { Component } from 'react'
import PropTypes from 'prop-types'

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

  state = {
    comments: [],
    submitting: false,
    value: ''
  }
  handleSubmit = () => {
    if (!this.state.value) return

    this.setState({ submitting: true })

    console.log(111)
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    const { comments, submitting, value } = this.state
    const { username } = this.props
    return (
      <div className="comment-wrapper">
        <CommentList commentList={this.props.commentList}/>
        <Comment
          avatar={
            username ? (
              <Avatar
                className="user-avatar"
                size="large"
                style={{ backgroundColor: '#52c41a', margin: '5px 5px 0 0' }}>
                {username}
              </Avatar>
            ) : (
              <Icon type="github" theme="filled" style={{ fontSize: 40, margin: '5px 5px 0 0' }} />
            )
          }
          content={
            <Editor onChange={this.handleChange} onSubmit={this.handleSubmit} submitting={submitting} value={value} />
          }
        />
      </div>
    )
  }
}

export default ArticleComment
