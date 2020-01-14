import React, { Component, useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Table, Form, Tag, Modal, message, Input, Button, Popconfirm, Select } from 'antd'

import axios from '@/utils/axios'

import { Link } from 'react-router-dom'
import moment from 'moment'
import download from '@/utils/download'

import useAntdTable from '@/hooks/useAntdTable'

import useBreadcrumb from '@/hooks/useBreadcrumb'

function ArticleManager(props) {
  const { tagList, categoryList } = useSelector(state => ({
    tagList: state.article.tagList,
    categoryList: state.article.categoryList
  }))
  const { getFieldDecorator } = props.form
  const [queryParams, setQueryParams] = useState({})

  const { tableProps, updateList, onSearch } = useAntdTable({
    requestUrl: '/article/list',
    queryParams,
    columns: [
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
        dataIndex: 'id',
        title: '操作',
        render: (articleId, record) => {
          return (
            <ul className='action-list'>
              <li>
                <Link to={`/article/${articleId}`}>查看</Link>
              </li>
              <li>
                <Link to={{ pathname: `/admin/article/edit/${record.id}`, state: { articleId } }}>编辑</Link>
              </li>
              <li>
                <a onClick={e => output(record.id, record.title)}>导出</a>
              </li>
              <li>
                <Popconfirm title='Are you sure？' cancelText='No' onConfirm={e => updateList(() => axios.delete(`/article/${articleId}`))}>
                  <a className='delete-text'>删除</a>
                </Popconfirm>
              </li>
            </ul>
          )
        }
      }
    ]
  })

  function renderColor(name, list) {
    const target = list.find(l => l.name === name)
    return target && target.color
  }

  function output(articleId) {
    download(`/article/output/${articleId}`)
  }

  function outputAll() {
    download('/article/output/all')
  }

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        setQueryParams({ ...queryParams, ...values })
        onSearch({ ...queryParams, ...values })
      }
    })
  }

  useBreadcrumb(['文章管理'])

  return (
    <div className='admin-article-manager'>
      {/* 检索 */}
      <Form layout='inline' onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <Form.Item label='关键词'>
          {getFieldDecorator('keyword')(
            <Input placeholder='请输入文章关键词' allowClear />
          )}
        </Form.Item>
        <Form.Item label='标签'>
          {getFieldDecorator('tag')(
            <Select style={{ width: 200 }} allowClear>
              {tagList.map(item => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label='分类'>
          {getFieldDecorator('category')(
            <Select style={{ width: 200 }} allowClear>
              {categoryList.map(item => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ marginRight: 8 }}>检索</Button>
          <Button type='primary' onClick={outputAll} key={2}>
            一键导出
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} />
    </div>
  )
}

export default Form.create()(ArticleManager)
