import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Icon, Row, Tooltip } from 'antd'

const FormItem = Form.Item

/**
 * @func pickProps - 遍历相关部件的 props，（我们不应把 element 的 props 都传入每个部件，只需要传对应需要的 props!）
 * @param {Object} source - 每个 element 对象
 * @param {Array} props
 */
function pickProps(source, props) {
  let target = {}
  props.forEach(prop => {
    if (prop in source) target[prop] = source[prop]
  })
  return target
}

/**
 * @func getLastFormItemLayout - 根据 formItemProps.formItemLayout 计算最后一项 Item wrapperCol
 * @param {Object} formItemProps
 * @returns wrapperCol
 */
function getLastFormItemLayout({ labelCol }) {
  let wrapperCol = { xs: {}, sm: {} }
  for (let key in labelCol) {
    if (labelCol[key]['span'] === 24) {
      wrapperCol[key]['offset'] = 0
      wrapperCol[key]['span'] = 24
    } else {
      wrapperCol[key]['offset'] = labelCol[key]['span']
      wrapperCol[key]['span'] = 24 - labelCol[key]['span']
    }
  }
  return wrapperCol
}

/**
 * 获取 elements 的最后一个 index （用于决定 this.props.children 的渲染）
 * @param {Boolean} dynamic - 是否为动态表单
 * @param {Array} elements
 */
function getLastIndex(dynamic = false, elements) {
  if (!dynamic) return elements.length - 1
  const els = elements.filter(v => !!v)
  return els.length - 1
}

// 判断部件类型 渲染部件
function renderWidget(element, widgetProps) {
  let res
  if (typeof element.widget === 'function') {
    res = <element.widget {...widgetProps}>{element.children || null}</element.widget>
  } else if (typeof element.widget === 'object') {
    res = element.widget
  }
  return res
}

const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

/**
 * 封装处理 antd 的表单，减少代码量。
 * @example see src/examples/FormBuilder/baseForm
 * @example see src/examples/FormBuilder/dynamicForm 动态表单
 *
 * @class FormBuilder
 * @extends {Component}
 */
class FormBuilder extends Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    dynamic: PropTypes.bool // 是否为动态表单
  }

  static defaultProps = {
    disabled: false,
    one: false
  }

  getMeta() {
    const { meta } = this.props
    return meta.elements ? meta : { elements: [meta] }
  }

  renderLayout = elements => {
    // Layout the form in columns
    const columns = this.props.meta.columns || 1
    if (columns === 1) return elements
    const gutter = this.props.meta.gutter || 0
    const rows = []
    const colspan = 24 / columns
    for (let i = 0; i < elements.length; i += columns) {
      const cols = []
      for (let j = 0; j < columns; j += 1) {
        cols.push(
          <Col key={j} span={colspan.toString()}>
            {elements[i + j]}
          </Col>
        )
      }
      rows.push(
        <Row key={i} gutter={gutter}>
          {cols}
        </Row>
      )
    }
    return rows
  }

  renderElement = (element, index) => {
    const meta = this.getMeta()
    if (!element) return null

    // Handle form item props
    const label = element.tooltip ? (
      <span>
        {element.label}
        <Tooltip title={element.tooltip}>
          {' '}
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    ) : (
      element.label
    )

    const formItemProps = {
      key: element.id || element.key,
      colon: meta.colon,
      ...(meta.formItemLayout || (element.label ? defaultFormItemLayout : null)),
      label,
      ...pickProps(element, ['help', 'extra', 'labelCol', 'wrapperCol', 'colon', 'hasFeedback', 'validateStatus']),
      ...element.formItemProps
    }

    if (element.render) {
      return element.render.call(this, {
        formItemProps,
        element,
        disabled: this.props.disabled
      })
    }

    // Handle field props
    let rules = element.rules || []
    if (element.required) {
      rules = [
        ...rules,
        {
          required: true,
          message: `${element.label || element.id || element.key} is required.` // default to English, if needs localization, pass message to it.
        }
      ]
    }

    // 详见 https://ant.design/components/form-cn/#components-form-demo-normal-login
    // getFieldDecorator(id, options) 参数
    const fieldProps = {
      ...pickProps(element, [
        'getValueFromEvent',
        'initialValue',
        'normalize',
        'preserve',
        'trigger',
        'valuePropName',
        'validateTrigger',
        'validateFirst'
      ]),
      rules,
      ...element.fieldProps
    }

    // Handle widget props
    const wp = element.widgetProps || {}
    const widgetProps = {
      ...pickProps(element, ['placeholder', 'type', 'className', 'class']),
      ...wp,
      disabled: element.disabled || wp.disabled || this.props.disabled
    }
    const { getFieldDecorator } = this.props.form

    if (meta.elements && this.props.children && getLastIndex(this.props.dynamic, meta.elements) === index) {
      const wrapperCol = getLastFormItemLayout(formItemProps)
      return (
        <Fragment key={element.id || element.key}>
          <FormItem {...formItemProps}>
            {getFieldDecorator(element.id || element.key, fieldProps)(
              // <element.widget {...widgetProps}>{element.children || null}</element.widget>
              renderWidget(element, widgetProps)
            )}
          </FormItem>
          <FormItem wrapperCol={wrapperCol} key={index + 1}>
            {this.props.children}
          </FormItem>
        </Fragment>
      )
    } else {
      return (
        <FormItem {...formItemProps}>
          {getFieldDecorator(element.id || element.key, fieldProps)(
            // <element.widget {...widgetProps}>{element.children || null}</element.widget>
            renderWidget(element, widgetProps)
          )}
        </FormItem>
      )
    }
  }

  render() {
    return this.renderLayout(this.getMeta().elements.map(this.renderElement))
  }
}

export default FormBuilder
