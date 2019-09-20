import React, { Component } from 'react'
import './index.less'
import { connect } from 'react-redux'
import { Badge, Tag } from 'antd'
import { Link } from 'react-router-dom'

function Categories(props) {
  const { categoryList } = props
  return (
    <div className='app-categories'>
      <h2 className='title'>Categories</h2>
      <p className='category-all-title'>{`${categoryList.length} categories in total`}</p>

      <div className='categories-list'>
        {categoryList.map((item, i) => (
          <Badge count={item.count} key={item.name}>
            <Tag color={item.color}>
              <Link to={`/categories/${item.name}`}>{item.name}</Link>
            </Tag>
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default connect(state => ({
  categoryList: state.article.categoryList
}))(Categories)
