import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AdminLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className="web-Admin">
        <div className="web-page-container">{this.props.children}</div>
      </div>
    )
  }
}

export default AdminLayout