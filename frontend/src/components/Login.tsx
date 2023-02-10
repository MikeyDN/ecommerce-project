import { FormEvent, useEffect, useState } from 'react'
import { useCart } from 'react-use-cart'
import { useRouter } from 'next/router'
import { Modal, Button, Alert } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import { useCookies } from 'react-cookie'

export default function Login({
  phone,
  setShowLogin,
}: {
  phone: string
  setShowLogin: any
}) {
  const [showInput, setShowInput] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [errorCode, setErrorCode] = useState(0)
  const [success, setSuccess] = useState(false)

  const verifyOtp = async () => {
    setSuccess(false)
    setError('')
    const response = await publicClient.verifyOtp(phone, otpCode)
    if (!response.error) {
      // success
      setSuccess(true)
      setCookie('token', response.token)
    } else if (errorCode === 1) {
      // No user with given phone number found
      setError('No user with given phone number found, please register first')
    } else {
      // error
      setError(response.error.message)
    }
  }

  return (
    <Modal.Body>
      <Alert show={success} variant="success">
        <Alert.Heading>Success!</Alert.Heading>
      </Alert>
      <Alert show={error.length > 0} variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
      <p>We've sent a verification code to your phone</p>
      <form style={{ display: 'flex' }}>
        <input
          className="combobox"
          style={{ margin: 'auto', width: '50%' }}
          type="text"
          placeholder="Put it down here"
          onChange={(e) => setOtpCode(e.target.value)}
        />
        <Button
          className="combobox"
          style={{ width: '50%' }}
          onClick={verifyOtp}
        >
          Verify OTP Code
        </Button>
      </form>
    </Modal.Body>
  )
}
