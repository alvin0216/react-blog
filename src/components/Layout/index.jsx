import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className="examples-layout">
        <div className="examples-page-container">{this.props.children}</div>
      </div>
    )
  }
}

export default Layout
