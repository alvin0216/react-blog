import React, { Component, Fragment, useState, useEffect } from 'react'
import './index.less'
import { connect } from 'react-redux'
import { translateMarkdown, getCommentsCount } from '@/lib/index'
import { openDrawer, closeDrawer, generateColorMap } from '@/redux/common/actions'

import Navigation from './navigation'
import Loading from '@/components/helper/Loading'
import Tags from '../Tags'
import Comment from '@/components/web/comment'
import { Drawer, Icon, Divider } from 'antd'
import axios from '@/lib/axios'

function ArticleDetail(props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [categories, setCategories] = useState([])
  const [postTime, setPostTime] = useState('')
  const [commentList, setCommentList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = id => {
      setLoading(true)
      axios
        .get(`/article/get/${id}`)
        .then(res => {
          const content = translateMarkdown(res.data.content)
          const { title, createdAt, tags, categories, comments } = res.data
          props.generateColorMap(comments)
          setTags(tags)
          setCategories(categories)
          setTitle(title)
          setContent(content)
          setPostTime(postTime)
          setCommentList(comments)
          setLoading(false)
        })
        .catch(err => {
          props.history.push('/404')
        })
    }
    fetchData(props.match.params.id)
  }, [props.match.params.id])

  const articleId = parseInt(props.match.params.id)
  return (
    <div className="content-inner-wrapper article">
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <div className="post-header">
            <h1 className="post-title">{title}</h1>

            <div className="others">
              <i className="iconfont icon-post" />
              &nbsp; Posted on &nbsp;
              <span>{postTime}</span>
              <Tags type="tags" list={tags} />
              <Tags type="categories" list={categories} />
              <Divider type="vertical" />
              <Icon type="message" style={{ marginRight: 7 }} />
              {getCommentsCount(commentList)}
            </div>
          </div>

          <div className="article-detail" dangerouslySetInnerHTML={{ __html: content }} />

          {props.windowWidth > 1300 ? (
            <div className="right-navigation">
              <Navigation content={content} />
            </div>
          ) : (
            <Fragment>
              <div className="drawer-btn" onClick={props.openDrawer}>
                <Icon type="menu-o" className="nav-phone-icon" />
              </div>
              <Drawer
                title={title}
                placement="right"
                closable={false}
                onClose={props.closeDrawer}
                visible={props.drawerVisible}>
                <div className="right-navigation">
                  <Navigation content={content} />
                </div>
              </Drawer>
            </Fragment>
          )}

          <Comment articleId={articleId} commentList={commentList} setCommentList={setCommentList} />
        </React.Fragment>
      )}
    </div>
  )
}

export default connect(
  state => ({
    windowWidth: state.common.windowWidth,
    drawerVisible: state.common.drawerVisible
  }),
  { openDrawer, closeDrawer, generateColorMap }
)(ArticleDetail)