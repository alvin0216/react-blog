import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib/index'

import { Link } from 'react-router-dom'
import { Tag, Icon } from 'antd'

import Navigation from './navigation'
import loading from '@/assets/loading.gif'
import Tags from '../Tags'
import { connect } from 'net'

function random() {
  const len = colorList.length
  return Math.floor(Math.random() * len)
}

const Loading = () => <img src={loading} alt="" className="article-loading" />

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
      <div className="content-wrap">
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

            <div className="navigation">
              <Navigation content={content} />
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default ArticleDetail
