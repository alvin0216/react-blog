import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AuthorAvatar from '@/components/web/AuthorAvatar'

import { random, groupBy, translateMarkdown } from '@/lib'
import { Comment, Avatar, Button, Tooltip, Input, Icon, Popconfirm, message } from 'antd'
import moment from 'moment'

const { TextArea } = Input

const CommentItem = ({
  children,
  item,
  openReply,
  fatherId,
  levelOneId,
  levelTwoId,
  handleChange,
  handleKeyUp,
  onSubmit,
  renderAvatar,
  delComment,
  auth,
  value
}) => {
  const level = item.replies ? 1 : 2
  function handleClick(level) {
    if (level === 1) openReply(level, item.id)
    else openReply(level, item.id, fatherId)
  }
  const content = translateMarkdown(item.content)

  return (
    <Comment
      actions={[
        <span onClick={() => handleClick(level)}>Reply to</span>,
        <React.Fragment>
          {auth === 1 && (
            <Popconfirm
              title={'是否删除该评论？'}
              cancelText="取消"
              okText="确认"
              onConfirm={() => delComment(item, fatherId)}>
              <Icon type="delete" className="icon-delete" />
            </Popconfirm>
          )}
        </React.Fragment>
      ]}
      author={<span>{item.user && item.user.username}</span>}
      avatar={renderAvatar(item)}
      content={
        <div
          className="article-detail"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      }
      datetime={
        <Tooltip title={item.createdAt}>
          <span>{moment(item.createdAt).fromNow()}</span>
        </Tooltip>
      }>
      {((level === 1 && levelOneId === item.id) || (level === 2 && levelTwoId === item.id)) && (
        <div className="reply-form">
          <TextArea
            placeholder={`回复${item.user.username}...`}
            value={value}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
          />
          <div className="reply-form-controls">
            <span className="tip">Ctrl or ⌘ + Enter</span>
            <Button htmlType="submit" type="primary" disabled={!value.trim()} onClick={onSubmit}>
              回复
            </Button>
          </div>
        </div>
      )}
      {children}
    </Comment>
  )
}

@connect(state => ({
  username: state.user.username,
  userId: state.user.userId,
  auth: state.user.auth,
  colorMap: state.common.colorMap
}))
class CommentList extends Component {
  static propTypes = {
    commentList: PropTypes.array,
    articleId: PropTypes.number,
    setCommentList: PropTypes.func
  }

  state = {
    commentList: [],
    colorMap: {},
    commentId: 0,
    levelOneId: 0, // 一级激活 id 用于判断评论框的显示
    levelTwoId: 0, // 二级激活 id
    value: ''
  }

  renderAvatar = item => {
    const { userId, colorMap } = this.props
    if (item.userId === 1) return <AuthorAvatar /> // userId = 1 博主~~~
    if (item.userId === userId) {
      return <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    } else {
      return (
        <Avatar
          className="user-avatar"
          size="default"
          style={{ backgroundColor: colorMap[item.userId] || '#ccc' }}>
          {item.user && item.user.username}
        </Avatar>
      )
    }
  }

  openReply = (level, id, commentId) => {
    if (level === 1) {
      this.setState({ commentId: id, levelTwoId: 0, levelOneId: id })
    } else {
      this.setState({ levelOneId: 0, levelTwoId: id, commentId })
    }
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
  }

  handleKeyUp = e => {
    if (e.ctrlKey && e.keyCode === 13) {
      this.onSubmit()
    }
  }

  onSubmit = () => {
    const content = this.state.value.trim()
    if (!this.props.username) return message.warn('您未登陆，请登录后再试。')
    const { articleId } = this.props
    this.axios
      .post('/user/reply', {
        content,
        articleId,
        commentId: this.state.commentId
      })
      .then(res => {
        this.props.setCommentList(res.rows)
        this.setState({ commentId: 0, levelOneId: 0, levelTwoId: 0, value: '' })
      })
  }

  delComment = (item, commentId) => {
    if (item.replies) {
      this.axios.delete('/comment/del', { params: { commentId: item.id } }).then(res => {
        if (res.code !== 200) return message.error(res.message)
        const list = this.props.commentList.filter(d => d.id !== item.id)
        this.props.setCommentList(list)
        message.success(res.message)
      })
    } else {
      this.axios.delete('/reply/del', { params: { replyId: item.id } }).then(res => {
        if (res.code !== 200) return message.error(res.message)

        const list = [...this.props.commentList]
        list.forEach(d => {
          if (d.id === commentId) d.replies = d.replies.filter(v => v.id !== item.id)
        })
        this.props.setCommentList(list)
        message.success(res.message)
      })
    }
  }

  render() {
    const { commentList, auth } = this.props
    const { levelOneId, value, levelTwoId } = this.state

    const commonProps = {
      value,
      auth,
      renderAvatar: this.renderAvatar,
      openReply: this.openReply,
      handleChange: this.handleChange,
      handleKeyUp: this.handleKeyUp,
      onSubmit: this.onSubmit,
      delComment: this.delComment
    }

    return (
      <div className="">
        {commentList.map(comment => (
          <CommentItem key={comment.id} item={comment} levelOneId={levelOneId} {...commonProps}>
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                item={reply}
                levelTwoId={levelTwoId}
                fatherId={comment.id}
                {...commonProps}
              />
            ))}
          </CommentItem>
        ))}

        {/* {commentList.map(comment => (
          <Comment
            key={comment.id}
            actions={[<span onClick={() => this.openReply(1, comment.id)}>Reply to</span>]}
            author={<span>{comment.user && comment.user.username}</span>}
            avatar={this.renderAvatar(comment)}
            content={
              <div
                className="article-detail"
                dangerouslySetInnerHTML={{ __html: translateMarkdown(comment.content) }}
              />
            }>
            {levelOneId === comment.id && (
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
                actions={[<span onClick={() => this.openReply(2, reply.id, comment.id)}>Reply to</span>]}
                author={<span>{reply.user && reply.user.username}</span>}
                avatar={this.renderAvatar(reply)}
                content={<p>{reply.content}</p>}>
                {levelTwoId === reply.id && (
                  <div className="reply-form">
                    <TextArea
                      placeholder={`回复${reply.user.username}...`}
                      value={value}
                      onChange={this.handleChange}
                      onKeyUp={this.handleKeyUp}
                    />
                    <div className="reply-form-controls">
                      <span className="tip">Ctrl or ⌘ + Enter</span>
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={!value.trim()}
                        onClick={this.onSubmit}>
                        回复
                      </Button>
                    </div>
                  </div>
                )}
              </Comment>
            ))}
          </Comment>
        ))} */}
      </div>
    )
  }
}

export default CommentList
