import { FormEvent, useEffect, useState } from 'react'
import { useCart } from 'react-use-cart'
import { useRouter } from 'next/router'
import { Modal, Button } from 'react-bootstrap'

export default function Checkout({ destination }: { destination: string }) {
  const { addItem, removeItem, emptyCart, cartTotal } = useCart()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [userResponse, setUserResponse] = useState('')
  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const sendOrder = async (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-form">
          <h1>Checkout</h1>
          <form onSubmit={sendOrder} action="#">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              name="g-recaptcha-response"
              type="hidden"
              value=""
              onChange={(e) => {
                setUserResponse(e.target.value)
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Sent</Modal.Title>
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
