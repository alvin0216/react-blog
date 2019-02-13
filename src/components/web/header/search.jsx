import React, { Component } from 'react'
import { Input, Icon, Row, Col } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter
class SearchButton extends Component {
  state = { keyword: '' }

  handleChange = e => this.setState({ keyword: e.target.value })

  handleSubmit = () => {
    const keyword = this.state.keyword
    if (keyword) this.props.history.push(`/?page=1&keyword=${keyword}`)
  }

  handlePressEnter = e => {
    e.target.blur()
  }

  render() {
    return (
      <Row id="search-box">
        <Col>
          <Icon type="search" className="anticon" />
          <Input
            type="text"
            value={this.state.keyword}
            onChange={this.handleChange}
            onBlur={this.handleSubmit}
            onPressEnter={this.handlePressEnter}
            className="header-search"
            placeholder="搜索文章"
            style={{ width: 200 }}
          />
        </Col>
      </Row>
    )
  }
}

export default SearchButton
