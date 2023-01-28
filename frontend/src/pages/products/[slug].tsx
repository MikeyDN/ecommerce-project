import React from 'react'
import { Product } from '../../lib/types'
import Head from 'next/head'
import { Carousel } from 'react-responsive-carousel'
import { AddToCartIcon } from '../../components/utils'
import LoadingIcon from '../../components/LoadingIcon'
import Image from 'next/image'
import cache from '../../lib/cache'

type PageProps = {
  query: {
    slug: string
  }
}

export const getServerSideProps = async (context: PageProps) => {
  const slug = context.query.slug
  const product: Product = await cache.getProduct(slug)
  return {
    props: {
      product,
    },
  }
}

export default function ProductDisplay({ product }: { product: Product }) {
  if (product) {
    return (
      <>
        <Head>
          <title>Buddy's e-Shop</title>
        </Head>

        <div className="content-title">
          <h1>{product.title}</h1>
        </div>
        <div className="product-display">
          <div className="carousel-container">
            <Carousel>
              {product.images.map((image, index) => (
                <div className="image-container">
                  <Image
                    priority
                    src={image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'scale-down' }}
                    sizes="(max-width: 1080) 300px, 
                                            1080px"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="product-info">
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            <div className="product-payment">
              <div className="product-price">${product.price}</div>
              <AddToCartIcon product={product} />
            </div>
          </div>
        </div>
      </>
    )
  } else return <LoadingIcon />
}
