import React, { useState } from 'react'

/**
 * ajax request with loading
*/
export default function useRequestLoading() {
  const [loading, setLoading] = useState(false)

  function withLoading(request) {
    if (request instanceof Promise) {
      return new Promise((reslove, reject) => {
        setLoading(true)
        request.then(res => {
          reslove(res)
          setLoading(false)
        }).catch(e => {
          reject(e)
          setLoading(false)
        })
      })
    }
  }

  return [loading, withLoading]
}

