import React, { Component, useEffect, useState } from 'react'
import './index.less'

import axios from '@/utils/axios'
import { TAG_PAGESIZE } from '@/utils/config'

import { Link } from 'react-router-dom'
import { Timeline, Spin } from 'antd'
import Pagination from '@/components/Pagination'

function TimeLineList({ list, name, type }) {
  return (
    <div className='timeline'>
      <Timeline>
        <Timeline.Item>
          <h1 className='list-title'>
            {name}
            <small className='type-name'> {type}</small>
          </h1>
          <br />
        </Timeline.Item>
        {list.map(item => (
          <Timeline.Item key={item.id}>
            <span style={{ fontSize: '13px', marginRight: '16px' }}>{item.createdAt.slice(5, 10)}</span>
            <Link to={`/article/${item.id}`}>{item.title}</Link>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  )
}

// 根据 tag / category 获取文章列表
function List(props) {
  const type = props.location.pathname.includes('categories') ? 'category' : 'tag'
  const name = props.match.params.name

  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // componentDidMount name did update
    fetchList(1)
    // console.log(props)
  }, [props.match.params.name])

  function fetchList(page) {
    setLoading(true)
    axios
      .get(`/article/list`, {
        params: {
          [type]: name,
          page
        }
      })
      .then(res => {
        setLoading(false)
        setTotal(res.count)
        setList(res.rows)
      })
  }

  function handlePageChange(page) {
    fetchList(page)
    setCurrentPage(page)
  }

  return (
    <Spin tip='Loading...' spinning={loading} delay={500}>
      <div className='app-tags'>
        <TimeLineList list={list} name={name} type={type} />
        <Pagination current={currentPage} onChange={handlePageChange} total={total} pageSize={TAG_PAGESIZE} />
      </div>
    </Spin>
  )
}

export default List
