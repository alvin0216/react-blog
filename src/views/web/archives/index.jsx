import React, { Component, Fragment } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { Link } from 'react-router-dom'

import { groupBy } from '@/lib'
import { Timeline, Icon, Pagination, Spin } from 'antd'
import BlogPagination from '@/components/web/pagination'

class Archives extends Component {
  state = {
    list: [],
    total: 0,
    current: 1,
    loading: false
  }

  componentDidMount() {
    this.fetchList(1)
  }

  fetchList({ page = 1 }) {
    this.setState({ loading: true })

    axios
      .get('/article/getList', { params: { page, pageSize: 15 } })
      .then(res => {
        const list = groupBy(res.rows, item => item.createdAt.slice(0, 4))
        this.setState({ list, total: res.count, loading: false })
      })
      .catch(e => this.setState({ loading: false }))
  }

  handlePageChange = page => {
    this.fetchList({ page: page })
    this.setState({ current: page })
  }

  render() {
    const { list, total, loading, current } = this.state
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
            <BlogPagination current={parseInt(current) || 1} onChange={this.handlePageChange} total={total} />
          )}
        </Spin>
      </div>
    )
  }
}

export default Archives
