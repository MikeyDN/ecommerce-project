import Head from 'next/head'
import { Category } from '../lib/types'
import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
import { getCategories } from '../lib/cache'

const inter = Inter({ subsets: ['latin'] })

type PageProps = {
  query: {
    slug: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const categories: Category[] = await getCategories()
  return {
    props: {
      categories,
    },
  }
}

function Home({ categories }: { categories: Category[] }) {
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
      <div className="promoted-wrapper">
        <div className="promoted-products">
          {/* <Carousel>
            {promoted.map((promotedProduct) => (
              // TODO: Add promoted products
              <div></div>
            ))}
          </Carousel> */}
        </div>
      </div>
      <div className="category-wrapper">
        {categories.map((category, index) => (
          <a
            key={index}
            className="category-box"
            onClick={handleClick(category.slug)}
            id={`#${category.slug}`}
          >
            {category.name}
          </a>
        ))}
      </div>
    </>
  )
}
export default Home
