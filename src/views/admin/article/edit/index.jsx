import React, { Component, useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import './index.less'

import axios from '@/utils/axios'
import { Button, Input, Modal, BackTop, message } from 'antd'
import MdEditor from '@/components/MdEditor'
import List from './Tag'

function Edit(props) {
  const store = useSelector(state => ({
    tagList: state.article.tagList,
    categoryList: state.article.categoryList,
    authorId: state.user.userId
  }))

  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [tagList, setTagList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [tagSelectedList, setTagSelectedList] = useState([])
  const [cateSelectedList, setCateSelectedList] = useState([])

  const editId = parseInt(props.match.params.id)

  useEffect(() => {
    // did mounted
    if (editId) {
      fetchArticle(editId)
    } else {
    }
  }, [props.match.params])

  useEffect(() => {
    // mounted
    if (!editId) {
      const tags = store.tagList.map(d => d.name).slice(0, 10)
      const cates = store.categoryList.map(d => d.name).slice(0, 10)
      setTagList(tags)
      setCategoryList(cates)
      tags[0] && setTagSelectedList([tags[0]])
      cates[0] && setCateSelectedList([cates[0]])
    }
  }, [store.tagList, store.categoryList])

  function fetchArticle(id) {
    axios.get(`/article/${id}?type=0`).then(res => {
      setTitle(res.title)
      setContent(res.content)
      const tags = res.tags.map(d => d.name)
      const categories = res.categories.map(d => d.name)
      setTagList(tags)
      setCategoryList(categories)
      setTagSelectedList(tags)
      setCateSelectedList(categories)
    })
  }

  function add() {
    if (!title) return message.warning('标题不能为空！')
    axios
      .post('/article', {
        title,
        content,
        tagList: tagSelectedList,
        categoryList: cateSelectedList,
        authorId: store.authorId
      })
      .then(res => {
        Modal.confirm({
          title: '文章创建成功！是否立即查看？',
          onOk: () => props.history.push(`/article/${res.id}`)
        })
      })
  }

  function update() {
    axios
      .put(`/article/${editId}`, {
        title,
        content,
        tags: tagSelectedList,
        categories: cateSelectedList
      })
      .then(() => {
        message.success('更新成功')
      })
  }

  return (
    <div className='admin-edit-article'>
      <ul className='form-list'>
        <li>
          <span className='label'>标题：</span>
          <span style={{ flex: 1 }}>
            <Input
              placeholder='请输入文章标题'
              className='title-input'
              name='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </span>
        </li>
        <li>
          <span className='label'>标签：</span>
          <span>
            <List
              list={tagList}
              setList={setTagList}
              selectedList={tagSelectedList}
              setSelectedList={setTagSelectedList}
            />
          </span>
        </li>
        <li>
          <span className='label'>分类：</span>
          <span>
            <List
              list={categoryList}
              setList={setCategoryList}
              selectedList={cateSelectedList}
              setSelectedList={setCateSelectedList}
            />
          </span>
        </li>
      </ul>
      <MdEditor value={content} onChange={setContent} />
      <Button
        type='primary'
        shape='circle'
        size='large'
        disabled={!title}
        className='action-icon'
        title={editId ? '更新' : '新增'}
        icon={editId ? 'sync' : 'plus'}
        onClick={() => {
          editId ? update() : add()
        }}
      />

      <BackTop target={() => document.querySelector('.admin-main')} />
    </div>
  )
}

export default Edit
