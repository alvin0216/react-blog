import React from 'react'

import { Result, Button } from 'antd'

function PageNotFound(props) {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button
          type='primary'
          onClick={() => {
            props.history.push('/')
          }}>
          Back Home
        </Button>
      }
    />
  )
}

export default PageNotFound
