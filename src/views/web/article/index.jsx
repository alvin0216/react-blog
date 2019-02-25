import React, { Component, Fragment } from 'react'
import './index.less'
import axios from '@/lib/axios'
import { connect } from 'react-redux'
import { translateMarkdown, getCommentsCount } from '@/lib/index'
import { openDrawer, closeDrawer, generateColorMap } from '@/redux/common/actions'

import Navigation from './navigation'
import Loading from '@/components/helper/Loading'
import Tags from '../Tags'
import Comment from '@/components/web/comment'
import { Drawer, Icon, Divider } from 'antd'

@connect(
  state => ({
    windowWidth: state.common.windowWidth,
    drawerVisible: state.common.drawerVisible
  }),
  { openDrawer, closeDrawer, generateColorMap }
)
class ArticleDetail extends Component {
  state = {
    title: '',
    content: '',
    tags: ['react', 'javascript'],
    categories: [],
    postTime: '2019-01-01',
    commentList: [],
    loading: true
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.fetchData(id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      const id = nextProps.match.params.id
      this.fetchData(id)
    }
  }

  fetchData = id => {
    this.setState({ loading: true })
    axios
      .get(`/article/get/${id}`)
      .then(res => {
        const content = translateMarkdown(res.data.content)
        const { title, createdAt, tags, categories, comments } = res.data
        this.props.generateColorMap(comments)
        this.setState({
          tags,
          categories,
          content,
          title,
          postTime: createdAt.slice(0, 10),
          commentList: comments,
          loading: false
        })
      })
      .catch(err => {
        this.props.history.push('/404')
      })
  }

  setCommentList = commentList => this.setState({ commentList })

  render() {
    const { title, tags, categories, content, postTime, commentList, loading } = this.state
    const articleId = parseInt(this.props.match.params.id)
    return (
      <div className="content-inner-wrapper article">
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className="post-header">
              <h1 className="post-title">{title}</h1>

              <div className="others">
                <i className="iconfont icon-post" />
                &nbsp; Posted on &nbsp;
                <span>{postTime}</span>
                <Tags type="tags" list={tags} />
                <Tags type="categories" list={categories} />
                <Divider type="vertical" />
                <Icon type="message" style={{ marginRight: 7 }} />
                {getCommentsCount(commentList)}
              </div>
            </div>

            <div className="article-detail" dangerouslySetInnerHTML={{ __html: content }} />

            {this.props.windowWidth > 1300 ? (
              <div className="right-navigation">
                <Navigation content={content} />
              </div>
            ) : (
              <Fragment>
                <div className="drawer-btn" onClick={this.props.openDrawer}>
                  <Icon type="menu-o" className="nav-phone-icon" />
                </div>
                <Drawer
                  title={title}
                  placement="right"
                  closable={false}
                  onClose={this.props.closeDrawer}
                  visible={this.props.drawerVisible}>
                  <div className="right-navigation">
                    <Navigation content={content} />
                  </div>
                </Drawer>
              </Fragment>
            )}

            <Comment articleId={articleId} commentList={commentList} setCommentList={this.setCommentList} />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default ArticleDetail
