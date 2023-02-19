import React, { useState, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Button, Overlay, Tooltip } from 'react-bootstrap'
import { useCart } from 'react-use-cart'
import { Product } from '../../lib/types'

export function AddToCartIcon({ product }: { product: Product }) {
  const [product_, setProduct] = useState(product)
  const { addItem } = useCart()
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState(undefined), [])
  const [isVisible, setIsVisible] = useState(false)
  const target = useRef(null)

  const handleClick = () => {
    product_.id = product.slug
    addItem(product_)
    setIsVisible(!isVisible)
    setTimeout(() => {
      setIsVisible(false)
    }, 1500)
  }

  return (
    <>
      <Button ref={target} className="cart-icon" onClick={handleClick}>
        <FontAwesomeIcon icon={faShoppingCart} />
      </Button>
      <Overlay target={target.current} show={isVisible} placement="top">
        {(props) => (
          <Tooltip id="added-to-cart" {...props}>
            Added to cart!
          </Tooltip>
        )}
      </Overlay>
    </>
  )
}
