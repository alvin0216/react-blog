import React, { useState, useEffect } from 'react'

import { Input, Tooltip, Icon, Tag } from 'antd'

const { CheckableTag } = Tag

function AppTag(props) {
  const { list, setList } = props
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { selectedList, setSelectedList } = props
  let inputRef = null

  function removeItem(item) {
    const newList = list.filter(l => l !== item)
    setList(newList)
  }

  function addItem() {
    if (inputValue && !list.find(d => d === inputValue)) {
      setList([...list, inputValue])
      setSelectedList([...selectedList, inputValue])
      setInputValue('')
    }

    setInputVisible(false)
  }

  function showInput() {
    setInputVisible(true)
    inputRef && inputRef.focus()
  }

  // 行点击选中事件
  function handleSelect(value, checked) {
    const newList = checked ? [...selectedList, value] : selectedList.filter(t => t !== value)
    setSelectedList(newList)
  }

  return (
    <>
      {list.map((item, index) => {
        const isLongTag = item.length > 20
        const tagElem = (
          <CheckableTag
            key={item}
            closable='true'
            onClose={() => removeItem(item)}
            checked={selectedList.includes(item)}
            onChange={checked => handleSelect(item, checked)}
            color='#1890ff'>
            {isLongTag ? `${item.slice(0, 20)}...` : item}
          </CheckableTag>
        )
        return isLongTag ? (
          <Tooltip title={item} key={item}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}

      <Input
        style={{ width: 78, display: inputVisible ? 'inline' : 'none' }}
        ref={el => {
          inputRef = el
        }}
        type='text'
        size='small'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onBlur={addItem}
        onPressEnter={addItem}
      />

      {!inputVisible && (
        <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <Icon type='plus' /> New Tag
        </Tag>
      )}
    </>
  )
}

export default AppTag
