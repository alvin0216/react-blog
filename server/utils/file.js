/**
 * 操作 md 文件 的 utils
 */
const fs = require('fs')
const path = require('path')

const uploadPath = path.resolve(__dirname, '../upload')
const outputPath = path.resolve(__dirname, '../output')

/**
 *
 * @param {String} filePath - 文件路径
 * @return {Promise}
 */
function findOrCreateFilePath(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const exist = fs.existsSync(filePath)
      if (exist) {
        resolve(true)
      } else {
        fs.mkdirSync(filePath)
        console.log(`${filePath} 路径创建成功`)
        resolve(true)
      }
    } catch (error) {
      reject(false)
    }
  })
}

/**
 * 解析上传的文件的前缀
 * @param {String} filePath
 * @return {Object} - title date categories tags content
 */
function decodeFile(filePath) {
  const fileData = fs.readFileSync(filePath, 'utf-8')
  const sliceData = fileData.slice(0, 500).trim() // slice(0, 500) 我们需要对文章里包含的前缀进行解析 前缀参考 hexo 创建的前缀内容
  const lastIndex = sliceData.lastIndexOf('\n---')
  const hasPrefix = sliceData.indexOf('---') === 0 && lastIndex > 0
  if (hasPrefix) {
    const result = {}
    const prefixData = sliceData.slice(4, lastIndex)
    // md 文件包含前缀
    const _decodePrefix = prefixStr => {
      const keyList = prefixStr.match(/.*[a-z]:/g) // 获取到 key 值
      const _loop = (prev, next) => {
        const start = prefixData.indexOf(prev) + prev.length
        const end = prefixData.indexOf(next)
        const trimStr = end === -1 ? prefixData.slice(start).trim() : prefixData.slice(start, end).trim() // 字符串截取 + trim
        const valueArr = trimStr.split('\n').reduce((list, item) => {
          const _item = item.trim()
          if (_item.indexOf('- ') === 0) {
            // 以 - 开头则消除
            list.push(_item.replace(/- /, ''))
          } else {
            list.push(_item)
          }
          return list
        }, [])

        const key = prev.replace(/:/, '')

        // 转化 value
        if (['title', 'date'].includes(key)) {
          if (key === 'title') {
            valueArr[0] = valueArr[0].replace(/^(\s|[,'"])+|(\s|[,'"])+$/g, '') // 可能出现 title： ‘xxx’ 的情况 需要除去 ‘’
          }
          result[key] = valueArr[0]
        } else if (['tags', 'categories'].includes(key)) {
          result[key] = valueArr
        }

        return result
      }

      keyList.forEach((k, i) => _loop(k, keyList[i + 1])) // 解析 prefix
    }

    _decodePrefix(prefixData)

    result.content = fileData.slice(lastIndex + 4).trim()
    return result
  } else {
    return { content: fileData }
  }
}

/**
   * @func createFileContent 创建文章前缀
   * @param {Object} article
   * @return {String} 返回生成后的字符串
   * render just like:
    ---
      title: mysql - 对 table 的操作
      date: 2018-08-03 21:37:37
      categories: HTML-CSS
      tags:
        - HTML
        - canvas
    ---

    ...
*/
function createFileContent({ title, content, createdAt, categories, tags }) {
  /**
   * 生成分类、标签字符串的方法
   * @param {Array} list
   * @return {String}
   */
  function _generateTag(list) {
    const newList = list.reduce((list, item) => {
      list.push(item.name)
      return list
    }, [])

    if (newList.length === 1) {
      return newList[0]
    } else {
      return newList.map(name => `\n - ${name}`).join('')
    }
  }

  function _transferTitle(str) {
    if (/(\[)|(\])/g.test(str)) {
      return `'${str}'`
    } else {
      return str
    }
  }

  const prefix = [
    '---',
    `title: ${_transferTitle(title)}`,
    `date: ${createdAt}`,
    `categories: ${_generateTag(categories)}`,
    `tags: ${_generateTag(tags)}`,
    '---\n',
    content
  ]

  return prefix.join('\n')
}

/**
 * 创建 md 文件
 * @param {Object} article
 */
async function generateFile(article) {
  return new Promise((resolve, reject) => {
    findOrCreateFilePath(outputPath).then(() => {
      const fileName = `${article.title}.md`
      const writeFilePath = `${outputPath}/${fileName}`
      const fileContent = createFileContent(article)
      fs.writeFile(writeFilePath, fileContent, function(err) {
        if (err) {
          reject()
          throw err
        }
        fs.readFile(writeFilePath, function(err, data) {
          if (err) {
            throw err
          }
          resolve({ filePath: writeFilePath, fileName })
        })
      })
    })
  })
}

module.exports = {
  findOrCreateFilePath, // 查找或创建文件夹
  uploadPath, // 上传目录
  outputPath, // 导出目录
  decodeFile, // 解析 md 文件
  generateFile // 生成 md 文件
}
