import React, { Component } from 'react'
import { connect } from 'react-redux'

import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import './index.less'
import { translateMarkdown } from '@/lib/index'

import { Button, Input, Modal, BackTop } from 'antd'
import SelectCate from './components/Cate'

@connect(state => state.article)
class Edit extends Component {
  state = {
    value: '',
    title: '',
    tagList: [],
    categoryList: [],
    isEdit: false // 组件状态 更新或创建
  }

  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: translateMarkdown
    })

    if (this.props.history.location.state) {
      const { articleId } = this.props.history.location.state
      this.axios.get(`/article/get/${articleId}`).then(res => {
        const { title, tags, categories, content } = res.data
        this.smde.value(content)
        const tagList = tags.map(d => d.name)
        const categoryList = categories.map(d => d.name)
        this.setState({ title, tagList, categoryList, isEdit: true, articleId })
      })
    }
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
    let params = {
      title: this.state.title,
      content: this.smde.value(),
      categories,
      tags
    }
    if (this.state.isEdit) {
      this.axios.put('/article/update', { ...params, articleId: this.state.articleId }).then(res => {
        Modal.confirm({
          title: '文章修改成功！是否查看详情？',
          onOk: () => this.props.history.push(`/article/${this.state.articleId}`)
        })
      })
    } else {
      this.axios.post('/article/create', params).then(res => {
        Modal.confirm({
          title: '文章创建成功！是否立即查看？',
          onOk: () => this.props.history.push(`/article/${res.data.id}`)
        })
      })
    }
  }

  handleUpdate = () => {}

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { title, value, categoryList, tagList, isEdit } = this.state
    return (
      <div className="edit">
        <div className="blog-formItem">
          <span className="label">标题：</span>
          <Input
            placeholder="请输入文章标题"
            className="title-input"
            name="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <SelectCate
          type="category"
          showNum={10}
          onRef={el => (this.$categoryRef = el)}
          list={categoryList}
          isEdit={isEdit}
        />
        <SelectCate
          type="tag"
          showNum={12}
          onRef={el => (this.$tagRef = el)}
          list={tagList}
          isEdit={isEdit}
        />
        <br />
        <textarea id="editor" defaultValue={value} />
        <Button onClick={this.handleSubmit} type="primary">
          {isEdit ? '更新' : '创建'}
        </Button>
        <BackTop />
      </div>
    )
  }
}

export default Edit
