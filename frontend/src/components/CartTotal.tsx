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

type checkoutPropsType = {
  initial: { x?: number; y?: number; zIndex?: number; opacity?: number }
  animate: { x?: number; y?: number; zIndex?: number; opacity?: number }
  exit: { x?: number; y?: number; zIndex?: number; opacity?: number }
}

export default function CartTotal() {
  const [destination, setDestination] = useState('Israel')
  const { cartTotal, items } = useCart()
  const [checkout, setCheckout] = useState(false)
  const [checkoutProps, setCheckoutProps] = useState<checkoutPropsType>({
    initial: { x: -20, y: 0 },
    animate: { x: -310, y: 0 },
    exit: { x: -20, y: 0 },
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

  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryList,
    defaultValue: 'Israel',
  })

  useEffect(() => {
    const combox = document.getElementById(
      'shipping-selector',
    ) as HTMLInputElement
    setDestination(combox.value)
  }, [combobox])

  return (
    <>
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
          <Button
            className="checkout-button"
            onClick={() => {
              setCheckout(!checkout)
            }}
          >
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
              <Checkout destination={destination} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
