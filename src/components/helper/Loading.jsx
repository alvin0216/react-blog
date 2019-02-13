import React from 'react'
import ReactDOM from 'react-dom'
import { Spin, Icon } from 'antd'
import loadingPic from '@/assets/loading.gif'

const loadingRoot = document.getElementById('component-loading')
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

const SpinStyle = {
  position: 'absolute',
  right: '20px',
  top: '20px'
}

// Spin loading
export const SpinLoading = () => {
  return ReactDOM.createPortal(<Spin indicator={antIcon} style={SpinStyle} />, loadingRoot)
}

const picStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, 20%)'
}

// 图片 loading
const Loading = () => <img src={loadingPic} alt="" style={picStyle} />

export default Loading
