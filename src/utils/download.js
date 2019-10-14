import { API_BASE_URL } from '@/config'
import { getToken } from '@/utils'

export default function download(router) {
  const $a = document.createElement('a')
  const token = getToken()
  $a.href = token ? `${API_BASE_URL}${router}?token=${token}` : `${API_BASE_URL}${router}`
  document.body.appendChild($a)
  $a.click()
  document.body.removeChild($a)
}
