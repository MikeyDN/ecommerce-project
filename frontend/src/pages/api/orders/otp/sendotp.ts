import { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../../../lib/ApiClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const phone = req.body.phone
    const response = await publicClient.sendOtp(phone)
    if (response.status) {
      res.status(201).json(response)
    } else {
      res.status(500).json(response)
    }
  }
}
