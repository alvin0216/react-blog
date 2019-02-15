import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Input, Tooltip, Icon, Tag } from 'antd'

class SeleCate extends Component {
  static propTypes = {
    CommonlyList: PropTypes.array.isRequired
  }

  state = {
    list: [],
    inputVisible: false,
    inputValue: ''
  }

  handleClose = removedTag => {
    const list = this.state.list.filter(t => t !== removedTag)
    this.setState({ list })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    let { inputValue, list } = this.state
    const CommonlyList = this.props.CommonlyList

    if (inputValue && !list.includes(inputValue) && !CommonlyList.includes(inputValue)) {
      list = [...list, inputValue]
    }
    this.setState({
      list,
      inputVisible: false,
      inputValue: ''
    })
  }

  saveInputRef = input => (this.input = input)

  render() {
    const { list, inputVisible, inputValue } = this.state
    return (
      <Fragment>
        {list.map((item, index) => {
          const isLongTag = item.length > 20
          const tagElem = (
            <Tag key={item} closable afterClose={() => this.handleClose(item)} color="#1890ff">
              {isLongTag ? `${item.slice(0, 20)}...` : item}
            </Tag>
          )
          return isLongTag ? (
            <Tooltip title={item} key={item}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          )
        })}

        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}

        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </Fragment>
    )
  }
}

export default SeleCate
