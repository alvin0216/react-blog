import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Pagination } from 'antd'

function WebPagination({ total, current, onChange, pageSize, style = {} }) {
  const windowWidth = useSelector(state => state.app.windowWidth) // 相当于 connect(state => state.app.windowWidth)(WebPagination)

  return (
    <div className='app-pagination' style={style}>
      <Pagination
        hideOnSinglePage
        current={current}
        onChange={onChange}
        total={total}
        pageSize={pageSize}
        simple={windowWidth < 736}
      />
    </div>
  )
}

WebPagination.propTypes = {
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  pageSize: PropTypes.number
}

WebPagination.defaultProps = {
  pageSize: 10
}

export default WebPagination
