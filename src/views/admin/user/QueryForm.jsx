import React, { Component } from 'react'
import { Button, Form, Input } from 'antd'
import FormBuilder from '@/components/FormBuilder'

function QueryForm(props) {
  const formMeta = {
    colon: true,
    elements: [
      {
        key: 'username',
        label: '姓名',
        widget: <Input placeholder='请输入姓名' allowClear />
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

  return (
    <div className='query-form'>
      <Form layout='inline' onSubmit={handleSubmit}>
        <FormBuilder meta={formMeta} form={props.form}>
          <Button type='primary' htmlType='submit'>
            检索
          </Button>
        </FormBuilder>
      </Form>
    </div>
  )
}

export default Form.create()(QueryForm)
