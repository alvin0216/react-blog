import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { updateResultModal } from '@/redux/app/actions'

import { Modal, Button, Upload, Icon, message, Result, Typography } from 'antd'
const { Paragraph, Text } = Typography

function List(props) {
  const { title, list, reset } = props
  return (
    list.length > 0 && (
      <>
        <Paragraph>
          <Text strong style={{ fontSize: 16 }}>
            {title}
          </Text>
        </Paragraph>
        <ul className='list'>
          {list.map(item => (
            <li key={item.id}>
              <Icon type='check-circle' style={{ color: '#52c41a' }} />
              <Link to={`/article/${item.id}`} onClick={reset}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  )
}

function ResultModal(props) {
  const { visible, result } = props

  function reset() {
    props.updateResultModal({ visible: false, result: null })
  }

  const insertList = result ? result.insertList : []
  const updateList = result ? result.updateList : []
  return (
    <Modal visible={visible} footer={null} closable={false} className='result-modal' maskClosable onCancel={reset}>
      <Result
        status='success'
        title='Successfully'
        subTitle={`insert ${insertList.length} article and update ${updateList.length} article`}
      />
      <List list={insertList} title='成功插入文章列表：' reset={reset} />
      <List list={updateList} title='成功更新文章列表：' reset={reset} />
    </Modal>
  )
}

export default connect(
  state => state.app.resultModal,
  { updateResultModal }
)(withRouter(ResultModal))
