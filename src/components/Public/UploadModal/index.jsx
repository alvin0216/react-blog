import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Upload, Icon, notification, Tag, message, Table } from 'antd'

import { API_BASE_URL } from '@/config'
import { getToken, debounce } from '@/utils'
import axios from '@/utils/axios'

// hooks
import { useListener } from '@/hooks/useBus'
import useBoolean from '@/hooks/useBoolean'

function UploadModal(props) {
  const dispatch = useDispatch() // dispatch hooks
  const authorId = useSelector(state => state.user.userId)
  const timer = useRef(null)

  const confirmLoading = useBoolean(false)
  const { value: visible, setTrue, setFalse } = useBoolean(false)
  const [fileList, setFileList] = useState([])
  const [parsedList, setParsedList] = useState([])

  const columns = [
    {
      dataIndex: 'name',
      title: '文件名'
    },
    {
      dataIndex: 'title',
      title: '标题',
      render: (text, record) => getParsed(record.name).title
    },
    {
      dataIndex: 'exist',
      title: '动作',
      render: (text, record) => {
        if (record.status === 'error') return <Tag color='red'>上传失败</Tag>
        return getParsed(record.name).exist ? <Tag color='gold'>更新</Tag> : <Tag color='green'>插入</Tag>
      }
    },
    {
      dataIndex: 'uid',
      title: '操作',
      render: (uid, record) => {
        return (
          <a className='delete-text'
            onClick={e => {
              const index = fileList.findIndex(file => file.uid === uid)
              fileList.splice(index, 1)
              setFileList([...fileList])
            }}>删除</a>
        )
      }
    }
  ]

  useListener('openUploadModal', () => {
    setFileList([])
    setTrue()
  })

  function getParsed(fileName) {
    return parsedList.find(d => d.fileName === fileName) || {}
  }

  function handleFileChange({ file, fileList }) {
    if (file.status === 'done') {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        const fileNameList = fileList.map(item => item.name)
        axios.post('/article/checkExist', { fileNameList }).then(list => {
          setParsedList(list)
        })
      }, 500)
    }
    setFileList(fileList)
  }

  function handleSubmit(e) {
    const uploadList = fileList.reduce((list, file) => {
      if (file.status === 'done') {
        const result = parsedList.find(d => file.name === d.fileName)
        list.push(result)
      }
      return list
    }, [])
    confirmLoading.setTrue()
    axios.post('/article/upload/confirm', { authorId, uploadList }).then(response => {
      confirmLoading.setFalse()
      setFalse()
      notification.success({
        message: 'upload article success',
        description: `insert ${response.insertList.length} article and update ${response.updateList.length} article`
      })
    }).catch(error => {
      console.log('error: ', error)
      confirmLoading.setFalse()
    })
  }

  return (
    <Modal
      width={760}
      visible={visible}
      title='导入文章'
      onOk={handleSubmit}
      onCancel={setFalse}
      maskClosable={false}
      okButtonProps={{
        loading: confirmLoading.value,
        disabled: fileList.length === 0
      }}
      destroyOnClose>
      <Upload.Dragger
        name='file'
        multiple
        showUploadList={false}
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
      </Upload.Dragger>

      {
        fileList.length > 0 && (
          <Table
            // showHeader={false}
            dataSource={fileList}
            columns={columns}
            rowKey='uid'
            pagination={false}
            size='small'
            style={{ marginTop: 15 }}
          />
        )
      }

    </Modal>
  )
}

export default UploadModal
