import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import { Timeline, Pagination, Spin } from 'antd'
import BlogPagination from '@/components/web/pagination'

const TimeLineList = ({ list, name, type }) => {
  return (
    <div className="timeline">
      <Timeline>
        <Timeline.Item>
          <h1 className="list-title">
            {name}
            <small className="type-name"> {type === 'categories' ? 'Category' : 'Tag'}</small>
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

@connect(state => ({
  windowWidth: state.common.windowWidth
}))
class List extends Component {
  state = {
    list: [],
    page: 1,
    total: 0,
    type: 'categories',
    name: '',
    loading: false
  }

  componentDidMount() {
    const params = this.decodeQuery(this.props)
    this.setState({ type: params.type }, this.fetchList({ page: 1, ...params }))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.name !== nextProps.match.params.name) {
      const params = this.decodeQuery(nextProps)
      this.fetchList({ page: 1, ...params })
    }
  }

  decodeQuery = props => {
    const type = props.location.pathname.includes('categories') ? 'categories' : 'tags'
    const name = props.match.params.name
    return { type, name }
  }

  fetchList = ({ page = 1, name, type }) => {
    this.setState({ loading: true })
    axios
      .get(`/${type}/getArticles`, { params: { page, pageSize: 15, name } })
      .then(res => {
        this.setState({ list: res.rows, total: res.count, loading: false })
      })
      .catch(e => this.setState({ loading: false }))
  }

  handlePageChange = page => {
    const params = this.decodeQuery(this.props)
    this.setState({ page }, this.fetchList({ page, ...params }))
  }

  render() {
    const { list, type, page, total, loading } = this.state
    const { name } = this.props.match.params
    return (
      <div className="content-inner-wrapper list-page">
        <Spin tip="Loading..." spinning={loading}>
          <TimeLineList list={list} name={name} type={type} />
        </Spin>

        {/* {total > 15 && (
          <div className="pagination">
            <Pagination
              pageSize={15}
              current={page}
              onChange={this.onChange}
              total={total}
              simple={this.props.windowWidth < 736}
            />
          </div>
        )} */}

        {list.length < total && (
          <BlogPagination current={parseInt(page) || 1} onChange={this.handlePageChange} total={total} />
        )}
      </div>
    )
  }
}

export default List
