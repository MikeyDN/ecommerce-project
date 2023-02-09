import { OrderClient, Order, OtpResponse, RegisterResponse } from './types'
import { server } from '../../config'

export class ApiClient {
  serverUrl: string | undefined
  constructor(serverUrl: string = 'http://localhost:8000') {
    this.serverUrl = serverUrl
  }

  async register(client: OrderClient) {
    let retval
    const res = await fetch(`${server}/api/orders/clients/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    })
    retval = await res.json()

    return retval as RegisterResponse
  }

  async getClient(phone: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/orders/clients/${phone}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OrderClient
    }
    retval = await res.json()

    return retval as OrderClient
  }

  async createClient(client: OrderClient) {
    let retval
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth token' } } as OrderClient
    }
    const clientExists = await this.doesClientExist(client.phone!)
    if (clientExists) {
      return {
        error: { status: 409, message: 'Client already exists' },
      } as OrderClient
    }
    const res = await fetch(`${this.serverUrl}/orders/clients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
      body: JSON.stringify(client),
    })
    retval = await res.json()
    if (res.status != 201) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OrderClient
    }

    return retval as OrderClient
  }

  async createOrder(order: Order, token: string) {
    let retval
    const payload: any = order
    payload.client = order.client?.id
    const res = await fetch(`${this.serverUrl}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: token,
      },
      body: JSON.stringify(payload),
    })
    retval = await res.json()
    if (res.status != 201) {
      return { error: { status: res.status, message: res.statusText } } as Order
    }

    return retval as Order
  }

  async sendOtp(phone: string) {
    let retval
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth token' } } as OtpResponse
    }
    const payload = { phone: phone }
    const res = await fetch(`${this.serverUrl}/api/orders/otp/sendotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
      body: JSON.stringify(payload),
    })
    if (res.status != 201) {
      return {
        error: { status: res.status, message: JSON.stringify(res.body) },
      } as OtpResponse
    }
    retval = (await res.json()) as OtpResponse
    return retval
  }

  async verifyOtp(phone: string, otp: string) {
    let retval
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth Token' } } as OtpResponse
    }
    const res = await fetch(`${this.serverUrl}/api/orders/otp/verifyotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },

      body: JSON.stringify({ phone, otp }),
    })
    if (res.status != 201) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OtpResponse
    }
    retval = (await res.json()) as OtpResponse
    return retval
  }

  async doesClientExist(phone: string) {
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth Token' } } as OrderClient
    }
    const res = await fetch(`${this.serverUrl}/orders/clients/${phone}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
    })
    if (res.status == 404) {
      return false
    }
    return true
  }
}

export const publicClient = new ApiClient('http://localhost:8000')
