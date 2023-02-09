import LRUCache from 'lru-cache'
import { Category, Product } from './types'
import { privateClient } from './RootClient'
import { Twinkle_Star } from '@next/font/google'

type CategoriesCache = {
  [slug: string]: Category
}

type ProductsCache = {
  [slug: string]: Product
}

const productsCache = new LRUCache<string, ProductsCache>({ max: 100 * 1024 })
const categoriesCache = new LRUCache<string, CategoriesCache>({
  max: 100 * 1024,
})
class Cache {
  categories: Category[] = []

  products: Product[] = []

  productsCacheToList = (cache: ProductsCache) => {
    this.products = Object.values(cache)
    return this.products
  }

  categoriesCacheToList = (cache: CategoriesCache) => {
    this.categories = Object.values(cache)
    return this.categories
  }

  fetchCategories = async () => {
    const categories = await privateClient.getCategories()
    return categories.reduce((acc: CategoriesCache, category: Category) => {
      acc[category.slug!] = category
      return acc
    }, {})
  }

  fetchProducts = async () => {
    const products = await privateClient.getProducts()

    return products.reduce((acc: ProductsCache, product: Product) => {
      acc[product.slug!] = product
      return acc
    }, {})
  }

  // Check if the cache has the categories and return them if it does, otherwise fetch them
  getCategories = async (cacheOnly: boolean = false) => {
    const cached = categoriesCache.get('categories')
    if (cached && cached.categories) {
      console.log('cache hit')
      return this.categoriesCacheToList(cached)
    }

    // If no cached categories and cacheOnly is true, return an empty array
    if (cacheOnly) {
      return [] as Category[]
    }

    const categories = await this.fetchCategories()
    categoriesCache.set('categories', categories)
    return this.categoriesCacheToList(categories)
  }

  // Check if the cache has the category and return if it does, otherwise fetch all categories
  getCategory = async (slug: string, cacheOnly: boolean = false) => {
    const cached = categoriesCache.get('categories')
    if (cached && cached.categories && cached[slug]) {
      console.log('cache hit')
      return cached[slug]
    }

    // If no cached categories and cacheOnly is true, return an empty array
    if (cacheOnly) {
      return {} as Category
    }
    const categories = await this.fetchCategories()

    categoriesCache.set('categories', categories)
    return categories[slug]
  }

  // Check if the cache has the product and return if it does, otherwise fetch all products
  getProduct = async (slug: string) => {
    const cached = productsCache.get('products')
    if (cached && cached.products && cached[slug]) {
      console.log('cache hit')
      return cached[slug]
    }

    const products = await this.fetchProducts()
    productsCache.set('products', products)
    return products[slug]
  }

  // Check if the cache has the products and return if it does, otherwise fetch all products
  getProducts = async () => {
    const cached = productsCache.get('products')
    if (cached && cached.products) {
      console.log('cache hit')
      return this.productsCacheToList(cached)
    }

    const products = await this.fetchProducts()
    productsCache.set('products', products)
    return this.productsCacheToList(products)
  }

  // Clear the cache
  clearCache = () => {
    productsCache.clear()
    categoriesCache.clear()
  }
}
const cache = new Cache()
export default cache
