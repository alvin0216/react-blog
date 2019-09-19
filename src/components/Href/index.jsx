import React from 'react'

// a 标签跳转新窗口
function Href({ children, ...rest }) {
  return (
    <a target='_blank' rel='noreferrer noopener' {...rest}>
      {children}
    </a>
  )
}

export default Href
