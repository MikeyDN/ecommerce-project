import Head from 'next/head'
import { Category, Product, Review } from '../lib/types'
import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
import cache from '../lib/cache'
import Image from 'next/image'
import ProductView from '../components/Other/ProductView'
import { Card } from 'react-bootstrap'
import ReviewComponent from '../components/Other/Review'
const inter = Inter({ subsets: ['latin'] })

type PageProps = {
  query: {
    slug: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const categories: Category[] = await cache.getCategories()
  const promoted: Product[] = await cache.getPromotedProducts()
  const reviews: Review[] = await cache.getReviews()
  const bannerImage = `http://localhost:8000/${await cache.getBanner()}`
  const bannerTitle = await cache.getBannerTitle()
  const bannerSubtitle = await cache.getBannerSubtitle()

  return {
    props: {
      categories,
      promoted,
      reviews,
      bannerImage,
      bannerTitle,
      bannerSubtitle,
    },
  }
}

type HomeProps = {
  categories: Category[]
  promoted: Product[]
  reviews: Review[]
  bannerImage: string
  bannerTitle: string
  bannerSubtitle: string
}

function Home({
  categories,
  promoted,
  reviews,
  bannerImage,
  bannerTitle,
  bannerSubtitle,
}: HomeProps) {
  const router = useRouter()

  const handleClick = (slug: string) => {
    return () => {
      router.push(`/categories/${slug}`)
    }
  }
  return (
    <>
      <Head>
        <title>Buddy's e-Shop</title>
      </Head>
      <div className="banner">
        <div
          className="banner-content"
          style={{
            height: 150,
            width: '80%',
            minWidth: 300,
            maxWidth: 1000,
            position: 'relative',
            margin: 'auto',
            marginBottom: 50,
          }}
        >
          <Image
            src={bannerImage}
            alt={bannerTitle}
            style={{ objectFit: 'cover' }}
            fill
          />
        </div>
      </div>
      <div className="category-wrapper">
        {categories.map((category, index) => (
          <a
            key={index}
            className="category-box"
            onClick={handleClick(category.slug!)} // Due to backend automatically adding a slug, this is safe
            id={`#${category.slug}`}
          >
            {category.name}
          </a>
        ))}
      </div>

      <div id="promoted-products">
        {promoted.map((product, index) => (
          <ProductView product={product} key={index} />
        ))}
      </div>

      <div id="reviews-wrapper">
        <h1 style={{ width: 'fit-content', margin: 'auto' }}>Reviews</h1>
        <div id="reviews">
          {reviews.map((review, index) => (
            <ReviewComponent key={index} review={review} />
          ))}
        </div>
      </div>
    </>
  )
}
export default Home
