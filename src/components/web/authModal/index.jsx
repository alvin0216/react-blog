import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Icon, message, Button } from 'antd'
import { connect } from 'react-redux'
import { login, register } from '@/redux/user/actions'

@connect(
  null,
  { login, register }
)
class LoginModel extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  }

  state = {
    username: '',
    password: ''
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = () => {
    const type = this.props.type
    type === 'login' ? this.props.login(this.state) : this.props.register(this.state)
    this.props.handleClose(type)
  }

  render() {
    const text = this.props.type === 'login' ? '登录' : '注册'
    return (
      <Modal
        title={text}
        width={320}
        footer={null}
        visible={this.props.visible}
        onCancel={this.props.handleClose}>
        <Input
          style={{ marginBottom: 20 }}
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          name="username"
          placeholder="Username"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <Input
          style={{ marginBottom: 20 }}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          name="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <Button style={{ width: '100%' }} type="primary" onClick={this.handleSubmit}>
          {text}
        </Button>
      </Modal>
    )
  }
}

export default LoginModel
