const { article: ArticleModel, tag: TagModel } = require('./models')

const initData = () => {
  const params = [
    {
      title: 'test',
      content: '#aa',
      category: 'react',
      tags: [{ name: 'react' }, { name: 'vue' }]
    },
    {
      title: 'test2',
      content: '#aa2',
      category: 'javascript',
      tags: [{ name: 'http' }, { name: 'vue' }]
    }
  ]
  params.forEach(async d => {
    await ArticleModel.create(d, { include: TagModel })
  })
}

module.exports = initData
