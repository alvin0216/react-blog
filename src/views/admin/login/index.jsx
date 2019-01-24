import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import { login } from '@/redux/demo/actions'

@withRouter
@connect(
  null,
  { login }
)
class Login extends Component {
  login = async () => {
    await this.props.login()
    message.success('success login')
    this.props.history.push('/examples')
  }
  render() {
    return (
      <div>
        Click button to login
        <Button onClick={this.login}>login</Button>
      </div>
    )
  }
}

export default Login
