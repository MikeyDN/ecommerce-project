import { useRef, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Product } from '../lib/types'
import { Button, Overlay, Tooltip } from 'react-bootstrap'
import { useCart } from 'react-use-cart'

type productViewProps = {
  product: Product
}
export function AddToCartIcon(props: productViewProps) {
  props.product.id = props.product.slug
  const { addItem } = useCart()
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState(undefined), [])
  const [isVisible, setIsVisible] = useState(false)
  const target = useRef(null)

  const handleClick = () => {
    addItem(props.product)
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
