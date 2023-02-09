import { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../../../lib/ApiClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'GET') {
    const phone = req.query.phone as string
    const response = await publicClient.getClient(phone)
    if (!response.error) {
      res.status(200).json(response)
    } else {
      res.status(500).json(response)
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
