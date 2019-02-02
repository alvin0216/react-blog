import React, { Component } from 'react'
import './index.less'
import { Link } from 'react-router-dom'

import { Tag, Icon } from 'antd'

const colorList = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
function random() {
  const len = colorList.length
  return Math.floor(Math.random() * len)
}

class ArticleDetail extends Component {
  state = {
    tags: ['react', 'javascript'],
    category: 'react'
  }

  render() {
    const { tags, category } = this.state
    return (
      <div className="post-wrap">
        <div className="post-header">
          <h1 className="post-title">Sequelize - 多表 CURD</h1>

          <div>
            <i className="iconfont icon-post" />
            &nbsp; Posted on &nbsp;
            <span>2018-08-03</span>
            &nbsp; | &nbsp;
            <Icon type="folder" />
            &nbsp; in &nbsp;
            <Tag color="#2db7f5">
              <Link to={category}>{category}</Link>
            </Tag>
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
      </div>
    )
  }
}

export default ArticleDetail
