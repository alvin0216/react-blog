import React, { Component } from 'react'
import { connect } from 'react-redux'

import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import { translateMarkdown } from '@/lib/index'
import { Select } from 'antd'

const Option = Select.Option

@connect(state => state.article)
class Edit extends Component {
  state = { markdownText: '' }

  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: translateMarkdown
    })
  }

  handleChange = value => {
    console.log(value)
  }

  render() {
    return (
      <div>
        <Select mode="tags" style={{ width: '100%' }} onChange={this.handleChange} tokenSeparators={[',']}>
          {this.props.categories.map(d => (
            <Option key={d}>{d}</Option>
          ))}
        </Select>
        <textarea id="editor" />
      </div>
    )
  }
}

export default Edit
