import LRUCache from 'lru-cache'
import { Category, Product } from './types'
import { newClient } from './client'

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

const productsCacheToList = (cache: ProductsCache) => {
  return Object.values(cache)
}

const categoriesCacheToList = (cache: CategoriesCache) => {
  return Object.values(cache)
}

const fetchCategories = async () => {
  type Accumulator = {
    [slug: string]: Category
  }
  const categories = await newClient.getCategories()
  return categories.reduce((acc: Accumulator, category: Category) => {
    acc[category.slug] = category
    return acc
  }, {} as CategoriesCache)
}

const fetchProducts = async () => {
  type Accumulator = {
    [slug: string]: Product
  }
  const products = await newClient.getProducts()

  return products.reduce((acc: Accumulator, product: Product) => {
    acc[product.slug] = product
    return acc
  }, {} as ProductsCache)
}

// Check if the cache has the categories and return them if it does, otherwise fetch them
export const getCategories = async () => {
  const cached = categoriesCache.get('categories')
  if (cached && cached.categories) {
    console.log('cache hit')
    return categoriesCacheToList(cached)
  }

  const categories = await fetchCategories()
  categoriesCache.set('categories', categories)
  return categoriesCacheToList(categories)
}

// Check if the cache has the category and return if it does, otherwise fetch all categories
export const getCategory = async (slug: string) => {
  const cached = categoriesCache.get('categories')
  if (cached && cached.categories && cached[slug]) {
    console.log('cache hit')
    return cached[slug]
  }
  const categories = await fetchCategories()

  categoriesCache.set('categories', categories)
  return categories[slug]
}

// Check if the cache has the product and return if it does, otherwise fetch all products
export const getProduct = async (slug: string) => {
  const cached = productsCache.get('products')
  if (cached && cached.products && cached[slug]) {
    console.log('cache hit')
    return cached[slug]
  }

  const products = await fetchProducts()
  productsCache.set('products', products)
  return products[slug]
}

// Check if the cache has the products and return if it does, otherwise fetch all products
export const getProducts = async () => {
  const cached = productsCache.get('products')
  if (cached && cached.products) {
    console.log('cache hit')
    return productsCacheToList(cached)
  }

  const products = await fetchProducts()
  productsCache.set('products', products)
  return productsCacheToList(products)
}

// Clear the cache
export const clearCache = () => {
  productsCache.clear()
  categoriesCache.clear()
}
