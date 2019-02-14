import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Comment, Avatar, Form, Button, List, Input, Icon } from 'antd'

@connect(state => state.user)
class CommentList extends Component {
  static propTypes = {
    commentList: PropTypes.array
  }

  state = {
    commentList: []
  }

  render() {
    const { commentList, userId, avatarColor } = this.props
    return (
      <div className="">
        {commentList.map(comment => (
          <Comment
            key={comment.id}
            actions={[<span>Reply to</span>]}
            author={<span>{comment.user.username}</span>}
            avatar={
              comment.userId === userId ? (
                <Avatar className="user-avatar" size="large" style={{ backgroundColor: avatarColor }}>
                  {comment.user.username}
                </Avatar>
              ) : (
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              )
            }
            content={<p>{comment.content}</p>}>
            111
          </Comment>
        ))}
      </div>
    )
  }
}

export default CommentList
