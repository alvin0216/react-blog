import React, { Component, Suspense, lazy } from 'react'
import Loading from '@/components/helper/Loading'

const WebpackDemo = lazy(() => import('./demo'))

class CodeSplitting extends Component {
  render() {
    return (
      <Suspense fallback={<Loading />}>
        <h1>CodeSplitting</h1>
        <WebpackDemo />
        <br />
      </Suspense>
    )
  }
}

export default CodeSplitting
