import React, { Component } from 'react'
import { Button, Form, Input, Select } from 'antd'
import FormBuilder from '@/components/helper/FormBuilder'
const Option = Select.Option

const formMeta = {
  colon: true,
  columns: 1,
  elements: [
    {
      id: 'userName',
      label: 'User name',
      tooltip: 'user name',
      widget: Input,
      required: true
    },
    {
      id: 'job',
      label: 'Job'
    },
    {
      id: 'title',
      label: 'Title',
      widget: Input
    }
  ]
}

class DynamicForm extends Component {
  state = {
    jobs: null
  }

  componentDidMount() {
    window.setTimeout(() => {
      const jobs = ['Software Engineer', 'Student', 'Doctor']
      this.setState({ jobs }, () => {
        this.props.form.setFieldsValue({
          job: 'Software Engineer'
        })
      })
    }, 2000)
  }

  resetForm = () => {
    this.props.form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      console.log('submit form: ', values)
    })
  }

  getMeta() {
    // return formMeta
    return {
      ...formMeta,
      elements: formMeta.elements.map(item => {
        if (item.id === 'job') {
          return {
            ...item,
            widget: Select,
            initialValue: 'loading',
            children: this.state.jobs ? (
              this.state.jobs.map(job => <Option key={job}>{job}</Option>)
            ) : (
              <Option key="loading">Loading...</Option>
            )
          }
        }
        if (item.id === 'title' && this.props.form.getFieldValue('job') !== 'Software Engineer') {
          return null
        }
        return item
      })
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ width: '400px' }}>
        <FormBuilder meta={this.getMeta()} form={this.props.form} dynamic>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          &nbsp; &nbsp;
          <Button onClick={this.resetForm}>Reset</Button>
        </FormBuilder>
      </Form>
    )
  }
}

export default Form.create()(DynamicForm)
