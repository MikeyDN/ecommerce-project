import { Product, Category } from './types'

export const buildImages = (product: Product) => {
  product.images = product.images.map((image) => {
    return process.env.BACKEND_URL + image
  })
  return product
}

class backendClient {
  serverUrl: string | undefined
  constructor(serverUrl: string | undefined) {
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
    console.log(res)
    retval = (await res.json()) as Category[]
    retval = retval.map((category) => {
      category.products = category.products.map((product) => {
        return buildImages(product)
      })
      return category
    })
    return retval
  }

  async getCategory(slug: string) {
    let retval
    const res = await fetch(`${this.serverUrl}/content/categories/${slug}/`)
    retval = (await res.json()) as Category
    retval.products = retval.products.map((product) => {
      return buildImages(product)
    })
    return retval
  }
}

export const newClient = new backendClient('http://localhost:8000')
