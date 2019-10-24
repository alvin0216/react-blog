import React, { Component, useState, useEffect } from 'react'
import { Table, Divider, Tag, Modal, message, Switch, Button, Popconfirm, Icon } from 'antd'

import axios from '@/utils/axios'
import moment from 'moment'
import QueryForm from './QueryForm'
import AppPagination from '@/components/Pagination'

function AdminUser(props) {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [query, setQuery] = useState({})
  const [switchId, setSwitchId] = useState(0)

  useEffect(() => {
    fetchList()
  }, [query])

  function fetchList() {
    setLoading(true)
    const params = { ...query, ...pagination }
    if (params.current) {
      params.page = params.current
      delete params.current
    }
    axios
      .get('/user/list', { params })
      .then(res => {
        setList(res.rows)
        setPagination({ ...pagination, total: res.count })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function onQuery(values) {
    setQuery(values)
  }

  function onDelete(userId) {
    axios.delete(`/user/${userId}`).then(res => {
      fetchList()
    })
  }

  function handlePageChange(page) {
    pagination.current = page
    setPagination(pagination)
    fetchList()
  }

  function switchNotice(checked, userId) {
    setSwitchId(userId)
    axios
      .put(`/user/${userId}`, {
        notice: checked
      })
      .then(res => {
        const target = list.find(l => l.id === userId)
        target.notice = checked
        setList(list)
        setSwitchId(0)
      })
      .catch(res => {
        setSwitchId(0)
      })
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '邮件通知',
      dataIndex: 'notice',
      render: (text, record) => (
        <Switch
          defaultChecked={text}
          onChange={checked => switchNotice(checked, record.id)}
          loading={switchId === record.id}
        />
      )
    },
    {
      title: '用户类型',
      dataIndex: 'type',
      render: (text, record) => {
        return record.github ? <Tag color='#1890ff'>github 用户</Tag> : <Tag color='magenta'>站内用户</Tag>
      }
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1)
    },
    {
      title: '操作',
      render: (text, record) => (
        <Popconfirm
          title='Are you sure？'
          icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
          onConfirm={e => onDelete(record.id)}>
          <span className='delete-text'>Delete</span>
        </Popconfirm>
      )
    }
  ]
  return (
    <>
      <QueryForm onQuery={onQuery} />
      <Table rowKey='id' bordered loading={loading} columns={columns} dataSource={list} pagination={false} />
      <AppPagination {...pagination} onChange={handlePageChange} />
    </>
  )
}

export default AdminUser
