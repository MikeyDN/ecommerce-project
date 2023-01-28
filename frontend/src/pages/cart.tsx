import { useCart } from 'react-use-cart'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import CartView from '../components/CartView'
import Link from 'next/link'
import { Button } from 'react-bootstrap'

function cartPageComponent() {
  const { totalItems } = useCart()

  return (
    <>
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
          <Button className="cart-pay-button">Checkout</Button>
        </div>
      </motion.div>
    </>
  )
}
export default dynamic(() => Promise.resolve(cartPageComponent), { ssr: false })
