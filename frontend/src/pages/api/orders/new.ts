import { NextApiRequest, NextApiResponse } from 'next'
import { rootClient } from '../../../lib/RootClient'
import { Order } from '../../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const token = req.headers.authentication as string
    const order = req.body as Order
    const response = await rootClient.createOrder(order, token)
    if (!response.error) {
      res.status(201).json(response)
    } else {
      res.status(response.error.status).json(response)
    }
  }
}
