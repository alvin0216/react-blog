import React, { useState } from 'react'
import { Input, Icon, Row } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import useMount from '@/hooks/useMount'
import { decodeQuery } from '@/utils'

function SearchButton(props) {
  const history = useHistory()
  const location = useLocation()
  const [keyword, setKeyword] = useState('')

  useMount(() => {
    const { keyword } = decodeQuery(location.search)
    keyword && setKeyword(keyword)
  })

  const handleSubmit = () => {
    if (keyword) history.push(`/?page=1&keyword=${keyword}`)
  }

  const handleChange = e => {
    setKeyword(e.target.value)
  }

  const handlePressEnter = e => {
    e.target.blur()
  }

  return (
    <div id='search-box'>
      <Icon type='search' className='search-icon' onClick={e => props.history.push(`/?page=1&keyword=${keyword}`)} />
      <Input
        type='text'
        value={keyword}
        onChange={handleChange}
        onBlur={handleSubmit}
        onPressEnter={handlePressEnter}
        className='search-input'
        placeholder='搜索文章'
        style={{ width: 200 }}
      />
    </div>
  )
}

export default SearchButton
