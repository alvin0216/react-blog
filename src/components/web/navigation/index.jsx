import React, { Component } from 'react'
import './index.less'
import { Anchor } from 'antd'

const { Link } = Anchor

class Navigation extends Component {
  render() {
    return (
      <div className="toc-affix">
        <Anchor affix={false} onClick={this.handleClick}>
          <Link href="#components-anchor-demo-basic" title="Basic demo" />
          <Link href="#components-anchor-demo-static" title="Static demo" />
          <Link href="#API" title="API">
            <Link href="#Anchor-Props" title="Anchor Props" />
            <Link href="#Link-Props" title="Link Props" />
          </Link>
        </Anchor>
      </div>
    )
  }
}

export default Navigation
