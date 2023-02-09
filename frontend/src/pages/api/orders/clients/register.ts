import { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../../../lib/ApiClient'
import { OrderClient } from '../../../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const body = req.body as OrderClient
    const phone = body.phone
    const name = body.name
    const email = body.email
    const response = await publicClient.createClient({ phone, name, email })
    if (!response.error) {
      const otpResponse = await publicClient.sendOtp(phone!)
      if (!otpResponse.error) {
        res.status(201).json({ response, otpResponse })
      } else {
        res.status(otpResponse.error.status).json(response)
      }
    } else {
      res.status(response.error.status).json(response)
    }
  }
}
