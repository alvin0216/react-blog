import React from 'react'
import PropTypes from 'prop-types'

// iconfont svg
const SvgIcon = props => {
  return (
    <svg className={`svg-icon ${props.className}`} aria-hidden='true' style={props.style}>
      <use xlinkHref={`#${props.type}`} />
    </svg>
  )
}

SvgIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
}

SvgIcon.defaultProps = {
  className: ''
}

export default SvgIcon
