import React, { Component } from 'react'
import './index.less'
import axios from '@/lib/axios'

import { Link } from 'react-router-dom'
import { Timeline, Pagination } from 'antd'

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

class List extends Component {
  state = { list: [], page: 1, total: 0, type: 'categories', name: '' }

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
    axios.get(`/${type}/getArticles`, { params: { page, pageSize: 15, name } }).then(res => {
      this.setState({ list: res.rows, total: res.count })
    })
  }

  onChange = page => {
    const { name } = this.props.match.params
    this.setState({ page }, this.fetchList({ page, name }))
  }

  render() {
    const { list, type, page, total } = this.state
    const { name } = this.props.match.params
    return (
      <div className="content-inner-wrapper list-page">
        <TimeLineList list={list} name={name} type={type} />

        {total > 15 && (
          <div style={{ textAlign: 'right' }}>
            <Pagination pageSize={15} current={page} onChange={this.onChange} total={total} />
          </div>
        )}
      </div>
    )
  }
}

export default List
