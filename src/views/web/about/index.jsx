import React, { Component, useEffect, useState } from 'react'
import './index.less'
import { Avatar } from 'antd'

import { SIDEBAR, ABOUT } from '@/config'

import axios from '@/utils/axios'
import Discuss from '@/components/Discuss'

import { useMediaQuery } from 'react-responsive'

function About(props) {
  const [commentList, setCommentList] = useState([])
  const iphoneScreen = useMediaQuery({ query: '(max-width: 576px)' })

  useEffect(() => {
    const fetchList = () => {
      axios.get('/article/-1').then(article => {
        setCommentList(article.comments)
      })
    }
    ABOUT.discuss && fetchList()
  }, [])

  return (
    <div className='app-about' style={{ paddingRight: iphoneScreen ? 0 : 20 }}>
      <Avatar src={SIDEBAR.avatar} />
      <span style={{ paddingLeft: 10 }}>{ABOUT.describe}</span>
      {ABOUT.renderMyInfo || null}
      {ABOUT.discuss && <Discuss articleId={-1} commentList={commentList} setCommentList={setCommentList} />}
    </div>
  )
}

export default About
