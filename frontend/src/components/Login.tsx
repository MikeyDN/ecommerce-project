import { useState } from 'react'
import {
  Combobox,
  useComboboxState,
  ComboboxPopover,
  ComboboxItem,
} from 'ariakit'
import { Modal, Button, Alert } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import { useCookies } from 'react-cookie'
import { countryCodes } from '../lib/phonecodes'
import { PhoneInput } from './utils'

export default function Login({ handleClose }: { handleClose: Function }) {
  const [showInput, setShowInput] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['token'])
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [errorCode, setErrorCode] = useState(0)
  const [success, setSuccess] = useState(false)
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })

  const sendOtp = async () => {
    setError('')
    const response = await publicClient.sendOtp(phone)
    if (!response.error) {
      setShowInput(true)
    } else {
      setError(response.error.message)
    }
  }
  const verifyOtp = async () => {
    setSuccess(false)
    setError('')
    const response = await publicClient.verifyOtp(phone, otpCode)
    if (!response.error) {
      // success
      setSuccess(true)
      setCookie('token', response.token)
      setTimeout(() => {
        handleClose()
      }, 1000)
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
        <p>Phone verified, you are now logged in!</p>
      </Alert>
      <Alert show={error.length > 0} variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        <p>{error}</p>
      </Alert>
      <p>
        Enter your phone number and verify it so you can continue with your
        purchase
      </p>
      <form>
        <PhoneInput value={phone} setPhone={setPhone} />
        <Button
          className="combobox"
          style={{ marginTop: '1rem' }}
          onClick={sendOtp}
        >
          Send verification
        </Button>
        {showInput && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginTop: '1rem',
            }}
          >
            <input
              className="combobox"
              style={{ width: '40%' }}
              type="text"
              placeholder="Put it down here"
              onChange={(e) => setOtpCode(e.target.value)}
            />

            <Button
              className="combobox"
              style={{ width: '40%' }}
              onClick={verifyOtp}
            >
              Verify OTP Code
            </Button>
          </div>
        )}
      </form>
    </Modal.Body>
  )
}
