import { NextApiRequest, NextApiResponse } from 'next'
import { rootClient } from '../../../../lib/RootClient'
import { OrderClient } from '../../../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == 'POST') {
    const body = req.body as OrderClient
    if (!body.phone || !body.name || !body.email) {
      res.status(400).json({ message: 'Bad Request' })
      return
    }
    const phone = body.phone
    const name = body.name
    const email = body.email
    const response = await rootClient.createClient({ phone, name, email })
    if (!response.error) {
      res.status(201).json(response)
    } else {
      await rootClient.deleteClient(phone)
      res.status(response.error.status).json(response)
    }
  }
}
