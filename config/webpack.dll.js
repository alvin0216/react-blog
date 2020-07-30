const { resolve } = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

// webpack --config webpack.dll.js
module.exports = {
  entry: {
    'react': ['react', 'react-dom'],
    'router': ['react-router-dom'],
    'redux': ['redux', 'react-redux', 'redux-thunk'],
    // 'antd': [
    //   'antd/lib/form',
    //   'antd/lib/steps',
    //   'antd/lib/input',
    //   'antd/lib/row',
    //   'antd/lib/col',
    //   'antd/lib/button',
    //   'antd/lib/message',
    //   'antd/lib/icon',
    //   'antd/lib/cascader',
    //   'antd/lib/checkbox',
    //   'antd/lib/modal',
    //   'antd/lib/upload',
    //   'antd/lib/progress',
    // ]
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '../dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露的内容名称
      path: resolve(__dirname, '../dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production',

  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin()
  //   ]
  // }
}