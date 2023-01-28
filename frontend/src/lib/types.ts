export type Product = {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  created_at: string
  updated_at: string
  slug: string
  images: string[]
  category: {
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
  id: number
  name: string
  slug: string
  products: Product[]
}

export type Promoted = {
  smallTitle: string
  title: string
  product: Product
  image: SanityImage
}
