import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib/index'

import Navigation from './navigation'
import Loading from '@/components/helper/Loading'
import Tags from '../Tags'
import Comment from './comment'

class ArticleDetail extends Component {
  state = {
    title: '',
    content: '',
    tags: ['react', 'javascript'],
    categories: [],
    postTime: '2019-01-01',
    comments: [],
    loading: true
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchData()
    }
  }

  fetchData = () => {
    const id = this.props.match.params.id
    this.setState({ loading: true })
    axios
      .get(`/article/get/${id}`)
      .then(res => {
        const content = translateMarkdown(res.data.content)
        const { title, createdAt, tags, categories, comments } = res.data
        this.setState({
          tags,
          categories,
          content,
          title,
          postTime: createdAt.slice(0, 10),
          comments,
          loading: false
        })
      })
      .catch(err => {
        this.props.history.push('/404')
      })
  }

  render() {
    const { title, tags, categories, content, postTime, comments, loading } = this.state
    const articleId = parseInt(this.props.match.params.id)
    return (
      <div className="content-inner-wrapper article">
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className="post-header">
              <h1 className="post-title">{title}</h1>

              <div className="others">
                <i className="iconfont icon-post" />
                &nbsp; Posted on &nbsp;
                <span>{postTime}</span>
                <Tags type="tags" list={tags} />
                <Tags type="categories" list={categories} />
              </div>
            </div>

            <div className="article-detail" dangerouslySetInnerHTML={{ __html: content }} />

            <div className="right-navigation">
              <Navigation content={content} />
            </div>

            <Comment articleId={articleId} commentList={comments} />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default ArticleDetail
