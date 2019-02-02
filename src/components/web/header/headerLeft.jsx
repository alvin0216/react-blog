import React from 'react'
import { Icon, Dropdown } from 'antd'

import DropdownMenu from './nav'

const HeaderLeft = ({ navList }) => {
  return (
    <div className="header-left">
      <i className="iconfont icon-airplane" style={{ color: '#055796' }} />
      <span className="blog-name">郭大大的博客</span>
      <Dropdown overlayClassName="header-dropdown" trigger={['click']} overlay={<DropdownMenu navList={navList} />}>
        <Icon type="menu-o" className="nav-phone-icon" />
      </Dropdown>
    </div>
  )
}

export default HeaderLeft
