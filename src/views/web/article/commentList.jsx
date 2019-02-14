import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import blogAuthor from '@/assets/sider_avatar.png'

import { Comment, Avatar, Form, Button, List, Input, Icon } from 'antd'

@connect(state => state.user)
class CommentList extends Component {
  static propTypes = {
    commentList: PropTypes.array
  }

  state = {
    commentList: []
  }

  renderAvatar = comment => {
    const { userId, avatarColor } = this.props
    if (comment.userId === 1) return <Avatar src={blogAuthor} /> // userId = 1 博主~~~
    if (comment.userId === userId) {
      return (
        <Avatar className="user-avatar" size="large" style={{ backgroundColor: avatarColor }}>
          {comment.user.username}
        </Avatar>
      )
    } else {
      return <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    }
  }

  render() {
    const { commentList } = this.props
    return (
      <div className="">
        {commentList.map(comment => (
          <Comment
            key={comment.id}
            actions={[<span>Reply to</span>]}
            author={<span>{comment.user.username}</span>}
            avatar={this.renderAvatar(comment)}
            content={<p>{comment.content}</p>}>
            111
          </Comment>
        ))}
      </div>
    )
  }
}

export default CommentList
