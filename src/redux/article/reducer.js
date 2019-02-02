// state
const defaultState = {
  categories: ['react', 'vue', 'javascript'],
  tags: [
    'react',
    'vue',
    'javascript',
    'css',
    'Dom',
    'HTML',
    'MySql',
    'element-ui',
    'sequelize',
    '原型原型链',
    '设计模式',
    '跨域',
    '面试系列'
  ],
  recentList: [
    { id: 1, title: '如何利用vw+rem进行移动端布局' },
    { id: 2, title: 'ES6、ES7、ES8特性一锅炖(ES6、ES7、ES8学习指南)' },
    { id: 3, title: '随笔 - 如何用es6+写出优雅的js代码' },
    { id: 4, title: 'react - PureComponent 和 memo' },
    { id: 5, title: 'HTTP - 浏览器输入 url 后 http 请求返回的完整过程' }
  ]
}

// reducer
export const demoReducer = (state = defaultState, action) => {
  switch (action.type) {
    // case constants.DEMO_ADD_COUNT:
    //   return { ...state, count: ++state.count }

    // case constants.DEMO_LOGIN:
    //   return { ...state, isLogin: true }

    // case constants.DEMO_LOGINOUT:
    //   return { ...state, isLogin: false }

    default:
      return state
  }
}

export default demoReducer
