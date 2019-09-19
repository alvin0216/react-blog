import React, { useState } from 'react'
import { Icon, Dropdown, Menu, Input, message } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

// import config
import { HEADER_BLOG_NAME } from '@/config'
import navList from '../right/navList'

// icon
import SvgIcon from '@/components/SvgIcon'

const HeaderLeft = props => {
  const [keyword, setKeyword] = useState('')

  const menu = (
    <Menu className='header-nav'>
      {navList.map(nav => (
        <Menu.Item key={nav.link}>
          <Link to={nav.link}>
            {nav.icon && <Icon type={nav.icon} style={{ marginRight: 15 }} />}
            <span className='nav-text'>{nav.title}</span>
          </Link>
        </Menu.Item>
      ))}
      <Menu.Item key={'search'}>
        <Icon type='search' />
        <Input
          className='search-input'
          onClick={clickSearch}
          value={keyword}
          onChange={handleChange}
          onPressEnter={onPressEnter}
          onBlur={onSubmit}
        />
      </Menu.Item>
    </Menu>
  )

  function handleChange(e) {
    setKeyword(e.target.value)
  }

  function onPressEnter(e) {}

  function onSubmit() {
    props.history.push(`/?page=1&keyword=${keyword}`)
    setKeyword('')
  }

  function clickSearch(e) {
    e.stopPropagation()
  }

  return (
    <div className='header-left'>
      <SvgIcon type='iconblog' style={{ color: '#055796', width: 16, height: 16 }} />
      <span className='blog-name'>{HEADER_BLOG_NAME}</span>
      <Dropdown
        overlayClassName='header-dropdown'
        trigger={['click']}
        overlay={menu}
        getPopupContainer={() => document.querySelector('.app-header .header-left')}>
        <Icon type='menu-o' className='header-dropdown-icon' />
      </Dropdown>
    </div>
  )
}

export default withRouter(HeaderLeft)
