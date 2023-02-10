import { OrderClient, Order, OtpResponse, RegisterResponse } from './types'
import { server } from '../../config'

export class ApiClient {
  serverUrl: string | undefined
  constructor(serverUrl: string = 'http://localhost:8000') {
    this.serverUrl = serverUrl
  }

  async getClient(phone: string) {
    let retval
    const res = await fetch(`${server}/api/orders/clients/${phone}`)
    if (res.status != 200) {
      return { error: { status: res.status, message: res.statusText } } as OrderClient
    }
    retval = await res.json()

    return retval as OrderClient
  }

  async register(client: OrderClient) {
    let retval
    const res = await fetch(`${server}/api/orders/clients/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    })
    retval = await res.json()

    return retval as RegisterResponse
  }

 
  async sendOtp(phone: string) {
    let retval
    const payload = { phone: phone }
    const res = await fetch(`${server}/api/orders/otp/sendotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  async createOrder(order: Order, token: string) {
    let retval
    const payload: any = order
    payload.client = order.client.id
    const res = await fetch(`${server}/api/orders/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: token,
      },
      body: JSON.stringify(payload),
    })
    retval = await res.json()
    if (res.status == 400) {
      return {
        error: { status: res.status, message: retval.error.message }
      } as OtpResponse
    }
    if (res.status != 201) {
      return { error: { status: res.status, message: res.statusText } } as Order
    }

    return retval as Order
  }

  async verifyOtp(phone: string, otp: string) {
    let retval
    const res = await fetch(`${server}/api/orders/otp/verifyotp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ phone, otp }),
    })
    if (res.status == 400) {
      return {
        error: { status: res.status, message: JSON.stringify(res.body) },
      } as OtpResponse
    }
    if (res.status != 201) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OtpResponse
    }
    retval = (await res.json()) as OtpResponse
    return retval
  }

}

export const publicClient = new ApiClient('http://localhost:8000')
