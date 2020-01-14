import React, { useState, useEffect, Fragment } from 'react'
import './index.less'

import { ARCHIVES_PAGESIZE } from '@/utils/config'

// methods
import { groupBy } from '@/utils'

// components
import { Timeline, Icon, Spin } from 'antd'
import { Link } from 'react-router-dom'
import Pagination from '@/components/Pagination'

// hooks
import useFetchList from '@/hooks/useFetchList'

function Archives(props) {
  const { dataList, loading, pagination } = useFetchList({
    requestUrl: '/article/list',
    queryParams: {
      pageSize: ARCHIVES_PAGESIZE
    },
    fetchDependence: [props.location.pathname, props.location.search]
  })

  const list = groupBy(dataList, item => item.createdAt.slice(0, 4)) // 按年份排序

  return (
    <div className='app-archives'>
      <Spin tip='Loading...' spinning={loading} delay={500}>
        <Timeline>
          {list.map((d, i) => (
            <Fragment key={i}>
              {i === 0 && (
                <Timeline.Item>
                  <span className='desc'>{`Nice! ${pagination.total} posts in total. Keep on posting.`}</span>
                  <br />
                  <br />
                </Timeline.Item>
              )}

              <Timeline.Item dot={<Icon type='clock-circle-o' style={{ fontSize: '16px' }} />} color='red'>
                <div className='year'>
                  {d[0]['createdAt'].slice(0, 4)}
                  ...
                </div>
                <br />
              </Timeline.Item>

              {d.map(item => (
                <Timeline.Item key={item.id}>
                  <span style={{ fontSize: '13px', marginRight: '16px' }}>{item.createdAt.slice(5, 10)}</span>
                  <Link to={`/article/${item.id}`}>{item.title}</Link>
                </Timeline.Item>
              ))}
            </Fragment>
          ))}
        </Timeline>

        <Pagination {...pagination} style={{ float: 'initial', marginTop: 10 }} />
      </Spin>
    </div>
  )
}

export default Archives
