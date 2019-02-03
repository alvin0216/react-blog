import React, { Component } from 'react'
import { connect } from 'react-redux'

import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import { translateMarkdown } from '@/lib/index'
import { Select, Tag, Icon } from 'antd'

const CheckableTag = Tag.CheckableTag
const Option = Select.Option

@connect(state => state.article)
class Edit extends Component {
  state = {
    markdownText: '',
    title: '',
    category: '',
    tags: []
  }

  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: translateMarkdown
    })
  }

  handleChange = value => {
    console.log()
  }

  handleSelectTags = (tag, checked) => {
    const { tags } = this.state
    const nextSelectedTags = checked ? [...tags, tag] : tags.filter(t => t !== tag)
    console.log(nextSelectedTags)
    this.setState({ tags: nextSelectedTags })
  }

  /**
   * 获取常用的分类、标签列表
   *
   * @param {Array} list - 列表数据
   * @param {Number} num - 获取的数量
   */
  getCommonlyList = (list, num = 10) => {
    const sortList = list.sort((a, b) => b.count - a.count)
    return sortList.slice(0, num)
  }

  render() {
    const CommonlyTagList = this.getCommonlyList(this.props.tagList)
    const CommonlyCategoryList = this.getCommonlyList(this.props.categoryList, 6)
    const { tags } = this.state
    return (
      <div>
        <div className="">
          <span>Category: </span>
          {CommonlyCategoryList.map((tag, i) => (
            <CheckableTag
              key={tag.name}
              checked={tags.includes(tag.name)}
              onChange={checked => this.handleSelectTags(tag.name, checked)}>
              {tag.name}
            </CheckableTag>
          ))}
        </div>
        <div className="">
          <span>Tags: </span>
          {CommonlyTagList.map((tag, i) => (
            <CheckableTag
              key={tag.name}
              checked={tags.includes(tag.name)}
              onChange={checked => this.handleSelectTags(tag.name, checked)}>
              {tag.name}
            </CheckableTag>
          ))}

          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        </div>
        <textarea id="editor" />
      </div>
    )
  }
}

export default Edit
