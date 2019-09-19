const { ADMIN_GITHUB_LOGIN_NAME } = require('./config')
const UserController = require('./controllers/user')
const ArticleController = require('./controllers/article')

/**
 * init Data
 */

module.exports = () => {
  UserController.initGithubUser(ADMIN_GITHUB_LOGIN_NAME) // 创建 role === 1 的账号 from github...
  ArticleController.initAboutPage()
}
