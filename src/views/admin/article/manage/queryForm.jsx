import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input, Select, DatePicker, Checkbox, Radio } from 'antd'
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
          key: 'title',
          label: '标题',
          widget: <Input placeholder="请输入文章标题" />
        },
        {
          key: 'tag',
          label: '标签',
          widget: (
            <Select className="form-select" allowClear>
              {this.props.tagList.map(item => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )
        },
        {
          key: 'category',
          label: '分类',
          widget: (
            <Select className="form-select" allowClear>
              {this.props.categoryList.map(item => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )
        },
        {
          key: 'fetchTop',
          label: '置顶文章',
          labelCol: 20,
          wrapperCol: 4,
          formItemProps: { className: 'form-checkbox-wrap' },
          widget: <Checkbox />
        }
        // {
        //   key: 'rangTime',
        //   label: '创建时间',
        //   widget: (
        //     <RangePicker
        //       ranges={{
        //         Today: [moment(), moment()],
        //         'This Month': [moment().startOf('month'), moment().endOf('month')]
        //       }}
        //       format="YYYY/MM/DD HH:mm:ss"
        //     />
        //   )
        // }
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
