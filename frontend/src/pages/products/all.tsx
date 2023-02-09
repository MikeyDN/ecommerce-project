import React from 'react'
import { Product } from '../../lib/types'
import ProductView from '../../components/ProductView'
import cache from '../../lib/cache'

export async function getServerSideProps(context: any) {
  const products: Product[] = await cache.getProducts()
  return {
    props: {
      products,
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
  }
}

const allProducts = ({
  products,
  backendUrl,
}: {
  products: Product[]
  backendUrl: string
}) => {
  if (products == null) return
  return (
    <div className="product-list">
      {products.map((product: Product, index: number) => (
        <ProductView product={product} key={index} />
      ))}
    </div>
  )
}

export default allProducts
