export type Product = {
  error?: BadResponse
  id?: string
  title?: string
  description?: string
  price?: number
  quantity?: number
  created_at?: string
  updated_at?: string
  slug?: string
  images?: string[]
  category?: {
    id: number
    name: string
    slug: string
  }[]
}
export type SanityImage = {
  asset: {
    url: string
  }
  hotspot: {
    x: number
    y: number
    height: number
    width: number
  }
}
export type Category = {
  status?: number
  error?: boolean
  message?: string
  id?: number
  name?: string
  slug?: string
  products?: Product[]
}

export type Promoted = {
  smallTitle: string
  title: string
  product: Product
  image: SanityImage
}

export type OrderClient = {
  id?: number
  name: string
  email: string
  phone: string
  orders?: Order[]
  error?: BadResponse
}

export type Order = {
  error?: BadResponse
  id?: number
  order_id?: string
  address: string
  city: string
  client: OrderClient
  zipcode: string
  products: OrderProduct[]
  completed?: boolean
  payment_completed?: boolean
}

export type OrderProduct = {
  error?: BadResponse
  slug: string
  quantity: number
}

export type BadResponse = {
  status: number
  message: string
}

export type OtpResponse = {
  status?: number
  error?: BadResponse
  client?: OrderClient
  token?: string
}

export type RegisterResponse = {
  client: OrderClient
  otpResponse: OtpResponse
  error?: BadResponse
}
