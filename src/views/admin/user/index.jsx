import React, { useState } from 'react'
import { Table, Input, Tag, Form, Switch, Button, Popconfirm, Select } from 'antd'

import axios from '@/utils/axios'
import moment from 'moment'

import useAntdTable from '@/hooks/useAntdTable'
import useBreadcrumb from '@/hooks/useBreadcrumb'

const typeMapList = [
  { value: 1, label: 'github 用户' },
  { value: 2, label: '站内用户' }
]

function AdminUser(props) {
  useBreadcrumb(['用户管理'])
  const { getFieldDecorator } = props.form
  const [queryParams, setQueryParams] = useState({})
  const { tableProps, updateList, onSearch } = useAntdTable({
    requestUrl: '/user/list',
    queryParams,
    columns: [
      { title: '用户名', dataIndex: 'username' },
      { title: '邮箱', dataIndex: 'email' },
      {
        title: '邮件通知',
        dataIndex: 'notice',
        render: (text, record) => (
          <Switch
            defaultChecked={text}
            onChange={checked => updateList(() => axios.put(`/user/${record.id}`, { notice: checked }))}
          />
        )
      },
      {
        title: '禁言',
        dataIndex: 'disabledDiscuss',
        render: (text, record) => (
          <Switch
            defaultChecked={text}
            onChange={checked => updateList(() => axios.put(`/user/${record.id}`, { disabledDiscuss: checked }))}
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
        dataIndex: 'id',
        title: '操作',
        render: (userId, record) => (
          <Popconfirm
            title='Are you sure？'
            onConfirm={e => updateList(() => axios.delete(`/user/${userId}`))}>
            <a className='delete-text'>Delete</a>
          </Popconfirm>
        )
      }
    ]
  })

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        setQueryParams({ ...queryParams, ...values })
        onSearch({ ...queryParams, ...values })
      }
    })
  }

  return (
    <>
      {/* 检索 */}
      <Form layout='inline' onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <Form.Item label='姓名'>
          {getFieldDecorator('username')(
            <Input placeholder='请输入姓名' allowClear />
          )}
        </Form.Item>

        <Form.Item label='用户类型'>
          {getFieldDecorator('type')(
            <Select style={{ width: 200 }} allowClear>
              {typeMapList.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ marginRight: 8 }}>检索</Button>

        </Form.Item>
      </Form>

      <Table {...tableProps} />
    </>
  )
}

export default Form.create()(AdminUser)
