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

// 图片 loading
const Loading = () => <img src={loadingPic} alt="" className="loading" />

export default Loading
