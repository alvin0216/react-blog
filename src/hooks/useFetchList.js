import { useEffect, useState, useCallback } from 'react'
import axios from '@/utils/axios'

import { useLocation, useHistory } from 'react-router-dom'
import { decodeQuery } from '@/utils'
import useMount from './useMount'

/**
 * fetchList
 * requestUrl 请求地址
 * queryParams 请求参数
 * withLoading 是否携带 loading
 * fetchDependence 依赖 => 可以根据地址栏解析拉取列表
 */
export default function useFetchList({
  requestUrl = '',
  queryParams = null,
  withLoading = true,
  fetchDependence = []
}) {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const location = useLocation()
  const history = useHistory()

  useMount(() => {
    if (fetchDependence.length === 0) {
      fetchWithLoading()
    }
  })

  useEffect(() => {
    if (fetchDependence.length > 0) {
      const params = decodeQuery(location.search)
      pagination.current = parseInt(params.page) || 1
      setPagination({ ...pagination })
      fetchWithLoading(params)
    }
  }, fetchDependence)

  function fetchWithLoading(params) {
    withLoading && setLoading(true)
    fetchDataList(params)
  }

  function fetchDataList(params) {
    const requestParams = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...queryParams,
      ...params
    }

    axios
      .get(requestUrl, { params: requestParams })
      .then(response => {
        pagination.total = response.count
        pagination.current = parseInt(requestParams.page)
        pagination.pageSize = parseInt(requestParams.limit)
        setPagination({ ...pagination })
        setDataList(response.rows)
        console.log('%c useFetchList: ', 'background: yellow', requestParams, response.rows)
        withLoading && setLoading(false)
      })
      .catch(e => withLoading && setLoading(false))
  }

  const onFetch = useCallback(
    params => {
      withLoading && setLoading(true)
      fetchDataList(params)
    },
    [queryParams]
  )

  const handlePageChange = useCallback(
    page => {
      const search = location.search.includes('page=')
        ? location.search.replace(/(page=)(\d+)/, `$1${page}`)
        : `?page=${page}`
      const jumpUrl = location.pathname + search

      history.push(jumpUrl)
    },
    [queryParams]
  )

  return {
    dataList,
    loading,
    pagination: {
      ...pagination,
      onChange: handlePageChange
    },
    onFetch
  }
}
