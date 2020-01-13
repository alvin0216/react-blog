import { useState, useCallback } from 'react'

export default function useBoolean(defaultValue = false) {
  const [value, setValue] = useState(defaultValue)

  const setTrue = useCallback(() => setValue(true), [value])
  const setFalse = useCallback(() => setValue(false), [value])

  const toggle = useCallback(() => {
    typeof value === 'boolean' && setValue(value)
  }, [value])

  return { value, setTrue, setFalse, toggle }
}
