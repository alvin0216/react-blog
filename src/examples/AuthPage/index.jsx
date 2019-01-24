import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import { loginout } from '@/redux/demo/actions'

@withRouter
@connect(
  null,
  { loginout }
)
class AuthPage extends Component {
  loginout = async () => {
    await this.props.loginout()
    message.success('login out')
  }

  render() {
    return (
      <div>
        <h1>Protected Page</h1>
        <Button onClick={this.loginout}>loginout</Button>
      </div>
    )
  }
}

export default AuthPage
