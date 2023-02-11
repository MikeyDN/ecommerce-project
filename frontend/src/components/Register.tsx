import { FormEvent, useEffect, useState } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import {
  Combobox,
  useComboboxState,
  ComboboxPopover,
  ComboboxItem,
} from 'ariakit'
import { OrderClient, OtpResponse } from '../lib/types'
import { countryCodes } from '../lib/phonecodes'
import { PhoneInput } from './utils'

type registerResponse = {
  response: OrderClient
  otpResponse: OtpResponse
}

export default function Register({
  setShowRegister,
  setShowLogin,
}: {
  setShowRegister: Function
  setShowLogin: Function
}) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const register = async () => {
    setError('')
    setSuccess(false)
    const response = await publicClient.register({ phone, name, email })
    if (!response.error) {
      setSuccess(true)
      setTimeout(() => {
        setShowRegister(false)
        setShowLogin(true)
      }, 2000)
    } else {
      setError(response.error.message)
    }
  }

  return (
    <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Phone Verified! Redirecting to login</Alert>
      )}
      <form>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          name="email"
          placeholder="eMail"
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '0.5rem' }}
        />
        <PhoneInput setPhone={setPhone} value={phone} />
        <div style={{ marginTop: '0.5rem' }}>
          <Button onClick={register}>Register</Button>
        </div>
      </form>
    </Modal.Body>
  )
}
