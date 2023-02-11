import { useRef, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { Product } from '../lib/types'
import { Button, Overlay, Tooltip } from 'react-bootstrap'
import { useCart } from 'react-use-cart'
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from 'ariakit'
import { countryCodes } from '../lib/phonecodes'

type propsType = {
  product: Product
}
export function AddToCartIcon({ product }: propsType) {
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

export function PhoneInput({
  value,
  setPhone,
}: {
  value: string
  setPhone: Function
}) {
  const combobox = useComboboxState({
    gutter: 4,
    sameWidth: true,
    list: countryCodes.map((country) => country.dial_code),
    defaultValue: '+972',
  })
  const phone = value.slice(combobox.value.length)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    var onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.startsWith('0')) {
      setPhone(combobox.value + onlyNums.slice(1))
    } else {
      setPhone(combobox.value + onlyNums)
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Combobox
        state={combobox}
        placeholder="e.g., Apple"
        className="combobox"
        style={{ width: '17.5%' }}
      />
      <ComboboxPopover state={combobox} className="popover">
        {combobox.matches.length ? (
          combobox.matches.map((value) => (
            <ComboboxItem key={value} value={value} className="combobox-item" />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </ComboboxPopover>
      <input
        className="combobox"
        type="text"
        name="phone"
        placeholder="Phone Number"
        maxLength={10}
        style={{ width: '40%' }}
        value={phone}
        onChange={handleChange}
        required
      />
    </div>
  )
}
