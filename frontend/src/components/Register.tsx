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
    const response = await publicClient.register({ phone, name, email })
    if (!response.error) {
      setShowInput(true)
    } else {
      setError(response.error.message)
    }
  }

  const verifyOtp = async () => {
    const response = await publicClient.verifyOtp(phone, otpCode)
    if (!response.error) {
      // success
      setCookie('token', response.token)
      setSuccess(true)
      setTimeout(() => {
        setShowRegister(false)
      }, 1000)
    } else if (response.error.status === 404) {
      // No user with given phone number found
      setError('No user with given phone number found, please register first')
    } else {
      // error
      setError(response.error.message)
    }
  }

  return (
    <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Phone Verified! Continue with your order
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
        <Button onClick={register}>Send verification code</Button>
        {showInput && (
          <>
            <input type="text" onChange={(e) => setOtpCode(e.target.value)} />
            <Button onClick={verifyOtp}>Verify OTP Code</Button>
          </>
        )}
      </form>
    </Modal.Body>
  )
}
