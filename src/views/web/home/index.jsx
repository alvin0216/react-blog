import React, { Component } from 'react'
import { Button } from 'antd'
import axios from '@/lib/axios'

class Home extends Component {
  test = () => {
    axios.post('/examples/test')
  }

  test2 = () => {
    localStorage.clear()
  }

  render() {
    return (
      <div>
        <Button onClick={this.test}>click</Button>
        <Button onClick={this.test2}>clear local</Button>
      </div>
    )
  }
}

export default Home
