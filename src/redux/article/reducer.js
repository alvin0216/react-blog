// state
const defaultState = {
  categoryList: [
    { name: 'Sequelize', count: 9 },
    { name: 'React', count: 11 },
    { name: '面试系列', count: 2 },
    { name: 'regexp', count: 3 },
    { name: 'this', count: 1 }
  ],
  tagList: [
    { name: 'css', count: 1 },
    { name: 'DOM', count: 3 },
    { name: 'ES6', count: 3 },
    { name: 'Javascript', count: 12 },
    { name: 'Javascript 深入系列', count: 10 },
    { name: 'MySQL', count: 5 },
    { name: 'MVVM', count: 1 },
    { name: 'Sequelize', count: 9 },
    { name: 'React', count: 11 },
    { name: '面试系列', count: 2 },
    { name: 'regexp', count: 3 },
    { name: 'this', count: 1 },
    { name: '闭包', count: 1 }
  ],
  recentList: [
    { id: 1, title: '如何利用vw+rem进行移动端布局' },
    { id: 2, title: 'ES6、ES7、ES8特性一锅炖(ES6、ES7、ES8学习指南)' },
    { id: 3, title: '随笔 - 如何用es6+写出优雅的js代码' },
    { id: 4, title: 'react - PureComponent 和 memo' },
    { id: 5, title: 'HTTP - 浏览器输入 url 后 http 请求返回的完整过程' },
    { id: 6, title: 'HTTP - keep-alive' }
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
