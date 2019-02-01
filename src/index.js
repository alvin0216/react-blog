import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import { Provider } from 'react-redux'
import store from '@/redux'

import '@/style/reset.less'

import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/atom-one-light.css'

import '@/style/index.less'

hljs.registerLanguage('javascript', javascript)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

// ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
