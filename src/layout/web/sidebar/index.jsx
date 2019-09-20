import React, { useEffect, useState } from 'react'
import { SIDEBAR } from '@/config'
import axios from '@/utils/axios'
import { connect } from 'react-redux'

// components
import { Link } from 'react-router-dom'
import SvgIcon from '@/components/SvgIcon'
import Href from '@/components/Href'
import { Icon, Divider, Tag } from 'antd'

const HOME_PAGES_ICONS_LIST = [
  {
    key: 'github',
    value: <Icon type='github' theme='filled' className='homepage-icon' />
  },
  {
    key: 'juejin',
    value: <SvgIcon type='iconjuejin' className='homepage-icon' />
  }
]

function SideBar(props) {
  const [articleList, setArticleLst] = useState([])

  useEffect(() => {
    axios.get('/article/list', { params: { order: 'viewCount DESC', page: 1, pageSize: 6 } }).then(res => {
      setArticleLst(res.rows)
    })
    // log
    // console.log('componentDidMout')
  }, [])

  // 渲染个人主页的图标
  const renderHomePagesIcon = key => {
    const target = HOME_PAGES_ICONS_LIST.find(d => d.key === key)
    return target && target.value
  }

  return (
    <div className='app-sidebar'>
      <img src={SIDEBAR.avatar} className='sider-avatar' alt='' />
      <h2 className='title'>{SIDEBAR.title}</h2>
      <h5 className='sub-title'>{SIDEBAR.subTitle}</h5>
      <ul className='home-pages'>
        {Object.keys(SIDEBAR.homepages).map(key => (
          <li key={key}>
            {renderHomePagesIcon(key)}
            <Href href={SIDEBAR.homepages[key]}>{key}</Href>
          </li>
        ))}
      </ul>

      <Divider orientation='left'>热门文章</Divider>
      <ul className='article-list'>
        {articleList.map(d => (
          <li key={d.id}>
            <Link to={`/article/${d.id}`}>{d.title}</Link>
          </li>
        ))}
      </ul>

      <Divider orientation='left'>标签</Divider>
      <div className='tag-list'>
        {props.tagList.map((tag, i) => (
          <Tag key={i} color={tag.color}>
            <Link to={`/tags/${tag.name}`}>{tag.name}</Link>
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default connect(state => ({
  tagList: state.article.tagList || []
}))(SideBar)
