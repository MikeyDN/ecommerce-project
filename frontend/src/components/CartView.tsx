import Image from 'next/image'
import { useCart } from 'react-use-cart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faAdd, faMinus } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { PanInfo } from 'framer-motion'
import CartTotal from './CartTotal'
import { calculateShipping } from '../lib/shipping'
import { Button } from 'react-bootstrap'
import cart from '../pages/cart'

export default function CartView() {
  const {
    isEmpty,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
  } = useCart()

  const controls = useDragControls()

  const shippingCost = calculateShipping('IL')
  const remove = (slug: string) => {
    return (event: PointerEvent, info: PanInfo) => {
      if (info.offset.x < -200 && info.delta.x > -3) {
        removeItem(slug)
      }
    }
  }
  return (
    <>
      <div className="cart-items">
        <ul>
          <AnimatePresence mode="sync" initial={false}>
            {items.map((item, index) => (
              <motion.li
                key={item.slug}
                itemID={item.slug}
                id={item.slug}
                animate={{ x: 0, scale: 1 }}
                exit={{ x: -1000, y: -10, scale: 0 }}
                transition={{ duration: 0.4 }}
                drag="x"
                dragControls={controls}
                onDragEnd={remove(item.slug)}
                dragConstraints={{ left: 0, right: 0 }}
              >
                <div style={{ display: 'flex' }}>
                  <div className="cart-item-image">
                    <Image
                      src={item.images[0]}
                      alt={item.id}
                      fill
                      style={{ objectFit: 'scale-down', background: 'white' }}
                      sizes="(min-width: 1080px) 300px,
                            1080px"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-name">
                      <h4>{item.title}</h4>
                    </div>
                    <div className="cart-item-price">Price: {item.price}$</div>
                    <div className="cart-item-quantity">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="cart-item-control">
                  <Button
                    className="cart-item-control-button"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity! - 1)
                    }
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <Button
                    className="cart-item-control-button"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity! + 1)
                    }
                  >
                    <FontAwesomeIcon icon={faAdd} />
                  </Button>
                  <Button
                    className="cart-item-control-button"
                    onClick={() => removeItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="vl mobile-hidden" />
      <CartTotal />
    </>
  )
}
