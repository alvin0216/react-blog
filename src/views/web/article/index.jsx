import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib/index'

import Navigation from './navigation'
import Loading from '@/components/helper/Loading'
import Tags from '../Tags'

class ArticleDetail extends Component {
  state = {
    id: '',
    title: '',
    content: '',
    tags: ['react', 'javascript'],
    categories: [],
    postTime: '2019-01-01',
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
        const { title, createdAt, tags, categories } = res.data
        this.setState({
          tags,
          categories,
          content,
          title,
          postTime: createdAt.slice(0, 10),
          loading: false
        })
      })
      .catch(err => {
        this.props.history.push('/404')
      })
  }

  render() {
    const { title, tags, categories, content, postTime, loading } = this.state

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
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default ArticleDetail
