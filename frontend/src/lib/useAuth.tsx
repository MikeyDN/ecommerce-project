import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { OrderClient } from './types'
import { publicClient } from './ApiClient'

export default function useAuth() {
  const defaultValue = { error: { message: 'Client Not Found', status: 404 } }

  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [user, setUser] = useState<OrderClient>(defaultValue)

  const removeUser = () => {
    removeCookie('token', { path: '/' })
    setUser(defaultValue)
  }

  useEffect(() => {
    if (!cookies.token) {
      setUser(defaultValue)
      return
    }
    const { phone } = JSON.parse(
      Buffer.from(cookies.token.split('.')[1], 'base64').toString('utf8'),
    )
    publicClient.getClient(phone).then((res) => {
      if (res.error) removeUser()
      else {
        res.token = cookies.token
        setUser(res)
      }
    })
  }, [cookies.token])

  return { user, setUser }
}
