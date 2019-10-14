import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Icon, Row, Tooltip } from 'antd'
import { RandomId } from '@/utils'

const FormItem = Form.Item

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
 * @func pickProps - 遍历相关部件的 props，（我们不应把 element 的 props 都传入每个部件，只需要传对应需要的 props!）
 * @param {Object} source - 每个 element 对象
 * @param {Array} props
 */
function pickProps(source, props) {
  const target = {}
  props.forEach(prop => {
    if (prop in source) target[prop] = source[prop]
  })
  return target
}

/* @func getLastFormItemLayout - 根据 formItemProps.formItemLayout 计算最后一项 Item wrapperCol
 * @param {Object} formItemProps
 * @returns wrapperCol
 */
function getLastFormItemLayout({ labelCol }) {
  const wrapperCol = { xs: {}, sm: {} }
  for (const key in labelCol) {
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
 * 封装处理 antd 的表单，减少代码量。
 *
 * props.meta 说明
 *    colon 标签前是否显示冒号
 *    columns 一行内显示几个表单控件 默认一行显示一个
 *    gutter 多个 columns 时，gutter 为行之间的间距
 *    element
 *      id 对应的表单字段名
 *      label 显示的 label
 *      tooltip label 右侧显示 tooltip
 *      widget 表单显示的部件
 *      fieldProps - getFieldDecorator(id, options) 对应的为 options （你可以写整个对象也可以写其中的属性。FormBuilder 已经处理好了）
 *          initialValue 初始值
 *          rules 部件的校验规则
 *      formItemProps -  <FormItem {...formItemProps}>
 *        label
 *        formItemLayout...
 *      render 自定义渲染
 */
function FormBuilder(props) {
  const { meta, form } = props
  const elements = meta.elements || []

  // 表单布局渲染
  const renderLayout = elements => {
    const columns = meta.columns || 1
    if (columns === 1) return elements
    const gutter = meta.gutter || 0
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

  //  form item render
  const renderElement = (element, index) => {
    // Handle form item props
    const label = element.tooltip ? (
      <span>
        {element.label}
        <Tooltip title={element.tooltip}>
          {' '}
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    ) : (
      element.label
    )

    const formItemProps = {
      key: element.key || element.id,
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
        disabled: props.disabled
      })
    }

    // Handle field props
    let rules = element.rules || []
    if (element.required) {
      rules = [
        ...rules,
        {
          required: true,
          message: `${element.label || element.key || element.id} is required.` // default to English, if needs localization, pass message to it.
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

    const wrapperCol = getLastFormItemLayout(formItemProps)
    const { getFieldDecorator } = form
    return (
      <Fragment key={element.key || element.id}>
        <FormItem {...formItemProps}>
          {getFieldDecorator(element.key || element.id, fieldProps)(element.widget)}
        </FormItem>

        {props.children && index === elements.length - 1 && (
          <>
            {Array.isArray(props.children) ? (
              props.children.map(item => (
                <FormItem wrapperCol={wrapperCol} key={RandomId(10)}>
                  {item}
                </FormItem>
              ))
            ) : (
              <FormItem wrapperCol={wrapperCol} key={RandomId(10)}>
                {props.children}
              </FormItem>
            )}
            }
          </>
        )}
      </Fragment>
    )
  }

  return renderLayout(elements.map(renderElement))
}

FormBuilder.propTypes = {
  meta: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
}

export default FormBuilder
