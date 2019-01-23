import React, { Component, lazy, Suspense } from 'react'
import Loadable from 'react-loadable'

/**
 * 使用 webpack 的 import 方法实现动态加载组件！dynamic import
 * @param {Function} importComponent - example const xx = asyncComponent(() => import('./xxx'))
 */
export const asyncComponent = importComponent =>
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      this.state = { component: null }
    }
    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({ component })
    }

    render() {
      const RenderComponet = this.state.component
      return RenderComponet ? <RenderComponet {...this.props} /> : <div>loading...</div>
    }
  }

/**
 * 使用 react-loadable 实现代码分割
 * @param {Function} importComponent - example const xx = asyncComponent(() => import('./xxx'))
 */
export const lazyLoad = importComponent =>
  Loadable({
    loader: importComponent,
    loading: <div>loading...</div>
  })

// 使用 react.lazy...
export default WrappedComponent =>
  class extends Component {
    render() {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <WrappedComponent {...this.props} />
        </Suspense>
      )
    }
  }
