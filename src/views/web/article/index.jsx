import React, { Component, Fragment, useState, useEffect } from 'react'
import './index.less'

import { connect } from 'react-redux'

// methods
import axios from '@/utils/axios'
import { translateMarkdown, calcCommentsCount } from '@/utils'

// components
import { Drawer, Icon, Divider, Tag, Spin } from 'antd'
import ArticleTag from '@/components/ArticleTag'
import SvgIcon from '@/components/SvgIcon'
import Navigation from './Navigation'
import Discuss from '@/components/Discuss'

function Article(props) {
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState({
    title: '',
    content: '',
    tags: [],
    categories: [],
    comments: [],
    createdAt: '',
    viewCount: 0
  })
  const [drawerVisible, setDrawerVisible] = useState(false)

  useEffect(() => {
    const fetchData = id => {
      setLoading(true)
      axios
        .get(`/article/${id}`)
        .then(res => {
          res.content = translateMarkdown(res.content)
          setArticle(res)
          setLoading(false)
        })
        .catch(e => {
          props.history.push('/404')
        })
    }
    fetchData(props.match.params.id)
    /*eslint react-hooks/exhaustive-deps: "off"*/
  }, [props.match.params.id])

  function setCommentList(list) {
    setArticle({ ...article, comments: list })
  }

  const { title, content, tags, categories, comments, createdAt, viewCount } = article
  const articleId = parseInt(props.match.params.id)
  const isFoldNavigation = props.windowWidth < 1300
  return (
    <Spin tip='Loading...' spinning={loading} delay={100}>
      <div className='app-article' style={{ paddingRight: isFoldNavigation ? 0 : 265 }}>
        <div className='post-header'>
          <h1 className='post-title'>{title}</h1>

          <div className='article-desc'>
            <span className='post-time'>
              <SvgIcon type='iconpost' />
              &nbsp; Posted on &nbsp;
              <span>{createdAt.slice(0, 10)}</span>
            </span>
            <ArticleTag tagList={tags} categoryList={categories} />
            <Divider type='vertical' />
            <a className='comment-count' href='#discuss' style={{ color: 'inherit' }}>
              <SvgIcon type='iconcomment' />
              <span style={{ marginRight: 5 }}> {calcCommentsCount(comments)}</span>
            </a>
            <SvgIcon type='iconview' style={{ marginRight: 2 }} />
            <span>{viewCount}</span>
          </div>
        </div>

        <div className='article-detail' dangerouslySetInnerHTML={{ __html: content }} />

        {isFoldNavigation ? (
          <>
            <div className='drawer-btn' onClick={e => setDrawerVisible(true)}>
              <Icon type='menu-o' className='nav-phone-icon' />
            </div>
            <Drawer
              title={title}
              placement='right'
              closable={false}
              onClose={e => setDrawerVisible(false)}
              visible={drawerVisible}
              getContainer={() => document.querySelector('.app-article')}>
              <div className='right-navigation'>
                <Navigation content={content} />
              </div>
            </Drawer>
          </>
        ) : (
          <div className='article-navigation'>
            <Navigation content={content} />
          </div>
        )}

        <Discuss articleId={articleId} commentList={comments} setCommentList={setCommentList} />
      </div>
    </Spin>
  )
}

export default connect(state => ({
  windowWidth: state.app.windowWidth
}))(Article)
