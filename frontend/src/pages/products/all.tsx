import React from 'react'
import { Product } from '../../lib/types'
import ProductView from '../../components/ProductView'
import { getProducts } from '../../lib/cache'

export async function getServerSideProps(context: any) {
  const products: Product[] = await getProducts()
  return {
    props: {
      products,
      backendUrl: process.env.BACKEND_URL,
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
        <ProductView product={product} key={index} backendUrl={backendUrl} />
      ))}
    </div>
  )
}

export default allProducts
