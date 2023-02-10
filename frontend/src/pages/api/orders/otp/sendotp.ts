import { NextApiRequest, NextApiResponse } from 'next'
import { rootClient } from '../../../../lib/RootClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const phone = req.body.phone
    const response = await rootClient.sendOtp(phone)
    if (response.status) {
      res.status(201).json(response)
    } else {
      res.status(500).json(response)
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
