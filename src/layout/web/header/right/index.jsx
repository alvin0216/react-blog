import React, { Component } from 'react'
import Search from './Search'
import Navbar from './Navbar'
import UserInfo from './UserInfo'
class HeaderRight extends Component {
  render() {
    return (
      <div className='header-right'>
        <Search />
        <UserInfo />
        <Navbar />
      </div>
    )
  }
}

export default HeaderRight
