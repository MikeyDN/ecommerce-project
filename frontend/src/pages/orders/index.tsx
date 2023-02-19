import React, { useEffect, useState } from 'react'
import useAuth from '../../lib/useAuth'
import { publicClient } from '../../lib/ApiClient'
import { Order } from '../../lib/types'
import NoSsr from '../../components/Utils/NoSsr'
import { useRouter } from 'next/router'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()
  useEffect(() => {
    if (user.orders) {
      setOrders(user.orders)
    }
  }, [user])

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }
  return (
    <NoSsr>
      <div>
        <h1 style={{ width: 'fit-content', margin: 'auto', paddingBottom: 50 }}>
          Orders
        </h1>
        <table id="orders-table" className="table">
          <tr>
            <th>Order ID</th>
            <th>Address</th>
            <th>City</th>
            <th>Order Total</th>
          </tr>
          {orders.map((order) => (
            <tr onClick={(e) => handleOrderClick(order.order_id!)}>
              <th>{order.order_id}</th>
              <th>{order.address}</th>
              <th>{order.city}</th>
              <th>${order.total}</th>
            </tr>
          ))}
        </table>
      </div>
    </NoSsr>
  )
}
