import React, { Component, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { decodeQuery } from '@/utils'
import { login } from '@/redux/user/actions'
import { get, remove } from '@/utils/storage'
import { Spin } from 'antd'
import { GITHUB } from '@/config'

function AppMain(props) {
  if (GITHUB.loadingType === 1 || !GITHUB.enable) return <div className='app-main'>{props.children}</div>

  const dispatch = useDispatch() // dispatch hooks

  const [loading, setLoading] = useState(false)

  function jumpToBefore() {
    const url = get('prevRouter')
    if (url.includes('?code=')) {
      props.history.push('/')
    } else {
      props.history.push(url)
    }
  }

  // github 加载中状态 方案1
  useEffect(() => {
    // component did
    let componentWillUnmount = false
    const params = decodeQuery(props.location.search)
    if (params.code) {
      // github callback code
      setLoading(true)
      dispatch(login({ code: params.code }))
        .then(() => {
          jumpToBefore()
          if (componentWillUnmount) return
          setLoading(false)
        })
        .catch(e => {
          jumpToBefore()
          if (componentWillUnmount) return
          setLoading(false)
        })
    }

    return () => {
      componentWillUnmount = true
    }
  }, [])

  return (
    <Spin tip='github login ing...' spinning={loading}>
      <div className='app-main'>{props.children}</div>
    </Spin>
  )
}

export default AppMain
