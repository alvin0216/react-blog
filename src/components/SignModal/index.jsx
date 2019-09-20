import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { GITHUB } from '@/config'
// methods
import { switchSignModal } from '@/redux/app/actions'
import { login, register } from '@/redux/user/actions'
import { save, remove } from '@/utils/storage'

// components
import FormBuilder from '@/components/FormBuilder'
import { Modal, Input, Icon, message, Button, Form, Alert, Checkbox } from 'antd'

function SignModal(props) {
  const { type, visible } = props

  useEffect(() => {
    // console.log(props.visible, 'componentDidMount and componentDidUpdate')
    props.visible && props.form.resetFields()
    /*eslint react-hooks/exhaustive-deps: "off"*/
  }, [props.visible])

  // 确认密码
  function compareToFirstPassword(rule, value, callback) {
    const form = props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  // 生成表单
  const getMeta = type => {
    let elements = []
    if (type === 'login') {
      elements = [
        {
          key: 'account',
          label: '用户名',
          widget: <Input placeholder='请输入用户名' />,
          rules: [{ required: true, message: 'Username is required' }]
          // label: '邮箱/用户名',
          // widget: <Input placeholder='请输入邮箱/用户名' />,
          // rules: [{ required: true, message: 'Email/Username is required' }]
        },
        {
          key: 'password',
          label: '密码',
          widget: <Input placeholder='请输入密码' type='password' />,
          rules: [{ required: true, message: 'Password is required' }]
        }
      ]
    } else if (type === 'register') {
      elements = [
        {
          key: 'username',
          label: '用户名',
          widget: <Input placeholder='请输入用户名' />,
          rules: [{ required: true, message: 'Username is required' }]
        },
        {
          key: 'password',
          label: '密码',
          widget: <Input placeholder='请输入密码' type='password' />,
          rules: [{ required: true, message: 'Password is required' }]
        },
        {
          key: 'confirm',
          label: '确认密码',
          widget: <Input placeholder='确认密码' type='password' />,
          rules: [{ required: true, message: 'Please confirm your password!' }, { validator: compareToFirstPassword }]
        },
        {
          key: 'email',
          label: '邮箱',
          widget: <Input placeholder='请输入您的邮箱' />,
          rules: [
            { type: 'email', message: 'The input is not valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' }
          ]
        }
      ]
    }

    const meta = {
      formItemLayout: {
        colon: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      elements
    }

    return meta
  }

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      if (type === 'login') {
        props.login(values)
      } else if (type === 'register') {
        props.register(values)
      }
    })
  }

  function githubLogin() {
    const { pathname, search } = props.location
    save('prevRouter', `${pathname}${search}`)
    window.location.href = `${GITHUB.url}?client_id=${GITHUB.client_id}`
  }

  return (
    <Modal width={460} title={type} visible={visible} onCancel={e => props.switchSignModal(type, false)} footer={null}>
      <Form layout='horizontal'>
        <FormBuilder meta={getMeta(type)} form={props.form} />
        <Button type='primary' block htmlType='submit' onClick={handleSubmit}>
          {type}
        </Button>
        {GITHUB.enable && (
          <Button block htmlType='submit' icon='github' onClick={githubLogin} style={{ marginTop: 10 }}>
            github login
          </Button>
        )}
      </Form>
    </Modal>
  )
}

export default connect(
  state => state.app.signModal,
  { login, register, switchSignModal }
)(Form.create()(withRouter(SignModal)))
