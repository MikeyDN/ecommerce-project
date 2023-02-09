import { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../../lib/ApiClient'
import { Order } from '../../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const token = req.headers.authentication as string
    const order = req.body as Order
    const response = await publicClient.createOrder(order, token)
    if (!response.error) {
      res.status(201).json(response)
    } else {
      res.status(500).json(response)
    }
  }
}
