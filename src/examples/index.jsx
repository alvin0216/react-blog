import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import routes from './routes'

class ExampleIndex extends Component {
  render() {
    return (
      <div>
        <h1>ExampleIndex</h1>
        <ul>
          {routes.childRoutes.map(r => {
            const url = r.path.replace(/:.+/, '') // 处理类似 form/:formId 的路由 
            return (
              <li key={r.path}>
                <Link to={`/${routes.path}/${url}`}>{r.name || r.path}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default ExampleIndex
