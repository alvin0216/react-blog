import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Comment, Avatar, Form, Button, List, Input } from 'antd'

class ArticleComment extends Component {
  static propTypes = {
    articleId: PropTypes.number.isRequired,
    comments: PropTypes.array
  }

  state = {
    comments: [],
    submitting: false,
    value: ''
  }

  render() {
    return <div />
  }
}

export default ArticleComment
