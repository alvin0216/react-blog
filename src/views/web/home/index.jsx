import React, { Component } from 'react'
import './index.less'

import { Icon, Divider, Pagination } from 'antd'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib'

import Tags from '../Tags'

class Home extends Component {
  state = { list: [], current: 1 }

  componentDidMount() {
    axios.get('/article/getList', { params: { offset: 1, limit: 15 } }).then(res => {
      const list = res.data
      list.forEach(item => {
        let index = item.content.indexOf('<!--more-->')
        item.description = translateMarkdown(item.content.slice(0, index))
      })
      this.setState({ list })
    })
  }

  jumpTo = id => {
    this.props.history.push(`/article/${id}`)
  }

  onChange = page => {
    this.setState({ current: page })
  }

  render() {
    const { list } = this.state
    return (
      <div className="content-wrap list">
        <ul className="ul-list">
          {list.map(item => (
            <li key={item.id} className="ul-list-item">
              <Divider orientation="left">
                <span className="title" onClick={() => this.jumpTo(item.id)}>
                  {item.title}
                </span>
                <span className="create-time">{item.createdAt.slice(0, 10)}</span>
              </Divider>

              <div
                onClick={() => this.jumpTo(item.id)}
                className="article-detail description"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />

              <div className="list-item-action">
                <Icon type="message" style={{ marginRight: 7 }} />
                {2}
                <Tags type="tags" list={item.tags} />
                <Tags type="categories" list={item.categories} />
              </div>
            </li>
          ))}
        </ul>
        <Pagination current={this.state.current} onChange={this.onChange} total={50} />
      </div>
    )
  }
}

export default Home
