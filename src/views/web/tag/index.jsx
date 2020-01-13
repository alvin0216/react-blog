import React, { Component, useEffect, useState } from 'react'
import './index.less'

import axios from '@/utils/axios'
import { TAG_PAGESIZE } from '@/utils/config'

import { Link } from 'react-router-dom'
import { Timeline, Spin } from 'antd'
import Pagination from '@/components/Pagination'

// hooks
import useFetchList from '@/hooks/useFetchList'

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

  const { loading, pagination, dataList } = useFetchList({
    requestUrl: '/article/list',
    queryParams: { [type]: name },
    fetchDependence: [props.location.search, props.location.pathname]
  })

  return (
    <Spin tip='Loading...' spinning={loading} delay={500}>
      <div className='app-tags'>
        <TimeLineList list={dataList} name={name} type={type} />
        <Pagination
          {...pagination}
          pageSize={TAG_PAGESIZE}
          style={{ float: 'initial', marginTop: 10 }}
        />
      </div>
    </Spin>
  )
}

export default List
