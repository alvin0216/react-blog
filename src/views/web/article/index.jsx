import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib/index'

import { Link } from 'react-router-dom'
import { Tag, Icon } from 'antd'

import Navigation from './navigation'

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

class ArticleDetail extends Component {
  state = {
    title: '',
    content: '',
    tags: ['react', 'javascript'],
    categories: [],
    postTime: '2019-01-01'
  }

  componentDidMount() {
    const id = this.props.match.params.id
    axios.get(`/article/get/${id}`).then(res => {
      const tags = res.data.tags.map(d => d.name)
      const categories = res.data.tags.map(d => d.name)
      const content = translateMarkdown(res.data.content)
      const { title, createdAt } = res.data
      this.setState({ tags, categories, content, title, postTime: createdAt.slice(0, 10) })
    })
  }

  render() {
    const { title, tags, categories, content, postTime } = this.state
    return (
      <div className="post-wrap">
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

        <div className='navigation'>
          <Navigation content={content} />
        </div>
      </div>
    )
  }
}

export default ArticleDetail
