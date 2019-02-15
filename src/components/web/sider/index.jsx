import React, { Component } from 'react'
import './index.less'
import { connect } from 'react-redux'
import avatar from '@/assets/author_avatar.png'
import { Link } from 'react-router-dom'
import axios from '@/lib/axios'
import { Divider, Tag, Icon } from 'antd'

function random(colorList) {
  const len = colorList.length
  return Math.floor(Math.random() * len)
}

const mapStateToProps = state => ({
  tagList: state.article.tagList,
  colorList: state.common.colorList
})

@connect(mapStateToProps)
class BolgSider extends Component {
  state = { recentList: [] }

  componentDidMount() {
    axios.get('/article/getList', { params: { page: 1, pageSize: 6 } }).then(res => {
      this.setState({ recentList: res.rows })
    })
  }

  render() {
    const { tagList, colorList } = this.props
    const { recentList } = this.state
    return (
      <div className="sider-wrapper">
        <img src={avatar} className="sider-avatar" alt="" />
        <h2 className="name">郭大大</h2>
        <div className="title">前端打杂人员，略微代码洁癖</div>
        <ul className="link-list">
          <li>
            <Icon type="github" />
            <a target="_blank" rel="noreferrer noopener" href="https://github.com/gershonv">
              github
            </a>
          </li>
          <li>
            <i className="iconfont icon-juejin" />
            <a target="_blank" rel="noreferrer noopener" href="https://juejin.im/user/5acac6c4f265da2378408f92">
              juejin
            </a>
          </li>
        </ul>

        <Divider orientation="left">最近文章</Divider>
        <ul className="recent-list">
          {recentList.map(d => (
            <li key={d.id}>
              <Link to={`/article/${d.id}`}>{d.title}</Link>
            </li>
          ))}
        </ul>
        <Divider orientation="left">标签</Divider>
        <div className="tags-content">
          {tagList.map((tag, i) => (
            <Tag key={i} color={colorList[i] ? colorList[i] : colorList[random(colorList)]}>
              <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
            </Tag>
          ))}
        </div>
      </div>
    )
  }
}

export default BolgSider
