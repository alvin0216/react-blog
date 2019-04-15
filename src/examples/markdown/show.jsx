import React, { Component } from 'react'
import Navigation from './navigation'

class Show extends Component {
  state = { markdownText: '', anchors: [] }

  componentDidMount() {
    this.axios.get('/examples/md').then(res => {
      this.setState({ markdownText: res.content })
    })
  }

  render() {
    const { markdownText } = this.state
    return (
      <div>
        <button onClick={this.handleClick}>click</button>
        <div className="test">
          <Navigation article={markdownText} />
        </div>

        <div className="article-detail" dangerouslySetInnerHTML={{ __html: this.state.markdownText }} />

        <a href="#a">aa</a>
      </div>
    )
  }
}

export default Show
