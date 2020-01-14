import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppContainer } from 'react-hot-loader'
import { Provider as BusProvider } from '@/hooks/useBus'

// redux
import { Provider } from 'react-redux'
import store from '@/redux'

// styles
import '@/assets/icons/iconfont'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/index.less'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <BusProvider>
        <Provider store={store()}>
          <Component />
        </Provider>
      </BusProvider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
