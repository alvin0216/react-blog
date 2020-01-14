import React from 'react'
import Search from './Search'
import Navbar from './Navbar'
import UserInfo from './UserInfo'

function HeaderRight(props) {
  return (
    <div className='header-right'>
      <Search />
      <UserInfo />
      <Navbar />
    </div>
  )
}

export default HeaderRight
