import { FormEvent, useState } from 'react'
import { useCart } from 'react-use-cart'
import { Modal, Button } from 'react-bootstrap'
import { publicClient } from '../lib/ApiClient'
import { useCookies } from 'react-cookie'
import { Order, OrderClient } from '../lib/types'
import Register from './Register'
import Login from './Login'

export default function Checkout({
  destination,
  client,
}: {
  destination: string
  client: OrderClient
}) {
  // cart stuff
  const { items, emptyCart } = useCart()
  // cookies stuff
  const [cookies] = useCookies(['token'])
  // form stuff
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [isSent, setIsSent] = useState(false)
  var currentForm = document.forms[0]

  const handleClose = () => {
    setShow(false)
    setIsSent(false)
    setErr('')
  }
  const handleShow = () => {
    setShow(true)
  }

  const sendOrder = async (e: FormEvent) => {
    e.preventDefault()
    handleClose()
    const products = items.map((item) => {
      return {
        slug: item.id,
        quantity: item.quantity,
      }
    })
    try {
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
      } else if ('address' in response) {
        setErr('')
        setIsSent(true)
        emptyCart()
        handleShow()
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
          <div id="client-info">
            <h3>Client Info</h3>
            <p>Name: {client.name}</p>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
          </div>
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

            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          {isSent && <Modal.Title>Order Sent</Modal.Title>}
          {err && <Modal.Title>Error</Modal.Title>}
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
