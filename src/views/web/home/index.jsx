import React, { useEffect, useState } from 'react'
import './index.less'
import axios from '@/utils/axios'

import { connect, useSelector, useDispatch } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import { decodeQuery, translateMarkdown, calcCommentsCount } from '@/utils'

// components
import { Icon, Divider, Empty, Drawer, Tag, Spin } from 'antd'
import Pagination from '@/components/Pagination'
import ArticleTag from '@/components/ArticleTag'
import SvgIcon from '@/components/SvgIcon'

function Preview({ list, showTitle = true }) {
  return (
    <ul className='preview'>
      {showTitle && <Divider>文章列表</Divider>}
      {list.map(item => (
        <li key={item.id}>
          <Link to={`/article/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  )
}

function NoDataDesc({ keyword }) {
  return keyword ? (
    <span>
      不存在标题/内容中含有 <span className='keyword'>{keyword}</span> 的文章！
    </span>
  ) : (
    <span>暂无数据...</span>
  )
}

function Home(props) {
  const windowWidth = useSelector(state => state.app.windowWidth) //  相当于 connect(state =>  state.app.windowWidth)(Home)
  const dispatch = useDispatch() // dispatch hooks

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // 当地址栏发生变化
  useEffect(() => {
    // componentDidMount props.location.search 发生变化 均执行以下代码
    const params = decodeQuery(props.location.search)
    fetchList(params)

    /*eslint react-hooks/exhaustive-deps: "off"*/
  }, [props.location.search])

  function fetchList({ page, keyword }) {
    const queryParams = { page, pageSize: 10 }
    if (keyword) queryParams.keyword = keyword
    setLoading(true)
    axios
      .get('/article/list', { params: queryParams })
      .then(res => {
        const list = res.rows
        // 处理 read more 的内容
        list.forEach(item => {
          const index = item.content.indexOf('<!--more-->')
          item.content = translateMarkdown(item.content.slice(0, index))
        })
        setList(list)
        setTotal(res.count)
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  // 跳转到文章详情
  function jumpTo(id) {
    props.history.push(`/article/${id}`)
  }

  function handlePageChange(page) {
    document.querySelector('.app-main').scrollTop = 0
    const params = { ...decodeQuery(props.location.search), page }
    let url
    Object.entries(params).forEach(item => {
      url = !url ? `?${item[0]}=${item[1]}` : `${url}&${item[0]}=${item[1]}`
    })
    props.history.push(url)
  }

  const { page, keyword } = decodeQuery(props.location.search)
  return (
    <Spin tip='Loading...' spinning={loading}>
      <div className='app-home'>
        <ul className='app-home-list'>
          {list.map(item => (
            <li key={item.id} className='app-home-list-item'>
              <Divider orientation='left'>
                <span className='title' onClick={() => jumpTo(item.id)}>
                  {item.title}
                </span>
                <span className='posted-time'>{item.createdAt.slice(0, 10)}</span>
              </Divider>

              <div
                onClick={() => jumpTo(item.id)}
                className='article-detail content'
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              <div className='list-item-others'>
                <SvgIcon type='iconcomment' />
                <span style={{ marginRight: 5 }}> {calcCommentsCount(item.comments)}</span>

                <SvgIcon type='iconview' style={{ marginRight: 5 }} />
                <span>{item.viewCount}</span>

                <ArticleTag tagList={item.tags} categoryList={item.categories} />
              </div>
            </li>
          ))}
        </ul>
        {list.length > 0 ? (
          <>
            {windowWidth > 1300 ? (
              <Preview list={list} />
            ) : (
              <>
                <div className='drawer-btn' onClick={e => setDrawerVisible(true)}>
                  <Icon type='menu-o' className='nav-phone-icon' />
                </div>
                <Drawer
                  title='文章列表'
                  placement='right'
                  closable={false}
                  onClose={e => setDrawerVisible(false)}
                  visible={drawerVisible}
                  getContainer={() => document.querySelector('.app-home')}>
                  <Preview list={list} showTitle={false} />
                </Drawer>
              </>
            )}
          </>
        ) : (
          <>
            {keyword && (
              <div className='no-data'>
                <Empty description={<NoDataDesc keyword={keyword} />} />
              </div>
            )}
          </>
        )}

        <Pagination current={parseInt(page) || 1} onChange={handlePageChange} total={total} />
      </div>
    </Spin>
  )
}

export default Home
