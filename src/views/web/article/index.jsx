import React, { useState, useEffect } from 'react'
import './index.less'

import { useMediaQuery } from 'react-responsive'
// methods
import axios from '@/utils/axios'
import { translateMarkdown, calcCommentsCount } from '@/utils'
import useAjaxLoading from '@/hooks/useAjaxLoading'

// components
import { Drawer, Icon, Divider, Spin } from 'antd'
import ArticleTag from '@/components/ArticleTag'
import SvgIcon from '@/components/SvgIcon'
import Navigation from './Navigation'
import Discuss from '@/components/Discuss'

function Article(props) {
  const [loading, withLoading] = useAjaxLoading()

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
    setTimeout(() => {
      const hash = decodeURI(props.location.hash)
      const ele = document.querySelector(`a[href="${hash}"]`)
      ele && hash && ele.click() // 挂载时路由跳转到指定位置
    }, 800)
  }, [])

  useEffect(() => {
    withLoading(axios.get(`/article/${props.match.params.id}`))
      .then(res => {
        res.content = translateMarkdown(res.content)
        setArticle(res)
      })
      .catch(e => {
        props.history.push('/404')
      })
  }, [props.match.params.id])

  function setCommentList(list) {
    setArticle({ ...article, comments: list })
  }

  const { title, content, tags, categories, comments, createdAt, viewCount } = article
  const articleId = parseInt(props.match.params.id)
  const isFoldNavigation = useMediaQuery({ query: '(max-width: 1300px)' })
  return (
    <Spin tip='Loading...' spinning={loading}>
      <article className='app-article' style={{ paddingRight: isFoldNavigation ? 0 : 275 }}>
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
        )
          : (
            <nav className='article-navigation'>
              <Navigation content={content} />
            </nav>
          )}

        <Discuss articleId={articleId} commentList={comments} setCommentList={setCommentList} />
      </article>
    </Spin>
  )
}

export default Article
