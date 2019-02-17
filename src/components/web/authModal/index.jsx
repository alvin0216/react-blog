import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Modal, Input, Icon, message, Button, Form } from 'antd'
import { login, register } from '@/redux/user/actions'
import { closeAuthModal } from '@/redux/common/actions'
import FormBuilder from '@/components/helper/FormBuilder'

const formMeta = {
  elements: [
    {
      key: 'username',
      widget: (
        <Input placeholder="Username" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
      ),
      rules: [{ required: true, message: 'Username is required' }]
    },
    {
      key: 'password',
      widget: (
        <Input placeholder="Password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
      ),
      rules: [{ required: true, message: 'Password is required' }]
    }
  ]
}

@connect(
  state => ({
    loginModalVisible: state.common.loginModalVisible,
    registerModalVisible: state.common.registerModalVisible
  }),
  { login, register, closeAuthModal }
)
class LoginModel extends Component {
  state = { type: 'login' } // 模态框类型

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.loginModalVisible) return { type: 'login' }
    if (nextProps.registerModalVisible) return { type: 'register' }
    return null
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      const { type } = this.state

      this.props[type](values).then(res => {
        if (res.code === 200) this.props.closeAuthModal(type)
      })

      // switch (this.state.type) {
      //   case 'login':
      //     this.props.login(values).then(res => {
      //       if (res.code === 200) this.props.closeAuthModal('login')
      //     })
      //     break

      //   case 'register':
      //     this.props.register(values).then(res => {
      //       if (res.code === 200) this.props.closeAuthModal('register')
      //     })
      //   default:
      //     message.error('未知错误')
      //     break
      // }
    })
  }

  handleClose = () => this.props.closeAuthModal(this.state.type)

  render() {
    const { type } = this.state
    const { loginModalVisible, registerModalVisible } = this.props
    return (
      <Modal
        title={type}
        width={320}
        footer={null}
        onCancel={this.handleClose}
        visible={loginModalVisible || registerModalVisible}>
        <Form layout="horizontal">
          <FormBuilder meta={formMeta} form={this.props.form} />
          <Button type="primary" block htmlType="submit" onClick={this.handleSubmit}>
            {type}
          </Button>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(LoginModel)
