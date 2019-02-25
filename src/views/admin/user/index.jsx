import React, { Component } from 'react'
import axios from '@/lib/axios'
import { getCommentsCount } from '@/lib'
import { Table, Button, Modal, message } from 'antd'

class UserManage extends Component {
  state = {
    list: [],
    pagination: {}
  }

  componentDidMount() {
    this.fetchList({ page: 1 })
  }

  getColumns = () => {
    return [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '评论数',
        dataIndex: 'comments',
        render: text => getCommentsCount(text),
        sorter: (a, b) => getCommentsCount(a.comments) - getCommentsCount(b.comments)
      },
      {
        title: '操作',
        render: (text, record) => <Button type="danger" onClick={() => this.handleDelete(record.id, record.username)}>删除</Button>
      }
    ]
  }

  fetchList = ({ current = 1, pageSize = 10 }) => {
    axios.get('/user/getUserList', { params: { page: current, pageSize } }).then(res => {
      const pagination = {
        current,
        pageSize,
        total: res.count
      }
      this.setState({ list: res.rows, pagination })
    })
  }

  handleDelete = (userId, username) => {
    Modal.confirm({
      title: '您确认删除该用户?，此操作不可恢复！',
      content: `用户： ${username} `,
      onOk: () => {
        axios.delete('/user/delete', { params: { userId } }).then(res => {
          if (res.code === 200) {
            this.fetchList(this.state.pagination)
            message.success(res.message)
          }
        })
      }
    })
  }

  handleChange = pagination => {
    console.log(pagination)
    this.fetchList({ ...pagination, ...this.state.query })
  }

  render() {
    const { list, pagination } = this.state
    return (
      <Table
        rowKey="id"
        bordered
        columns={this.getColumns()}
        dataSource={list}
        pagination={pagination}
        onChange={this.handleChange}
      />
    )
  }
}

export default UserManage
