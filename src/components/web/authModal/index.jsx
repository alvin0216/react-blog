import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { connect } from 'react-redux'

import { Modal, Input, Icon, message, Button, Form } from 'antd'
import { login, register } from '@/redux/user/actions'
import { closeAuthModal, openAuthModal } from '@/redux/common/actions'
import FormBuilder from '@/components/helper/FormBuilder'

@connect(
  state => ({
    authModalVisible: state.common.authModalVisible,
    authModalType: state.common.authModalType,
    userInfo: state.user
  }),
  { login, register, closeAuthModal, openAuthModal }
)
class AuthModal extends Component {
  state = {
    type: 'login',
    formMeta: { elements: [] }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authModalType !== this.props.authModalType) {
      nextProps.form.resetFields()
      const formMeta = this.getFormMeta(nextProps.authModalType)
      this.setState({ formMeta, type: nextProps.authModalType })
    }
    // if (this.props.authModalVisible !== nextProps.authModalVisible && nextProps.authModalVisible) {
    //   // nextProps.form.resetFields()
    //   const formMeta = this.getFormMeta(nextProps.authModalType)
    //   this.setState({ formMeta, type: nextProps.authModalType })
    // }
  }

  /**
   * 获取表单项
   *
   * @param {String} authModalType - 模型类型
   * @memberof AuthModal
   */
  getFormMeta = authModalType => {
    const { userInfo } = this.props
    const elementsMap = {
      login: ['account', 'password'],
      register: ['username', 'password', 'confirm', 'email'],
      updateUser: ['username', 'originPassword', 'password', 'confirm', 'email']
    }
    const elements = [
      {
        key: 'account',
        label: '邮箱/用户名',
        widget: <Input placeholder="请输入邮箱/用户名" />,
        rules: [{ required: true, message: 'Email/Username is required' }]
      },
      {
        key: 'username',
        label: '用户名',
        initialValue: userInfo.username,
        widget: <Input placeholder="请输入用户名" />,
        rules: [{ required: true, message: 'Username is required' }]
      },
      {
        key: 'originPassword',
        label: '原密码',
        widget: <Input placeholder="请输入原密码" />,
        rules: [{ required: true, message: 'Password is required' }]
      },
      {
        key: 'password',
        label: authModalType === 'updateUser' ? '新密码' : '密码',
        widget: <Input placeholder={authModalType === 'updateUser' ? '请输入新密码' : '请输入密码'} type="password" />,
        rules: [{ required: true, message: 'Password is required' }]
      },
      {
        key: 'confirm',
        label: '确认密码',
        widget: <Input placeholder="确认密码" type="password" />,
        rules: [
          { required: true, message: 'Please confirm your password!' },
          { validator: this.compareToFirstPassword }
        ]
      },
      {
        key: 'email',
        label: '邮箱',
        initialValue: userInfo.email,
        widget: <Input placeholder="请输入邮箱以获得评论回复通知" />,
        rules: [
          { type: 'email', message: 'The input is not valid E-mail!' },
          { required: true, message: 'Please input your E-mail!' }
        ]
      }
    ]

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
      elements: elements.filter(item => elementsMap[authModalType] && elementsMap[authModalType].includes(item.key))
    }

    return meta
  }

  /**
   * 确认密码的验证
   *
   * @memberof AuthModal
   */
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      const { authModalType } = this.props
      this.props[authModalType](values).then(res => {
        if (res.code === 200) this.props.closeAuthModal()
      })
    })
  }

  handleClose = () => this.props.closeAuthModal(this.state.type)

  resetAccount = () => {
    this.setState({ type: 'updateUser' })
    this.props.openAuthModal({ type: 'updateUser' })
  }

  render() {
    const { type, formMeta } = this.state
    const { authModalVisible, authModalType } = this.props

    const titleMap = {
      login: '登录',
      register: '注册',
      updateUser: '修改个人信息'
    }
    return (
      <Modal title={titleMap[type]} width={460} footer={null} onCancel={this.handleClose} visible={authModalVisible}>
        <Form layout="horizontal">
          <FormBuilder meta={formMeta} form={this.props.form} />
          {type && (
            <div className="tips-wrap">
              <span className="tips">忘记密码请联系博主 gershonv@163.com</span>
              <span className="reset-account" onClick={this.resetAccount}>
                重置账户
              </span>
            </div>
          )}

          <Button type="primary" block htmlType="submit" onClick={this.handleSubmit}>
            {titleMap[type]}
          </Button>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AuthModal)
