import React, { Component, useEffect, useState } from 'react'

import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

import { translateMarkdown } from '@/utils'

function MdEditor(props) {
  // useEffect(() => {}, [])

  // return <textarea id='simple-editor' style={{ display: 'none' }} />
  return (
    <SimpleMDE
      value={props.value}
      onChange={props.onChange}
      options={{ autofocus: true, autosave: true, previewRender: translateMarkdown }}
    />
  )
}

export default MdEditor
