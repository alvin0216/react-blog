import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ..
import { Spin } from 'antd'
import { decodeQuery } from '@/utils'
import { login } from '@/redux/modal/user'
import { get, remove } from '@/utils/storage'

function AppLoading(props) {
  const dispatch = useDispatch() // dispatch hooks

  const [loading, setLoading] = useState('')

  function jumpToBefore() {
    const url = get('prevRouter') || '/'
    if (url.includes('?code=')) {
      props.history.push('/')
    } else {
      props.history.push(url)
    }
  }

  // github 加载中状态 方案1
  useEffect(() => {
    let componentWillUnmount = false
    // component did mount
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
    <div className='github-loading-container'>
      <div>
        <img
          src='https://github.githubassets.com/images/spinners/octocat-spinner-64.gif'
          alt='loading'
          className='github-loading-img'
        />
      </div>
      <div className='text'>Loading activity...</div>
    </div>
  )
}

export default AppLoading
