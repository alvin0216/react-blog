import React, { Component, Fragment, useState, useEffect } from 'react'
import './index.less'
import { Link } from 'react-router-dom'

import { groupBy } from '@/lib'
import { Timeline, Icon, Pagination, Spin } from 'antd'
import BlogPagination from '@/components/web/pagination'
import axios from '@/lib/axios'

function Archives(props) {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchList(1)
  }, [])

  function fetchList(page = 1) {
    setLoading(true)
    axios
      .get('/article/getList', { params: { page, pageSize: 15 } })
      .then(res => {
        const list = groupBy(res.rows, item => item.createdAt.slice(0, 4))
        setList(list)
        setTotal(res.count)
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  function handlePageChange(page) {
    fetchList(page)
    setCurrent(page)
  }

  return (
    <div className="content-inner-wrapper archives">
      <Spin tip="Loading..." spinning={loading}>
        <Timeline>
          {list.map((d, i) => (
            <Fragment key={i}>
              {i === 0 && (
                <Timeline.Item>
                  <span className="desc">{`Nice! ${total} posts in total. Keep on posting.`}</span>
                  <br />
                  <br />
                </Timeline.Item>
              )}

              <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
                <div className="year">
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

        {list.length < total && (
          <BlogPagination
            current={parseInt(current) || 1}
            onChange={handlePageChange}
            total={total}
            pageSize={15}
          />
        )}
      </Spin>
    </div>
  )
}

export default Archives