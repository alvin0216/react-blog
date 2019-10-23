import React, { Component, useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Table, Divider, Tag, Modal, message, Badge, Button, Popconfirm, Icon } from 'antd'

import axios from '@/utils/axios'

import { Link } from 'react-router-dom'
import moment from 'moment'
import QueryForm from './QueryForm'
import AppPagination from '@/components/Pagination'
import download from '@/utils/download'

function ArticleManager(props) {
  const { tagList, categoryList } = useSelector(state => ({
    tagList: state.article.tagList,
    categoryList: state.article.categoryList
  }))

  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [query, setQuery] = useState({})

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
      .get('/article/list', { params })
      .then(res => {
        setList(res.rows)
        setPagination({ ...pagination, total: res.count })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  function renderColor(name, list) {
    const target = list.find(l => l.name === name)
    return target && target.color
  }

  function onDelete(articleId) {
    axios.delete(`/article/${articleId}`).then(res => {
      fetchList()
    })
  }

  function onQuery(values) {
    setQuery(values)
  }

  function handlePageChange(page) {
    pagination.current = page
    setPagination(pagination)
    fetchList()
  }

  function output(articleId) {
    download(`/article/output/${articleId}`)
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (text, record) => {
        return text.map(d => (
          <Tag color={renderColor(d.name, tagList)} key={d.name}>
            <Link to={`/tags/${d.name}`}>{d.name}</Link>
          </Tag>
        ))
      }
    },
    {
      title: '分类',
      dataIndex: 'categories',
      render: (text, record) => {
        return text.map(d => (
          <Tag color='#2db7f5' key={d.name}>
            <Link to={`/categories/${d.name}`}>{d.name}</Link>
          </Tag>
        ))
      }
    },
    {
      title: '浏览数',
      dataIndex: 'viewCount',
      sorter: (a, b) => b.viewCount - a.viewCount
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1)
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      sorter: (a, b) => (moment(a.updatedAt).isBefore(b.updatedAt) ? 1 : -1)
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div className='action'>
            <Button type='link' size='small'>
              <Link to={`/article/${record.id}`}>查看</Link>
            </Button>

            <Button type='link' size='small'>
              <Link to={{ pathname: `/admin/article/edit/${record.id}`, state: { articleId: record.id } }}>编辑</Link>
            </Button>

            <Button
              type='primary'
              size='small'
              style={{ marginRight: 10 }}
              onClick={e => output(record.id, record.title)}>
              导出
            </Button>

            <Popconfirm
              title='Are you sure？'
              icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
              onConfirm={e => onDelete(record.id)}>
              <Button type='danger' size='small'>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  return (
    <div className='admin-article-manager'>
      <QueryForm tagList={tagList} categoryList={categoryList} onQuery={onQuery} />
      <Table rowKey='id' bordered loading={loading} columns={columns} dataSource={list} pagination={false} />
      <AppPagination {...pagination} onChange={handlePageChange} />
    </div>
  )
}

export default ArticleManager
