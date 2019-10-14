import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Select, DatePicker, Checkbox, Radio } from 'antd'
import FormBuilder from '@/components/FormBuilder'
import download from '@/utils/download'

const Option = Select.Option

function QueryForm(props) {
  const { tagList, categoryList } = props

  const formMeta = {
    colon: true,
    elements: [
      {
        key: 'keyword',
        label: '关键字',
        widget: <Input placeholder='请输入文章关键字' allowClear />
      },
      {
        key: 'tag',
        label: '标签',
        widget: (
          <Select className='form-select' allowClear>
            {tagList.map(item => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        )
      },
      {
        key: 'category',
        label: '分类',
        widget: (
          <Select className='form-select' allowClear>
            {categoryList.map(item => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        )
      }
    ]
  }

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      const params = {}
      Object.keys(values).forEach(key => {
        if (values[key]) {
          params[key] = values[key]
        }
      })
      props.onQuery(params)
    })
  }

  function outputAll() {
    download('/article/output/all')
  }

  return (
    <div className='query-form'>
      <Form layout='inline' onSubmit={handleSubmit}>
        <FormBuilder meta={formMeta} form={props.form}>
          {/* <div style={{ width: 300, display: 'flex', justifyContent: 'space-between' }}>
            <Button type='primary' htmlType='submit'>
              检索
            </Button>
            <Button type='primary' onClick={outputAll}>
              一键导出
            </Button>
          </div> */}

          {[
            <Button type='primary' htmlType='submit' key={1}>
              检索
            </Button>,
            <Button type='primary' onClick={outputAll} key={2}>
              一键导出
            </Button>
          ]}
        </FormBuilder>
      </Form>
    </div>
  )
}

export default Form.create()(QueryForm)
