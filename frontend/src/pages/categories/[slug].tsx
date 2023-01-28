import { Category, Product } from '../../lib/types'
import cache from '../../lib/cache'
import Head from 'next/head'
import ProductView from '../../components/ProductView'

type PageProps = {
  query: {
    slug: string
  }
}

export async function getServerSideProps(context: PageProps) {
  const { slug } = context.query
  const category: Category = await cache.getCategory(slug)
  return {
    props: {
      category,
    },
  }
}

function CategoryView({ category }: { category: Category }) {
  return (
    <>
      <Head>
        <title>Buddy's e-Shop</title>
      </Head>

      <div className="content-title">
        <h1>{category.name}</h1>
      </div>

      <div className="product-list">
        {category.products.map((product: Product, key: number) => (
          <ProductView product={product} key={key} />
        ))}
      </div>
    </>
  )
}

export default CategoryView
