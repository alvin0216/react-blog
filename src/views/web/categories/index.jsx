import React, { Component } from 'react'
import './index.less'
import { connect } from 'react-redux'
import { Badge, Tag } from 'antd'

import { Link } from 'react-router-dom'

@connect(state => ({
  categoryList: state.article.categoryList,
  colorList: state.article.colorList
}))
class Categories extends Component {
  render() {
    const { categoryList, colorList } = this.props

    return (
      <div className="content-wrap categories">
        <h2 className="title">Categories</h2>
        <p className="category-all-title">{`${categoryList.length} categories in total`}</p>

        <div className="categories-list">
          {categoryList.map((item, i) => (
            <Badge count={item.count} key={item.name}>
              <Tag color={colorList[i]}>
                <Link to={`/categories/${item.name}`}>{item.name}</Link>
              </Tag>
            </Badge>
          ))}
        </div>
      </div>
    )
  }
}

export default Categories
