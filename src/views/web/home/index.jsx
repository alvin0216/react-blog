import React, { Component, Fragment, useEffect, useState } from 'react'
import './index.less'
import axios from '@/lib/axios'

import { connect } from 'react-redux'

import { Icon, Divider, Empty, Drawer } from 'antd'
import { translateMarkdown, decodeQuery, getCommentsCount } from '@/lib'
import { openDrawer, closeDrawer } from '@/redux/common/actions'

import Tags from '../Tags'
import Preview from './preview'
import Loading from '@/components/helper/Loading'
import BlogPagination from '@/components/web/pagination'

const NoDataDesc = ({ keyword }) => (
  <Fragment>
    不存在标题中含有 <span className="keyword">{keyword}</span> 的文章！
  </Fragment>
)

function Home(props) {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    props.closeDrawer() // componentDidMount
    return () => {
      // props.closeDrawer() // componentWillUnmount
    }
  }, [])

  // 当地址栏发生变化
  useEffect(() => {
    const fetchList = ({ page, keyword }) => {
      setLoading(true)
      axios
        .get('/article/getList', { params: { page, pageSize: 10, title: keyword } })
        .then(res => {
          const list = res.rows
          // 处理 read more 的内容
          list.forEach(item => {
            let index = item.content.indexOf('<!--more-->')
            item.description = translateMarkdown(item.content.slice(0, index))
          })
          setList(list)
          setTotal(res.count)
          setLoading(false)
        })
        .catch(e => {
          setLoading(false)
        })
    }

    // componentDidMount props.location.search 发生变化 均执行以下代码
    const params = decodeQuery(props.location.search)
    fetchList(params)
    return () => {
      // componentDidMount 不执行，props.location.search 发生变化时执行
    }
  }, [props.location.search])

  // 跳转到文章详情
  function jumpTo(id) {
    props.history.push(`/article/${id}`)
  }

  function handlePageChange(page) {
    document.querySelector('.content-wrapper').scrollTop = 0
    let params = { ...decodeQuery(props.location.search), page }
    let url
    Object.entries(params).forEach(item => {
      url = !url ? `?${item[0]}=${item[1]}` : `${url}&${item[0]}=${item[1]}`
    })
    props.history.push(url)
  }

  const { page, keyword } = decodeQuery(props.location.search)
  return (
    <div className="content-inner-wrapper home">
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <ul className="ul-list">
            {list.map(item => (
              <li key={item.id} className="ul-list-item">
                <Divider orientation="left">
                  <span className="title" onClick={() => jumpTo(item.id)}>
                    {item.title}
                  </span>
                  <span className="create-time">{item.createdAt.slice(0, 10)}</span>
                </Divider>

                <div
                  onClick={() => jumpTo(item.id)}
                  className="article-detail description"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />

                <div className="list-item-action">
                  <Icon type="message" style={{ marginRight: 7 }} />
                  {getCommentsCount(item.comments)}
                  <Tags type="tags" list={item.tags} />
                  <Tags type="categories" list={item.categories} />
                </div>
              </li>
            ))}
          </ul>
          {list.length > 0 ? (
            <Fragment>
              {list.length < total && (
                <BlogPagination current={parseInt(page) || 1} onChange={handlePageChange} total={total} />
              )}

              {props.windowWidth > 1300 ? (
                <Preview list={list} />
              ) : (
                <Fragment>
                  <div className="drawer-btn" onClick={props.openDrawer}>
                    <Icon type="menu-o" className="nav-phone-icon" />
                  </div>
                  <Drawer
                    title="文章导航"
                    placement="right"
                    closable={false}
                    onClose={props.closeDrawer}
                    visible={props.drawerVisible}>
                    <Preview list={list} />
                  </Drawer>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <div className="no-data">
              <Empty description={<NoDataDesc keyword={keyword} />} />
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default connect(
  state => ({
    drawerVisible: state.common.drawerVisible,
    windowWidth: state.common.windowWidth
  }),
  { openDrawer, closeDrawer }
)(Home)