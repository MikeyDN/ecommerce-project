import { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../../../lib/ApiClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const phone = req.body.phone
    const otpCode = req.body.otpCode
    const response = await publicClient.verifyOtp(phone, otpCode)
    if (response.status) {
      res.status(201).json(response)
    } else {
      res.status(500).json(response)
    }
  }
}
