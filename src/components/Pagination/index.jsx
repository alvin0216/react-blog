import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import { useMediaQuery } from 'react-responsive'

function WebPagination({ total, current, onChange, pageSize, style = {} }) {
  const isLessThan736 = useMediaQuery({
    query: '(max-width: 736px)'
  })
  return (
    <div className='app-pagination' style={style}>
      <Pagination
        hideOnSinglePage
        current={current}
        onChange={onChange}
        total={total}
        pageSize={pageSize}
        simple={isLessThan736}
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
