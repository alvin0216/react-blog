import React from 'react'
import './index.less'
import AuthorAvatar from '@/components/web/AuthorAvatar'

import { Divider, Icon, Rate } from 'antd'

const About = () => {
  return (
    <div className="content-inner-wrapper about">
      <AuthorAvatar />
      <span className="desc">前端打杂人员，略微代码洁癖</span>
      <Divider orientation="left">博客简述</Divider>
      {/* <p>主要是用来记录博主学习而作！</p> */}
      <p>本博客使用的技术为 react v16.8 + antd + koa2 + mysql</p>
      <p>
        源码地址为{' '}
        <a target="_blank" rel="noreferrer noopener" href="https://github.com/gershonv/react-blognv">
          github
        </a>
        ，仅供参考，不做商业用途！
      </p>
      <Divider orientation="left">关于我</Divider>
      <ul>
        <li>姓名：郭少威</li>
        <li>学历专业：本科 软件工程</li>
        <li>联系方式：wechat guo6059</li>
        <li>
          其他博客地址：
          <a target="_blank" rel="noreferrer noopener" href="https://gershonv.github.io/">
            hexo 博客
          </a>
          <Divider type="vertical" />
          <a target="_blank" rel="noreferrer noopener" href="https://juejin.im/user/5acac6c4f265da2378408f92">
            掘金主页
          </a>
        </li>
        <li>
          技能
          <ul>
            <li>
              HTML、CSS、Javascript：能熟练开发符合 W3C 标准的页面！
              <Rate defaultValue={3} disabled />
            </li>
            <li>
              react vue 框架：熟练掌握使用！
              <Rate defaultValue={3} disabled />
            </li>
            <li>
              es6：日常开发必备，以及掌握基本面向对象编程实现！
              <Rate defaultValue={3} disabled />
            </li>
            <li>
              webpack: 入门级别，可以对脚手架进行针对性的配置！
              <Rate defaultValue={2} disabled />
            </li>
            <li>
              node mysql：针对需求可以做到简单的数据库设计、接口的开发与设计！
              <Rate defaultValue={2} disabled />
            </li>
          </ul>
        </li>
        <li>
          其他
          <ul>
            <li>常用开发工具： vscode、webstorm、git</li>
            <li>熟悉的 UI 工具： antd、element-ui、vux</li>
            <li>良好的代码习惯： 略微代码洁癖、注释规范 jsdoc</li>
          </ul>
        </li>
        <li>
          个人
          <ul>
            <li>偶尔玩玩游戏、看看书</li>
            <li>慢热型、平常比较好说话。联系方式在上面，欢迎交流！</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default About
