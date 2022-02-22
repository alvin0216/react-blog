import { useCallback, useState } from 'react'

export default function useModal() {
  const [visible, setVisible] = useState(true)
  const show = useCallback(() => setVisible(true), [visible])
  const close = useCallback(() => setVisible(false), [visible])

  const modalProps = {
    visible,
    onCancel: close
  }

  return {
    visible,
    show,
    close,
    modalProps
  }
}
