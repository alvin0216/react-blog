import React, { Component, lazy } from 'react'
import Lazy, { asyncComponent } from '@/components/helper/lazyLoad'

const WebpackDemo = asyncComponent(() => import('./demo'))
const ReactLazyDemo = lazy(() => import('./demo'))

@Lazy
class CodeSplitting extends Component {
  render() {
    return (
      <div>
        <h1>CodeSplitting</h1>
        <WebpackDemo />
        <br />
        <ReactLazyDemo />
      </div>
    )
  }
}

export default CodeSplitting
