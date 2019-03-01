import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Select, DatePicker } from 'antd'
import FormBuilder from '@/components/helper/FormBuilder'
import { connect } from 'react-redux'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option

@connect(state => state.article)
class QueryForm extends Component {
  static propTypes = {
    getQuery: PropTypes.func.isRequired
  }

  getFormMeta = () => {
    return {
      colon: true,
      elements: [
        {
          key: 'username',
          label: '姓名',
          widget: <Input placeholder="请输入姓名" />
        }
      ]
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      console.log('submit form: ', values)
      this.props.getQuery(values)
    })
  }

  render() {
    return (
      <div className="query-form">
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <FormBuilder meta={this.getFormMeta()} form={this.props.form}>
            <Button type="primary" htmlType="submit">
              检索
            </Button>
          </FormBuilder>
        </Form>
      </div>
    )
  }
}

export default Form.create()(QueryForm)
