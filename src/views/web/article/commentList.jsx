import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import blogAuthor from '@/assets/sider_avatar.png'

import { random } from '@/lib'
import { Comment, Avatar, Form, Button, List, Input, Icon } from 'antd'


@connect(state => ({
  userId: state.user.userId,
  colorList: state.article.colorList
}))
class CommentList extends Component {
  static propTypes = {
    commentList: PropTypes.array
  }

  state = {
    commentList: []
  }

  renderAvatar = comment => {
    const { userId, colorList } = this.props
    if (comment.userId === 1) return <Avatar src={blogAuthor} /> // userId = 1 博主~~~
    if (comment.userId === userId) {
      return <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    } else {
      return (
        <Avatar className="user-avatar" size="default" style={{ backgroundColor: colorList[random(colorList)] }}>
          {comment.user.username}
        </Avatar>
      )
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
            author={<span>{comment.user && comment.user.username}</span>}
            avatar={this.renderAvatar(comment)}
            content={<p>{comment.content}</p>}>
            {/* 111 */}
          </Comment>
        ))}
      </div>
    )
  }
}

export default CommentList
