import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, InputNumber, Select, Icon } from 'antd'
import FormBuilder from '@/components/helper/FormBuilder'
const Option = Select.Option

// gender - 性别选择下拉框
const genderOptions = [{ value: 0, label: 'Male' }, { value: 1, label: 'Female' }].map(item => (
  <Option key={item.value} value={item.value}>
    {item.label}
  </Option>
))

/**
 * colon 标签前是否显示冒号
 * columns 一行内显示几个表单控件 默认一行显示一个
 * gutter 多个 columns 时，gutter 为行之间的间距
 * element
 *    id | key 对应的表单字段名 isRequired
 *    label 显示的 label
 *    tooltip label 右侧显示 tooltip
 *    widget 表单显示的部件
 *    widgetProps 部件的 props
 *
 *    fieldProps - getFieldDecorator(id, options) 对应的为 options （你可以写整个对象也可以写其中的属性。FormBuilder 已经处理好了）
 *      initialValue 初始值
 *      rules 部件的校验规则
 *      ...
 *   formItemProps -  <FormItem {...formItemProps}>
 *      label
 *      formItemLayout...
 *        layout 为 vertical 时，请重写这个对象来覆盖定义的默认布局
 *
 *
 */
const formMeta = {
  colon: true, // 配合 label 属性使用，表示是否显示 label 后面的冒号
  columns: 1, // 一行显示几个表单控件
  // formItemLayout: {},
  elements: [
    {
      key: 'userName',
      label: 'User name',
      tooltip: 'user name',
      initialValue: 'Nate',
      widget: Input,
      rules: [{ required: true, message: '用户名不能为空' }],
      formItemProps: {} // 自定义 formItemProps
    },
    {
      key: 'password',
      label: 'Password',
      widget: Input,
      // 定义widget 部件的 props
      widgetProps: {
        prefix: <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />,
        placeholder: 'please input your password'
      },
      type: 'password',
      required: true // 默认增加了 rules [required: true, message: `${label} is required`]
    },
    {
      key: 'date',
      label: 'Birth date',
      widget: DatePicker,
      widgetProps: { style: { width: '100%' } }
    },
    {
      key: 'gender',
      label: 'Gender',
      initialValue: 'female',
      widget: Select,
      children: genderOptions
    },
    {
      key: 'phone',
      label: 'Phone',
      widget: Input,
      required: true,
      rules: [
        {
          pattern: /^\d+$/,
          message: 'Phone must only contain numbers.'
        },
        {
          min: 11,
          message: 'Phone number at least lenght of 11'
        }
      ]
    },
    {
      key: 'age',
      label: 'Age',
      initialValue: 10,
      widget: InputNumber
    },
    {
      key: 'email',
      label: 'Email',
      widget: Input,
      rules: [
        {
          type: 'email',
          message: 'Please input valid email address.'
        }
      ]
    }
  ]
}

class FormSubmitAntd extends Component {
  resetForm = () => {
    this.props.form.resetFields()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return
      // let params =
      console.log('submit form: ', values)
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal" style={{ width: '400px' }}>
        <FormBuilder meta={formMeta} form={this.props.form}>
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

export default Form.create()(FormSubmitAntd)
