import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { connect } from 'react-redux'

import { Modal, Input, Icon, message, Button, Form, Alert, Checkbox } from 'antd'
import { login, register, updateUser } from '@/redux/user/actions'
import { closeAuthModal, openAuthModal } from '@/redux/common/actions'
import FormBuilder from '@/components/helper/FormBuilder'

const CheckboxGroup = Checkbox.Group

const options = [{ label: '用户名', value: 'changeUsername' }, { label: '密码', value: 'changePassword' }]

@connect(
  state => ({
    authModalVisible: state.common.authModalVisible,
    authModalType: state.common.authModalType,
    userInfo: state.user
  }),
  { login, register, updateUser, closeAuthModal, openAuthModal }
)
class AuthModal extends Component {
  state = {
    type: 'login',
    formMeta: { elements: [] },
    checkboxList: ['changeUsername']
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authModalType !== this.props.authModalType && nextProps.authModalVisible) {
      nextProps.form.resetFields()
      const formMeta = this.getFormMeta(nextProps.authModalType)
      this.setState({ formMeta, type: nextProps.authModalType })
    }
  }

  /**
   * 获取表单项
   *
   * @param {String} authModalType - 模型类型
   * @param {Array} fieldList - 展示的表单类型
   * @memberof AuthModal
   */
  getFormMeta = authModalType => {
    const { userInfo } = this.props
    const { checkboxList } = this.state
    const elementsMap = {
      login: ['account', 'password'],
      register: ['username', 'password', 'confirm', 'email']
    }

    if (authModalType === 'updateUser') {
      if (!userInfo.email) {
        elementsMap.updateUser = ['email']
      } else {
        const fieldMap = {
          changeUsername: ['username', 'oldPassword', 'email'],
          changePassword: ['oldPassword', 'password', 'confirm', 'email']
        }
        let metaList = []
        checkboxList.forEach(field => {
          fieldMap[field].forEach(item => !metaList.includes(item) && metaList.push(item))
        })
        elementsMap.updateUser = metaList
      }
    }

    const elements = [
      {
        key: 'email',
        label: '邮箱',
        initialValue: userInfo.email,
        widget: <Input placeholder="请输入您的邮箱" disabled={!!userInfo.email} />,
        rules: [
          { type: 'email', message: 'The input is not valid E-mail!' },
          { required: true, message: 'Please input your E-mail!' }
        ]
      },
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
        key: 'oldPassword',
        label: checkboxList.includes('changePassword') ? '原密码' : '密码',
        widget: (
          <Input
            placeholder={checkboxList.includes('changePassword') ? '请输入原密码' : '请输入密码'}
            type="password"
          />
        ),
        rules: [{ required: true, message: 'Password is required' }]
      },
      {
        key: 'password',
        label: '密码',
        widget: <Input placeholder="请输入密码" type="password" />,
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
      const { authModalType, userInfo } = this.props
      if (authModalType === 'updateUser') values.userId = userInfo.userId

      this.props[authModalType](values).then(res => {
        if (res.code === 200) this.props.closeAuthModal()
      })
    })
  }

  handleClose = () => this.props.closeAuthModal(this.state.type)

  checkboxChange = values => {
    if (values.length === 0) return message.warning('至少选择一项！')
    this.setState({ checkboxList: values }, () => {
      const formMeta = this.getFormMeta(this.props.authModalType)
      this.setState({ formMeta })
    })
  }

  render() {
    const { type, formMeta, checkboxList } = this.state
    const { authModalVisible, userInfo, authModalType } = this.props

    const titleMap = {
      login: '登录',
      register: '注册',
      updateUser: userInfo.email ? '修改账户信息' : '绑定邮箱'
    }

    return (
      <Modal title={titleMap[type]} width={460} footer={null} onCancel={this.handleClose} visible={authModalVisible}>
        {authModalType !== 'updateUser' ? null : !userInfo.email ? (
          <React.Fragment>
            <Alert
              message="您未绑定邮箱！绑定邮箱后才能进行个人信息的修改！邮箱一旦被绑定将不可修改！！"
              type="warning"
              showIcon
              banner
            />
            <br />
          </React.Fragment>
        ) : (
          <div className="select-changes">
            <span className="text">选择您要修改的个人信息：</span>
            <CheckboxGroup options={options} value={checkboxList} onChange={this.checkboxChange} />
          </div>
        )}

        <Form layout="horizontal">
          <FormBuilder meta={formMeta} form={this.props.form} />

          <div className="tips-wrap">
            <span className="tips">忘记密码请联系博主 gershonv@163.com</span>
          </div>

          <Button type="primary" block htmlType="submit" onClick={this.handleSubmit}>
            {titleMap[type]}
          </Button>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AuthModal)
