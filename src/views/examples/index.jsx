import React, { Component } from 'react'
import axios from '@/utils/axios'
class App extends Component {
  test = () => {
    axios.post('/article', {
      authorId: 34113677,
      title: 'test',
      content: '222',
      tagList: ['js'],
      categoryList: ['js', 'koa']
    })
  }

  test2 = () => {
    axios.get('/tag/list', {
      params: {
        order: ['viewCount', 'DESC']
      }
    })
    axios.get('/category/list', {
      params: {
        order: ['viewCount', 'DESC']
      }
    })

    axios.delete('/article/1')
  }

  render() {
    return (
      <div>
        <button onClick={this.test}>onclik</button>
        <button onClick={this.test2}>222</button>
      </div>
    )
  }
}

export default App
