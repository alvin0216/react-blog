import React, { Component } from 'react'
import './index.less'

import { Icon, Divider, Pagination } from 'antd'
import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib'

import Tags from '../Tags'
import Preview from './preview'

class Home extends Component {
  state = { list: [], page: 1, total: 0 }

  componentDidMount() {
    this.fetchList({ page: 1 })
  }

  fetchList({ page = 1 }) {
    axios.get('/article/getList', { params: { page, pageSize: 10 } }).then(res => {
      const list = res.rows
      list.forEach(item => {
        let index = item.content.indexOf('<!--more-->')
        item.description = translateMarkdown(item.content.slice(0, index))
      })
      this.setState({ list, total: res.count })
    })
  }

  jumpTo = id => {
    this.props.history.push(`/article/${id}`)
  }

  onChange = page => {
    document.querySelector('.content-wrapper').scrollTop = 0
    this.setState({ page }, () => this.fetchList({ page }))
  }

  render() {
    const { list, total, page } = this.state
    return (
      <div className="content-inner-wrapper home">
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
        {list.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <Pagination current={page} onChange={this.onChange} total={total} />
          </div>
        )}
        <ul className="preview">
          <Preview list={list} />
        </ul>
      </div>
    )
  }
}

export default Home
