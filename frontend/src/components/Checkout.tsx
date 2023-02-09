import { FormEvent, useEffect, useState } from 'react'
import { useCart } from 'react-use-cart'
import { Modal, Button } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import { useCookies } from 'react-cookie'
import { Order } from '../lib/types'
import Register from './Register'
import Login from './Login'
import { countryCodes } from '../lib/phonecodes'
import {
  Combobox,
  useComboboxState,
  ComboboxPopover,
  ComboboxItem,
} from 'ariakit'

export default function Checkout({ destination }: { destination: string }) {
  // cart stuff
  const { items, emptyCart } = useCart()
  // cookies stuff
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [cookies] = useCookies(['token'])
  // form stuff
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [isSent, setIsSent] = useState(false)
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })
  if (phone.startsWith('0')) {
    setPhone(phone.slice(1))
  }
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const sendOrder = async (e: FormEvent) => {
    e.preventDefault()
    setIsSent(false)
    setErr('')
    const products = items.map((item) => {
      return {
        slug: item.id,
        quantity: item.quantity,
      }
    })
    const client = await publicClient.getClient(combobox.value + phone)
    if (!client.phone) {
      setShowRegister(true)
      handleShow()
      return
    }
    try {
      // Check if user is logged in
      if (!('token' in cookies)) {
        if (!client) {
          setShowRegister(true)
          handleShow()
        } else {
          const response = await publicClient.sendOtp(combobox.value + phone)
          if (response) {
            setShowLogin(true)
            handleShow()
          }
        }
      } else {
        const order = {
          address,
          city,
          zipcode,
          products,
          client,
        } as Order
        const response = await publicClient.createOrder(order, cookies.token)
        if (response.error) {
          setErr(response.error.message)
          handleShow()
          return
        } else if ('address' in response) {
          setErr('')
          setIsSent(true)
          emptyCart()
          handleShow()
        }
      }
    } catch (e: any) {
      setErr(e.message)
      handleShow()
      console.error(e)
      return
    }
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-form">
          <h1>Checkout</h1>
          <form onSubmit={sendOrder}>
            <input
              className="combobox"
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              className="combobox"
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              className="combobox"
              type="text"
              name="zipcode"
              placeholder="Zip Code"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Combobox
                state={combobox}
                placeholder="e.g., Apple"
                className="combobox"
                style={{ width: '35%' }}
              />
              <ComboboxPopover state={combobox} className="popover">
                {combobox.matches.length ? (
                  combobox.matches.map((value) => (
                    <ComboboxItem
                      key={value}
                      value={value}
                      className="combobox-item"
                    />
                  ))
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </ComboboxPopover>
              <input
                className="combobox"
                type="text"
                name="phone"
                placeholder="Phone"
                value={phone}
                maxLength={10}
                style={{ width: '62%' }}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          {isSent && <Modal.Title>Order Sent</Modal.Title>}
          {err && <Modal.Title>Error</Modal.Title>}
          {showLogin && <Modal.Title>Phone verification</Modal.Title>}
          {showRegister && <Modal.Title>Register</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
          {isSent && (
            <div>
              <p>Thank you for your order!</p>
              <p>You will receive an email with your order details.</p>
            </div>
          )}
          {err && (
            <div>
              <p>There was an error sending your order.</p>
              <p>Please try again later.</p>
              <p>{err}</p>
            </div>
          )}
          {showRegister && (
            <Register
              phone={combobox.value + phone}
              setShowRegister={setShowRegister}
            />
          )}
          {showLogin && (
            <Login phone={combobox.value + phone} setShowLogin={setShowLogin} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
