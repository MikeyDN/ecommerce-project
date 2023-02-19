import React, { useEffect, useState } from 'react'
import useAuth from '../../lib/useAuth'
import { publicClient } from '../../lib/ApiClient'
import { Order } from '../../lib/types'
import { useRouter } from 'next/router'
import NoSsr from '../../components/Utils/NoSsr'
import Image from 'next/image'
import LoadingIcon from '../../components/Utils/LoadingIcon'

export default function OrderPage() {
  const [order, setOrder] = useState<Order | undefined>()
  const router = useRouter()
  const { slug } = router.query
  const { user } = useAuth()
  useEffect(() => {
    if (user.orders) {
      setOrder(user.orders.find((order) => order.order_id === slug))
    }
  }, [user])

  const referToProduct = (slug: string) => {
    router.push(`/products/${slug}`)
  }

  const orderTable = () => {
    return (
      <table id="order-table" className="table">
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
        {order?.products.map((item) => (
          <tr onClick={(e) => referToProduct(item.product?.slug!)}>
            <th>
              <div style={{ width: 50, height: 50 }}>
                <Image
                  priority
                  src={`http://localhost:8000/${item.product!.images[0]}`}
                  alt={item.product!.title}
                  placeholder="blur"
                  blurDataURL="/assets/spin.gif"
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1080) 196px, 
                                            250px"
                />
              </div>
            </th>
            <th>{item.product!.title}</th>
            <th>${item.product!.price}</th>
            <th>{item.quantity}</th>
            <th>${item.product!.price * item.quantity}</th>
          </tr>
        ))}
        <tr style={{ cursor: 'unset' }}>
          <th colSpan={4} style={{ textAlign: 'right' }}>
            {' '}
            Order Total:{' '}
          </th>
          <th>${order?.total}</th>
        </tr>
      </table>
    )
  }

  return (
    <div>
      <h1 style={{ margin: 'auto', width: 'fit-content', paddingBottom: 50 }}>
        Order: {order?.order_id}
      </h1>
      <div id="order-details">
        <ul>
          <li>
            <b>Address: </b>
            {order?.address}
          </li>
          <li>
            <b>City: </b>
            {order?.city}
          </li>
          <li>
            <b>Order Total: </b>${order?.total}
          </li>
        </ul>
      </div>
      <div id="order-items">
        {order?.products && orderTable()}
        {!order?.products && <LoadingIcon />}
      </div>
    </div>
  )
}
