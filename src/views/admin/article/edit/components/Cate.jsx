import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tag } from 'antd'

import SelfCate from './SelfCate'

const CheckableTag = Tag.CheckableTag

/**
 * 选择分类、标签的组件
 *
 * @class SelectCates
 * @extends {Component}
 */
@connect(store => store.article)
class SelectCates extends Component {
  constructor(props) {
    super(props)
    const { type, showNum } = this.props

    let selectList

    if (!this.props.isEdit) {
      this.CommonlyList = this.getCommonlyList(this.props[`${type}List`], showNum)
      selectList = this.CommonlyList[0] ? [this.CommonlyList[0]] : [] // 默认选中第一个  selectList = this.props.list
    }

    this.state = { selectList }
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    showNum: PropTypes.number,
    list: PropTypes.array,
    isEdit: PropTypes.bool
  }

  static defaultProps = {
    type: 'tags',
    showNum: 10
  }

  /**
   * 获取常用的分类、标签列表
   *
   * @param {Array} list - 列表数据
   * @param {Number} num - 获取的数量
   */
  getCommonlyList = (list, num = 10) => {
    const sortList = list.sort((a, b) => b.count - a.count).map(d => d.name)
    return sortList.slice(0, num)
  }

  // 行点击选中事件
  handleSelect = (value, checked) => {
    const { selectList } = this.state
    const nextSelectList = checked ? [...selectList, value] : selectList.filter(t => t !== value)
    this.setState({ selectList: nextSelectList })
  }

  // 获取最终结构
  getResult = () => {
    const { selectList } = this.state
    const selfList = this.$selfCateRef.state.list
    return [...selectList, ...selfList]
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list && nextProps.isEdit) {
      this.setState({ selectList: nextProps.list })
    }
  }

  render() {
    const { selectList } = this.state
    const { type, isEdit } = this.props
    return (
      <div className="blog-formItem">
        <span className="label">{type}: </span>

        {isEdit
          ? this.props.list.map((item, i) => (
              <CheckableTag
                key={item}
                checked={selectList.includes(item)}
                onChange={checked => this.handleSelect(item, checked)}>
                {item}
              </CheckableTag>
            ))
          : this.CommonlyList.map((item, i) => (
              <CheckableTag
                key={item}
                checked={selectList.includes(item)}
                onChange={checked => this.handleSelect(item, checked)}>
                {item}
              </CheckableTag>
            ))}
        <SelfCate CommonlyList={this.props.list} ref={el => (this.$selfCateRef = el)} />
      </div>
    )
  }
}

export default SelectCates
