import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// hooks
import useMount from '@/hooks/useMount'

// actions
import { getTagList, getCategoryList } from '@/redux/article/actions'

// components
import SignModal from '@/components/Public/SignModal'
import UploadModal from '@/components/Public/UploadModal'
import { Modal } from 'antd'
import useModal from 'hooks/useModal'

/**
 * @component Public 公共组件，挂在在 APP.jsx 中，用于存放初始化的组件/方法 或者公用的 modal 等
 */
function PublicComponent(props) {
  const dispatch = useDispatch() // dispatch hooks
  const { modalProps } = useModal()

  useMount(() => {
    dispatch(getTagList())
    dispatch(getCategoryList())
  })

  return (
    <>
      <SignModal />
      <UploadModal />
      <Modal {...modalProps} title='公告'>
        <h4>本博客已不再维护！，该项目已升级为 ssr 版本，项目地址为{' '}
          <a href='https://github.com/alvin0216/remix-ssr-blog/' target='_blank'>remix-ssr-blogs</a>，
          访问地址 <a href='https://remix.alvin.run/' target='_blank'>remix.alvin.run</a>。
          多谢关注与支持！
        </h4>
      </Modal>
    </>
  )
}

export default PublicComponent
