import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Upload, Icon, Checkbox, Typography } from 'antd'

import { API_BASE_URL } from '@/config'

// methods
import { switchUploadModal, updateResultModal } from '@/redux/app/actions'
import axios from '@/utils/axios'
import { getToken } from '@/utils'

const { Dragger } = Upload
const { confirm } = Modal
const { Paragraph, Text } = Typography

function UploadModal(props) {
  const { visible, switchUploadModal } = props
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  // comfirm modal
  const [existList, setExisList] = useState([])
  const [noExistList, setNoExisList] = useState([])
  const [insertSelectedList, setInsertSelectedList] = useState([]) // [fileName]
  const [updateSelectedList, setUpdateSelectedList] = useState([])
  const [confirmVisible, setConfirmVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      // reset
      setInsertSelectedList([])
      setUpdateSelectedList([])
    }
  }, [visible])

  function handleFileChange({ file, fileList, event }) {
    const { status } = file
    if (status !== 'uploading') {
      // console.log(file, fileList)
    }
    setFileList(fileList)
  }

  // comfirm selected...
  function handleSelect(e, item, mode = 'insert') {
    const checked = e.target.checked
    const targetList = mode === 'insert' ? insertSelectedList : updateSelectedList
    const list = checked ? [...targetList, item] : targetList.filter(d => d.fileName !== item.fileName)
    mode === 'insert' ? setInsertSelectedList(list) : setUpdateSelectedList(list)
  }

  // 点击 确认
  function handleOk(e) {
    const fileNameList = fileList.map(d => d.name)

    axios.post('/article/checkExist', { fileNameList }).then(response => {
      const { existList, noExistList } = response

      if (existList.length === 0) {
        // 没有存在同名的文章 直接插入
        handleConfirm(noExistList)
      } else {
        setExisList(existList)
        setNoExisList(noExistList)
        // 默认全部勾选
        setInsertSelectedList(noExistList)
        setUpdateSelectedList(existList)
        // open comfirm modal
        setConfirmVisible(true)
      }
    })
  }

  function handleConfirm(insertList) {
    setLoading(true)
    axios
      .post('/article/upload/confirm', {
        authorId: props.authorId,
        insertList: Array.isArray(insertList) ? insertList : insertSelectedList,
        updateList: updateSelectedList
      })
      .then(result => {
        setLoading(false)
        setConfirmVisible(false)
        switchUploadModal(false)
        props.updateResultModal({ visible: true, result })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }
  return (
    <>
      <Modal
        className='upload-modal'
        visible={visible}
        title='导入文章'
        onOk={handleOk}
        onCancel={e => switchUploadModal(false)}
        // keyboard={false}
        maskClosable={false}
        destroyOnClose
        okButtonProps={{
          disabled: fileList.length === 0,
          loading
        }}>
        <Dragger
          name='file'
          multiple
          action={`${API_BASE_URL}/article/upload`}
          onChange={handleFileChange}
          headers={{ Authorization: getToken() }}
          accept='text/markdown'>
          <p className='ant-upload-drag-icon'>
            <Icon type='inbox' />
          </p>
          <p className='ant-upload-text'>Click or drag file to this area to upload</p>
          <p className='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
          </p>
        </Dragger>
      </Modal>

      {/* confirm modal */}
      <Modal
        className='confirm-modal'
        visible={confirmVisible}
        title={
          <>
            <Icon type='question-circle' style={{ color: '#faad14', marginRight: 16 }} />
            confirm your changes
          </>
        }
        onOk={handleConfirm}
        onCancel={e => {
          setConfirmVisible(false)
          setLoading(false)
        }}
        okButtonProps={{
          disabled: insertSelectedList.length === 0 && updateSelectedList.length === 0
        }}>
        <>
          {noExistList.length > 0 && (
            <>
              <Paragraph>
                <Text strong style={{ fontSize: 16 }}>
                  插入文章：
                </Text>
              </Paragraph>
              <ul>
                {noExistList.map((item, index) => (
                  <li key={index}>
                    <Checkbox
                      checked={!!insertSelectedList.find(d => item.fileName === d.fileName)}
                      onChange={e => handleSelect(e, item, 'insert')}>
                      {item.title || item.fileName}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </>
          )}
          {existList.length > 0 && (
            <>
              <Paragraph>
                <Text strong style={{ fontSize: 16 }}>
                  更新文章：
                </Text>
              </Paragraph>
              <ul>
                {existList.map((item, index) => (
                  <li key={index}>
                    <Checkbox
                      checked={!!updateSelectedList.find(d => item.title === d.title)}
                      onChange={e => handleSelect(e, item, 'update')}>
                      {item.title}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      </Modal>
    </>
  )
}

export default connect(
  state => ({
    ...state.app.uploadModal,
    authorId: state.user.userId
  }),
  { switchUploadModal, updateResultModal }
)(UploadModal)
