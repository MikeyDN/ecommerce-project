import {
  Product,
  Category,
  Order,
  OrderClient,
  ApiResponse,
  Review,
  WebsiteSettings,
  ImageSetting,
  TextSetting,
} from './types'

export const buildImages = (product: Product) => {
  product.images = product.images?.map((image) => {
    return process.env.NEXT_PUBLIC_BACKEND_URL + image
  })
  return product
}

export class RootClient {
  serverUrl: string | undefined
  constructor(serverUrl: string = 'http://localhost:8000') {
    this.serverUrl = serverUrl
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
    if (res.status == 400) {
      return {
        error: { status: res.status, message: retval['error'] },
      } as Order
    }
    if (res.status != 201) {
      return { error: { status: res.status, message: res.statusText } } as Order
    }

    return retval as Order
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

  async getProducts() {
    let retval
    const res = await fetch(`${this.serverUrl}/content/products/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = await res.json()
    retval = retval.map((product: Product) => {
      return buildImages(product)
    }) as Product[]
    return { response: retval } as ApiResponse
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

  async getProduct(slug: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/content/products/${slug}/`)
    retval = (await res.json()) as Product
    retval = buildImages(retval)
    return retval
  }

  async getCategories() {
    let retval
    const res = await fetch(`${this.serverUrl}/content/categories/`)
    retval = await res.json()
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = retval.map((category: Category) => {
      category.products = category.products?.map((product) => {
        return buildImages(product)
      })
      return category
    })
    return { response: retval } as ApiResponse
  }

  async getCategory(slug: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/content/categories/${slug}/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = (await res.json()) as Category
    retval.products = retval.products?.map((product) => {
      return buildImages(product)
    })
    return { response: retval } as ApiResponse
  }

  async getOrders() {
    let retval
    const res = await fetch(`${this.serverUrl}/orders/`)
    retval = (await res.json()) as Order[]
    return retval
  }

  async getOrder(order_id: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/orders/${order_id}/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: 'No Auth token' },
      } as Order
    }
    retval = (await res.json()) as Order
    return retval
  }

  async sendOtp(phone: string) {
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth token' } } as OrderClient
    }
    let retval
    const res = await fetch(`${this.serverUrl}/orders/otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
      body: JSON.stringify({ phone }),
    })
    retval = await res.json()
    if (res.status != 201) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OrderClient
    }
    return retval
  }

  async deleteClient(phone: string) {
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth token' } } as OrderClient
    }
    let retval
    const res = await fetch(`${this.serverUrl}/orders/clients/${phone}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
    })
    retval = await res.json()
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OrderClient
    }
    return retval
  }

  async verifyOtp(phone: string, otp: string) {
    if (!process.env.BACKEND_AUTH_TOKEN) {
      return { error: { status: 500, message: 'No Auth token' } } as OrderClient
    }
    let retval
    const res = await fetch(`${this.serverUrl}/orders/otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: process.env.BACKEND_AUTH_TOKEN,
      },
      body: JSON.stringify({ phone, otp }),
    })
    retval = await res.json()
    if (res.status != 201) {
      return {
        error: { status: res.status, message: res.statusText },
      } as OrderClient
    }
    return retval
  }

  async getPromotedProducts() {
    let retval
    const res = await fetch(`${this.serverUrl}/website/promoted/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = await res.json()
    retval = retval.map((product: Product) => {
      return buildImages(product)
    }) as Product[]
    return { response: retval } as ApiResponse
  }

  async getReviews() {
    let retval
    const res = await fetch(`${this.serverUrl}/orders/reviews/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = (await res.json()) as Review[]
    return { response: retval } as ApiResponse
  }

  async getSettings() {
    let retval
    const res = await fetch(`${this.serverUrl}/website/settings/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = (await res.json()) as WebsiteSettings
    return { response: retval } as ApiResponse
  }

  async getImageSettings() {
    let retval
    const res = await fetch(`${this.serverUrl}/website/settings/images/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = (await res.json()) as ImageSetting[]
    return { response: retval } as ApiResponse
  }

  async getTextSettings() {
    let retval
    const res = await fetch(`${this.serverUrl}/website/settings/text/`)
    if (res.status != 200) {
      return {
        error: { status: res.status, message: res.statusText },
      } as ApiResponse
    }
    retval = (await res.json()) as TextSetting[]
    return { response: retval } as ApiResponse
  }
}

export const rootClient = new RootClient('http://localhost:8000')
