import { useCart } from 'react-use-cart'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import CartView from '../components/Cart/CartView'
import CartTotal from '../components/Cart/CartTotal'
import { Button, Modal } from 'react-bootstrap'
import Checkout from '../components/Cart/Checkout'
import useAuth from '../lib/useAuth'
import CheckoutButton from '../components/Utils/CheckoutButton'

function cartPageComponent() {
  const { totalItems } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <>
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)}>
        <Modal.Header>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CartTotal />
          <Checkout />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckout(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="cart-page">
        <CartView />
      </div>
      <motion.div
        style={{
          position: 'fixed',
          bottom: '73px',
          width: '100%',
          height: '50px',
        }}
        key="cart-checkout"
        initial={{ y: 200, position: 'fixed' }}
        animate={{ y: 0 }}
        transition={{ ease: 'easeOut', duration: 0.5 }}
        className="cart-checkout"
      >
        <div className="cart-total-items">
          Total items: <span id="checkout-items">{totalItems}</span>
        </div>
        <div className="cart-pay">
          <CheckoutButton
            className="cart-pay-button"
            checkoutState={[showCheckout, setShowCheckout]}
          />
        </div>
      </motion.div>
    </>
  )
}
export default dynamic(() => Promise.resolve(cartPageComponent), { ssr: false })
