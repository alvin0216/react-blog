import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib/index'

import { Link } from 'react-router-dom'
import { Tag, Icon } from 'antd'

import Navigation from './navigation'
import loading from '@/assets/loading.gif'

const colorList = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
]
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
        const tags = res.data.tags.map(d => d.name)
        const categories = res.data.tags.map(d => d.name)
        const content = translateMarkdown(res.data.content)
        const { title, createdAt } = res.data
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

              <div>
                <i className="iconfont icon-post" />
                &nbsp; Posted on &nbsp;
                <span>{postTime}</span>
                &nbsp; | &nbsp;
                <Icon type="folder" />
                &nbsp; in &nbsp;
                {categories.map(item => (
                  <Tag color="#2db7f5" key={item}>
                    <Link to={item}>{item}</Link>
                  </Tag>
                ))}
              </div>
            </div>

            <div className="tags">
              <i className="iconfont icon-tags" />
              {tags.map((tag, i) => (
                <Tag key={i} color={colorList[i] ? colorList[i] : colorList[random()]}>
                  <Link to={tag}>{tag}</Link>
                </Tag>
              ))}
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
