import { useState, useEffect, useCallback } from 'react'
import axios from '@/utils/axios'
import useMount from './useMount'

/**
 * useAntdTable hooks 用于处理 loading 逻辑以及换页 检索等
 *
 * @param {Object} obj
 * @param {Function} obj.fetchList 获取列表的函数
 * @param {Object} obj.queryParams 默认要检索的参数
 */
export default function useAntdTable({ requestUrl = '', queryParams = null, columns = [], isAdmin = true }) {
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [tablePagination, setTablePagination] = useState({ current: 1, pageSize: 10, totoal: 0 })

  useMount(fetchListWithLoading)

  function fetchDataList(params) {
    const requestParams = {
      page: tablePagination.current,
      pageSize: tablePagination.pageSize,
      ...queryParams,
      ...params
    }

    axios
      .get(requestUrl, { params: requestParams })
      .then(response => {
        const { page, pageSize } = requestParams
        const { count, rows } = response

        if (count > 0 && count > pageSize) {
          const totalPage = Math.ceil(count / pageSize)
          if (totalPage < page) return fetchDataList({ page: totalPage }) // 例如 删除了列表里只有一项且删除，则需要跳转回前一页 也即最后一页
        }

        tablePagination.current = page
        tablePagination.total = count
        setTablePagination({ ...tablePagination }) // 设置分页
        setDataList(rows)
        setLoading(false)
        console.log('%c useAntdTabled', 'background: yellow', requestParams, rows)
      })
      .catch(error => {
        console.log('fetchDataList error: ', requestParams, error)
        setLoading(false)
      })
  }

  async function fetchListWithLoading(params) {
    setLoading(true)
    fetchDataList(params)
  }

  async function updateList(func) {
    try {
      setLoading(true)
      await func()
      fetchDataList()
    } catch (error) {
      console.log('updateList error: ', error)
      setLoading(false)
    }
  }

  /**
   * 分页、排序、筛选变化时触发
   * 注意 当前只封装分页
   */
  function handleTableChange(pagination, filters, sorter) {
    if (JSON.stringify(filters) === '{}' && JSON.stringify(sorter) === '{}') {
      console.log('handleTableChange: ', pagination, filters, sorter)
      fetchListWithLoading({ page: pagination.current })
    }
  }

  /**
   * 检索功能
   */
  function onSearch(params) {
    fetchListWithLoading({ page: 1, ...params })
  }

  return {
    tableProps: {
      className: isAdmin ? 'admin-table' : '',
      rowKey: 'id',
      loading,
      columns,
      dataSource: dataList,
      pagination: {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        total: tablePagination.total,
        showTotal: total => `共 ${total} 条`
      },
      onChange: handleTableChange
    },
    dataList,
    updateList: useCallback(updateList, [tablePagination, queryParams]), // 进行 action 操作 比如删除修改数据后获取数据 @example updateList(() => { return axios.put('xxxx') })
    onSearch: useCallback(onSearch, [tablePagination, queryParams]),
    setLoading: useCallback(setLoading, [])
  }
}
