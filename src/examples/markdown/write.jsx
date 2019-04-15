import React, { Component } from 'react'

import hljs from 'highlight.js'

import marked from 'marked'

import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'

function translateMarkdown(plainText) {
  return marked(plainText, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function(code) {
      return hljs.highlightAuto(code).value
    }
  })
}

class Write extends Component {
  state = { markdownText: '' }

  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: translateMarkdown
    })
  }

  handleClick = () => {
    console.log(this.smde.value())
    const markdownText = translateMarkdown(this.smde.value())
    console.log('markdown to html', markdownText)
    this.setState({ markdownText })
  }

  render() {
    return (
      <div>
        <h1>write</h1>
        <button onClick={this.handleClick}>submit</button>
        <textarea id="editor" />

        {this.state.markdownText && (
          <div
            className="article-detail"
            dangerouslySetInnerHTML={{ __html: translateMarkdown(this.state.markdownText) }}
          />
        )}
      </div>
    )
  }
}

export default Write
