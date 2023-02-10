import { FormEvent, useEffect, useState } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import { useCookies } from 'react-cookie'
import { OrderClient, OtpResponse } from '../lib/types'

type registerResponse = {
  response: OrderClient
  otpResponse: OtpResponse
}

export default function Register({
  phone,
  setShowRegister,
}: {
  phone: string
  setShowRegister: any
}) {
  const [showInput, setShowInput] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [phoneNumber, setPhone] = useState(phone)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorCode, setErrorCode] = useState(0)

  const register = async () => {
    setError('')
    setSuccess(false)
    const response = await publicClient.register({ phone, name, email })
    if (!response.error) {
      setSuccess(true)
    } else {
      setError(response.error.message)
    }
  }

  return (
    <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Phone Verified! You can log in now!
        </Alert>
      )}
      <form>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="eMail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={register}>Register</Button>
      </form>
    </Modal.Body>
  )
}
