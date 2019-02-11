import React, { Component } from 'react'
import './index.less'
import { Link } from 'react-router-dom'

import { Button, Card, Icon, Tag } from 'antd'
import { connect } from 'react-redux'

import axios from '@/lib/axios'
import { translateMarkdown } from '@/lib'

@connect(state => state.article)
class Home extends Component {
  state = { list: [] }

  componentDidMount() {
    axios.get('/article/getList', { params: { offset: 1, limit: 15 } }).then(res => {
      const list = res.data
      list.forEach(item => {
        item.content.replace(/(.*)<!--more-->/, ($0, $1) => {
          item.description = translateMarkdown($1)
        })
      })
      console.log(list)
      this.setState({ list })
    })
  }

  render() {
    const { list } = this.state
    const { colorList } = this.props
    return (
      <div className="content-wrap list">
        <ul className="ul-list">
          {list.map(item => (
            <li key={item.id} className="ul-list-item">
              <h2 className="title">{item.title}</h2>
              <p className="description">{item.description}</p>
              <ul className="list-item-action">
                <li>
                  <Icon type="message" style={{ marginRight: 7 }} />
                  {2}
                </li>
                <li>
                  <i className="iconfont icon-tags" style={{ marginRight: 7, verticalAlign: 'middle' }} />
                  {item.tags.map((tag, i) => (
                    <Tag color={colorList[i + 3]} key={tag.name}>
                      <Link to={tag.name}>{tag.name}</Link>
                    </Tag>
                  ))}
                </li>
                <li>
                  <Icon type="folder" style={{ marginRight: 7 }} />
                  {item.categories.map(cate => (
                    <Tag color="#2db7f5" key={cate.name}>
                      <Link to={cate.name}>{cate.name}</Link>
                    </Tag>
                  ))}
                </li>
              </ul>
            </li>
          ))}
        </ul>
        <div className="" />
      </div>
    )
  }
}

export default Home
