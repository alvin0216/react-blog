import React, { Component } from 'react'
import './index.less'
import { connect } from 'react-redux'
import { Timeline, Icon, Pagination } from 'antd'
import axios from '@/lib/axios'
import { Link } from 'react-router-dom'

@connect(state => ({
  categoryList: state.article.categoryList
}))
class Categories extends Component {
  state = { list: [], total: 0, current: 1 }

  componentDidMount() {
    // this.fetchList(1)
  }

  render() {
    const { categoryList } = this.props
    return (
      <div className="content-wrap categories">
        <h2 className="title">Categories</h2>
        <p className="category-all-title">{`${categoryList.length} categories in total`}</p>
        <ul style={{ listStyle: 'circle' }}>
          {categoryList.map(c => (
            <li key={c.name}>
              <Link to={`/categories/${c.name}`}>{c.name}</Link>
              <span>（{c.count}）</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Categories
