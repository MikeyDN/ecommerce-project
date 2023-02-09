import { Product, Category, Order } from './types'

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

  async getProducts() {
    let retval
    const res = await fetch(`${this.serverUrl}/content/products/`)
    retval = (await res.json()) as Product[]
    retval = retval.map((product) => {
      return buildImages(product)
    })
    return retval
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
    retval = (await res.json()) as Category[]
    retval = retval.map((category) => {
      category.products = category.products?.map((product) => {
        return buildImages(product)
      })
      return category
    })
    return retval
  }

  async getCategory(slug: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/content/categories/${slug}/`)
    if (res.status != 200) {
      return {
        status: res.status,
        error: true,
        message: `Categories:\n${res.statusText}`,
      } as Category
    }
    retval = (await res.json()) as Category
    retval.products = retval.products?.map((product) => {
      return buildImages(product)
    })
    return retval
  }

  async getOrders() {
    let retval
    const res = await fetch(`${this.serverUrl}/orders/`)
    retval = (await res.json()) as Order[]
    return retval
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
}

export const privateClient = new RootClient('http://localhost:8000')
