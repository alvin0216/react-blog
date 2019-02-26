import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Pagination } from 'antd'

@connect(state => ({
  windowWidth: state.common.windowWidth
}))
class BlogPagination extends Component {
  static propTypes = {
    total: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    current: PropTypes.number.isRequired
  }

  render() {
    const { total, current, onChange } = this.props
    return (
      <div className="pagination">
        <Pagination current={current} onChange={onChange} total={total} simple={this.props.windowWidth < 736} />
      </div>
    )
  }
}

export default BlogPagination
