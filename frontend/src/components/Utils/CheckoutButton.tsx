import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import useAuth from '../../lib/useAuth'

export default function CheckoutButton({
  checkoutState,
  className = '',
}: {
  checkoutState: [checkout: boolean, setShowCheckout: (value: boolean) => void]
  className?: string
}) {
  const [showCheckout, setShowCheckout] = checkoutState
  const { user, setUser } = useAuth()
  const [show, setShow] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleCheckout = () => {
    if (showCheckout) {
      setShowCheckout(false)
      return
    }
    if (!user.error) setShowCheckout(true)
    else if (user.error) {
      setShow(true)
      setShowLogin(true)
    }
  }

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      setShowLogin(false)
      setShowRegister(false)
    }, 500)
  }
  const handleShow = () => setShow(true)

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          {showLogin && (
            <>
              <Modal.Title>
                {showLogin && <>Login</>}
                {showRegister && <>Register</>}
              </Modal.Title>
              <Button
                onClick={() => {
                  setShowLogin(!showLogin)
                  setShowRegister(!showRegister)
                }}
              >
                {!showLogin && <>Login</>}
                {!showRegister && <>Register</>}
              </Button>
            </>
          )}
          {showRegister && (
            <>
              <Modal.Title>Register</Modal.Title>
              <Button
                onClick={() => {
                  setShowLogin(true)
                  setShowRegister(false)
                }}
              >
                Log in
              </Button>
            </>
          )}
        </Modal.Header>
        <Modal.Body>
          {showRegister && (
            <Register
              setShowRegister={setShowRegister}
              setShowLogin={setShowLogin}
            />
          )}
          {showLogin && <Login handleClose={handleClose} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Button className={className} onClick={handleCheckout}>
        Checkout
      </Button>
    </>
  )
}
