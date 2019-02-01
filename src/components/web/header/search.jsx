import React, { Component } from 'react'
import { Input, Icon, Row, Col } from 'antd'
const Search = Input.Search

class SearchButton extends Component {
  render() {
    return (
      <Row id="search-box">
        <Col>
          <Icon type="search" className="anticon" />
          <Input type="text" className="header-search" placeholder="搜索文章" style={{ width: 200 }} />
        </Col>
      </Row>
    )
  }
}

export default SearchButton
