import React, { Component } from 'react'
import BaseForm from './baseForm'
import DynamicForm from './dynamicForm'

class FormDemo extends Component {
  renderComponent = id => {
    const map = {
      1: <BaseForm />,
      2: <DynamicForm />
    }
    return map[id]
  }

  render() {
    const res = this.renderComponent(this.props.match.params.formId)
    return res
  }
}

export default FormDemo
