import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import { logout } from '@/redux/demo/actions'

@withRouter
@connect(
  null,
  { logout }
)
class AuthPage extends Component {
  logout = async () => {
    await this.props.logout()
    message.success('login out')
  }

  render() {
    return (
      <div>
        <h1>Protected Page</h1>
        <Button onClick={this.logout}>logout</Button>
      </div>
    )
  }
}

export default AuthPage
