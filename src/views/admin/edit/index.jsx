import React, { Component } from 'react'
import { connect } from 'react-redux'

import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import './index.less'
import { translateMarkdown } from '@/lib/index'
import axios from '@/lib/axios'

import { Button, Input } from 'antd'
import SelectCate from './components/Cate'

@connect(state => state.article)
class Edit extends Component {
  state = {
    markdownText: '',
    title: ''
  }

  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: translateMarkdown
    })
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

  handleSubmit = () => {
    const tags = this.$tagRef.getResult()
    const categories = this.$categoryRef.getResult()

    axios.post('/article/create', {
      title: this.state.title,
      content: this.smde.value(),
      categories,
      tags
    }).then(res => {
      console.log(res)
    })
  }

  render() {
    return (
      <div>
        <div className="blog-formItem">
          <span className="label">标题：</span>
          <Input placeholder="请输入文章标题" className="title-input" />
        </div>
        <SelectCate type="category" showNum={6} onRef={el => (this.$categoryRef = el)} />
        <SelectCate type="tag" onRef={el => (this.$tagRef = el)} />
        <br />
        <textarea id="editor" />
        <Button onClick={this.handleSubmit} type="primary">
          create
        </Button>
      </div>
    )
  }
}

export default Edit
