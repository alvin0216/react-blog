import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import blogAuthor from '@/assets/sider_avatar.png'

import axios from '@/lib/axios'
import { random, groupBy, translateMarkdown } from '@/lib'
import { Comment, Avatar, Form, Button, List, Input, Icon } from 'antd'

const { TextArea } = Input

@connect(state => ({
  userId: state.user.userId,
  colorList: state.article.colorList
}))
class CommentList extends Component {
  static propTypes = {
    commentList: PropTypes.array,
    articleId: PropTypes.number
  }

  state = {
    commentList: [],
    colorMap: {},
    commentId: 0,
    value: ''
  }

  componentDidMount() {
    const { commentList, colorList } = this.props
    const list = groupBy(commentList, item => item.userId)
    let colorMap = {}
    list.forEach(item => {
      colorMap[item[0].userId] = colorList[random(colorList)]
      item[0]['replies'].forEach(d => {
        if (!colorMap[d.userId]) colorMap[d.userId] = colorList[random(colorList)]
      })
    })
    this.setState({ colorMap })
  }

  renderAvatar = item => {
    const { userId } = this.props
    const { colorMap } = this.state
    if (item.userId === 1) return <Avatar src={blogAuthor} /> // userId = 1 博主~~~
    if (item.userId === userId) {
      return <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    } else {
      return (
        <Avatar
          className="user-avatar"
          size="default"
          style={{ backgroundColor: colorMap[item.userId] || '#ccc' }}>
          {item.user.username}
        </Avatar>
      )
    }
  }

  openReply = commentId => {
    this.setState({ commentId })
  }

  handleChange = e => {
    // console.log(e)
    this.setState({ value: e.target.value })
  }

  handleKeyUp = e => {
    if (e.ctrlKey && e.keyCode === 13) {
      this.onSubmit()
    }
  }

  onSubmit = () => {
    const content = this.state.value.trim()
    const { articleId } = this.props
    axios
      .post('/user/reply', {
        content,
        articleId,
        commentId: this.state.commentId
      })
      .then(res => {
        this.props.setCommentList(res.rows)
        this.setState({ commentId: 0, value: '' })
      })
  }

  render() {
    const { commentList } = this.props
    const { commentId, value } = this.state
    return (
      <div className="">
        {commentList.map(comment => (
          <Comment
            key={comment.id}
            actions={[<span onClick={() => this.openReply(comment.id)}>Reply to</span>]}
            author={<span>{comment.user && comment.user.username}</span>}
            avatar={this.renderAvatar(comment)}
            content={
              <div
                className="article-detail"
                dangerouslySetInnerHTML={{ __html: translateMarkdown(comment.content) }}
              />
            }>
            {commentId === comment.id && (
              <div className="reply-form">
                <TextArea
                  placeholder={`回复${comment.user.username}...`}
                  value={value}
                  onChange={this.handleChange}
                  onKeyUp={this.handleKeyUp}
                />
                <div className="reply-form-controls">
                  <span className="tip">Ctrl or ⌘ + Enter</span>
                  <Button htmlType="submit" type="primary" disabled={!value.trim()} onClick={this.onSubmit}>
                    回复
                  </Button>
                </div>
              </div>
            )}

            {comment.replies.map(reply => (
              <Comment
                key={reply.id}
                actions={[<span>Reply to</span>]}
                author={<span>{reply.user && reply.user.username}</span>}
                avatar={this.renderAvatar(reply)}
                content={<p>{reply.content}</p>}
              />
            ))}
          </Comment>
        ))}
      </div>
    )
  }
}

export default CommentList
