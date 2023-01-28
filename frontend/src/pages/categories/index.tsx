import Head from 'next/head'
import React from 'react'
import { Category } from '../../lib/types'
import { Inter } from '@next/font/google'
import { getCategories } from '../../lib/cache'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps() {
  const categories = await getCategories()
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
      <div className="content-title" style={{ paddingBottom: 20 }}>
        <h1>All Categories</h1>
      </div>
      <div className="category-wrapper">
        {categories.map((category, index) => (
          <a
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
