import React, { useState, useEffect, Fragment } from 'react'
import './index.less'

import { ARCHIVES_PAGESIZE } from '@/utils/config'

// methods
import { groupBy } from '@/utils'
import axios from '@/utils/axios'

// components
import { Timeline, Icon, Spin } from 'antd'
import { Link } from 'react-router-dom'
import Pagination from '@/components/Pagination'

function Archives(props) {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchList(1)
    // component did mout
  }, [])

  function fetchList(page) {
    setLoading(true)
    axios.get('/article/list', { params: { page, pageSize: ARCHIVES_PAGESIZE } }).then(res => {
      const list = groupBy(res.rows, item => item.createdAt.slice(0, 4)) // 按年份排序
      setList(list)
      setTotal(res.count)
      setLoading(false)
    })
  }

  function handlePageChange(page) {
    fetchList(page)
    setCurrentPage(page)
  }

  return (
    <div className='app-archives'>
      <Spin tip='Loading...' spinning={loading} delay={500}>
        <Timeline>
          {list.map((d, i) => (
            <Fragment key={i}>
              {i === 0 && (
                <Timeline.Item>
                  <span className='desc'>{`Nice! ${total} posts in total. Keep on posting.`}</span>
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

        <Pagination current={currentPage} total={total} pageSize={ARCHIVES_PAGESIZE} onChange={handlePageChange} style={{ float: 'initial', marginTop: 10 }}/>
      </Spin>
    </div>
  )
}

export default Archives
