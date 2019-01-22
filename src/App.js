import React, { Component } from 'react'
import '@/App.less'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { addCount } from '@/redux/demo/actions'

const mapStateToProps = state => ({
  count: state.demo.count
})

@connect(
  mapStateToProps,
  { addCount }
)
class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.count}
        <Button type="primary" onClick={this.props.addCount}>
          Click
        </Button>
      </div>
    )
  }
}

export default App
