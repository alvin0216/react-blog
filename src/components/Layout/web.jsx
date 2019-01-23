import React, { Component } from 'react'
import PropTypes from 'prop-types'

class WebLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className="web-Weblayout">
        <div className="web-page-container">{this.props.children}</div>
      </div>
    )
  }
}

export default WebLayout
