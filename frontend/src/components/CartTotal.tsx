import { useCart } from 'react-use-cart'
import { useEffect, useState } from 'react'
import { calculateShipping } from '../lib/shipping'
import { countryList } from '../lib/countries'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from 'react-bootstrap'
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from 'ariakit/combobox'
import Checkout from './Checkout'
import { useCookies } from 'react-cookie'
import { OrderClient } from '../lib/types'
import { Modal } from 'react-bootstrap'
import Register from './Register'
import Login from './Login'

type checkoutPropsType = {
  initial: { x?: number; y?: number; zIndex?: number; opacity?: number }
  animate: { x?: number; y?: number; zIndex?: number; opacity?: number }
  exit: { x?: number; y?: number; zIndex?: number; opacity?: number }
}

export default function CartTotal() {
  const [cookies] = useCookies(['token'])
  const [show, setShow] = useState(false)
  const [destination, setDestination] = useState('Israel')
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [client, setClient] = useState<OrderClient>({
    error: { message: 'client not found', status: 404 },
  })
  const { cartTotal, items } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [checkoutProps, setCheckoutProps] = useState<checkoutPropsType>({
    initial: { x: -20, y: 0 },
    animate: { x: -310, y: 0 },
    exit: { x: -20, y: 0 },
  })
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryList,
    defaultValue: 'Israel',
  })

  useEffect(() => {
    if (window.innerWidth < 991.8) {
      // setCheckoutProps({
      //   initial: { x: -50, y: -350 },
      //   animate: { x: -50, y: -700 },
      //   exit: { x: -50, y: -350 },
      // })
      setCheckoutProps({
        initial: { x: 140, zIndex: 100, y: -400, opacity: 0 },
        animate: { x: 140, zIndex: 100, y: -400, opacity: 1 },
        exit: { x: 140, zIndex: 100, y: -400, opacity: 0 },
      })
    } else {
      setCheckoutProps({
        initial: { x: -20, y: 0 },
        animate: { x: -310, y: 0 },
        exit: { x: -20, y: 0 },
      })
    }
  }, [window.innerWidth])

  useEffect(() => {
    const combox = document.getElementById(
      'shipping-selector',
    ) as HTMLInputElement
    setDestination(combox.value)
  }, [combobox])

  const handleCheckout = () => {
    if (!cookies.token) {
      setShowLogin(true)
      handleShow()
      return
    }
    setCheckout(true)
  }

  const handleClose = () => {
    setShow(false)
    setShowLogin(false)
    setShowRegister(false)
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
      <div
        style={{ marginLeft: '2vw', position: 'relative', zIndex: 92 }}
        className="beautiful-box cart-total-wrapper"
      >
        <div style={{ position: 'relative', zIndex: 100 }}>
          <div
            className="beautiful-box"
            id="cart-total"
            style={{ position: 'relative', zIndex: 101 }}
          >
            <ul>
              <li>
                <span>Unique products:</span> {items.length}
              </li>
              <li>
                <span>Cart price:</span> {cartTotal}$
              </li>
              <li>
                <span>Shipping cost:</span> {calculateShipping(destination)}$
              </li>
              <li>
                <span>Total Cost:</span>{' '}
                {cartTotal + calculateShipping(destination)}$
              </li>
            </ul>
          </div>
          <hr />
          <div className="combobox-wrapper">
            <label className="beautiful-box">
              Country:
              <Combobox
                state={combobox}
                placeholder="e.g., Apple"
                className="combobox"
                id="shipping-selector"
              />
            </label>
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
          </div>
          <Button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>
      <div
        style={{
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {checkout && (
            <motion.div
              initial={checkoutProps.initial}
              animate={checkoutProps.animate}
              exit={checkoutProps.exit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 50,
                position: 'absolute',
                right: 0,
              }}
              transition={{ duration: 0.2 }}
              className="beautiful-box"
            >
              <Checkout destination={destination} client={client} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
