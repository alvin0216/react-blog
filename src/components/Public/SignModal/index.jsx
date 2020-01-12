import React, { useState, useEffect } from 'react'
import { Form, Icon, Input, Button, Modal } from 'antd'

import { GITHUB } from '@/config'
import { save, remove } from '@/utils/storage'

// hooks
import { useListener } from '@/hooks/useBus'

const FormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

function FormItem(props) {
  const { children, ...rest } = props
  return <Form.Item {...FormItemLayout} {...rest}>{children}</Form.Item>
}

function SignModal(props) {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('login')
  const { getFieldDecorator } = props.form
  useListener('openSignModal', type => {
    props.form.resetFields()
    setType(type)
    setVisible(true)
  })

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      console.log(values)
      if (type === 'login') {
        // dispatch(login(values))
      } else if (type === 'register') {
        // dispatch(register(values))
      }
    })
  }

  function githubLogin() {
    const { pathname, search } = props.location
    save('prevRouter', `${pathname}${search}`)
    window.location.href = `${GITHUB.url}?client_id=${GITHUB.client_id}`
  }

  // 确认密码
  function compareToFirstPassword(rule, value, callback) {
    const form = props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  return (
    <Modal
      width={460}
      title={type}
      visible={visible}
      onCancel={e => setVisible(false)}
      footer={null}>
      <Form layout='horizontal'>
        {type === 'login' ? (
          <>
            <FormItem label='用户名'>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: 'Username is required' }]
              })(<Input placeholder='请输入用户名' />)}
            </FormItem>
            <FormItem label='密码'>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Password is required' }]
              })(<Input placeholder='请输入密码' type='password' />)}
            </FormItem>
          </>
        )
          : (
            <>
              <FormItem label='用户名'>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Username is required' }]
                })(<Input placeholder='请输入用户名' />)}
              </FormItem>
              <FormItem label='密码'>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Password is required' }]
                })(<Input placeholder='请输入密码' type='password' />)}
              </FormItem>
              <FormItem label='确认密码'>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Password is required' },
                    { validator: compareToFirstPassword }
                  ]
                })(<Input placeholder='确认密码' type='password' />)}
              </FormItem>
              <FormItem label='密码'>
                {getFieldDecorator('email', {
                  rules: [
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' }
                  ]
                })(<Input placeholder='请输入您的邮箱' />)}
              </FormItem>
            </>
          )}
      </Form>
      <Button type='primary' block onClick={handleSubmit}>
        {type}
      </Button>
      {GITHUB.enable && (
        <Button block icon='github' onClick={githubLogin} style={{ marginTop: 10 }}>
          github login
        </Button>
      )}
    </Modal>
  )
}

export default Form.create()(SignModal)
