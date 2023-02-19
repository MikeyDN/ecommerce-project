import LRUCache from 'lru-cache'
import { Category, Product, Review } from './types'
import { rootClient } from './RootClient'

type CategoriesCache = {
  [slug: string]: Category
}

type ProductsCache = {
  [slug: string]: Product
}

type WebsiteCache = {
  logo: string
  banner: string
  favicon: string
  bannerTitle: string
  bannerSubtitle: string
  promotedProducts: Product[]
  reviews: Review[]
}
const productsCache = new LRUCache<string, ProductsCache>({ max: 100 * 1024 })
const websiteCache = new LRUCache<string, WebsiteCache>({ max: 100 * 1024 })
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
    const res = await rootClient.getCategories()
    const response = res.response as Category[]
    const retval = response.reduce(
      (acc: CategoriesCache, category: Category) => {
        acc[category.slug!] = category
        return acc
      },
      {},
    )
    return retval
  }

  fetchProducts = async () => {
    const products = await rootClient.getProducts()
    if (products.error) {
      return {}
    }

    return products.response.reduce((acc: ProductsCache, product: Product) => {
      acc[product.slug!] = product
      return acc
    }, {})
  }

  fetchPromotedProducts = async () => {
    const products = await rootClient.getPromotedProducts()
    if (products.error) {
      return {}
    }

    return products.response
  }

  fetchReviews = async () => {
    const reviews = await rootClient.getReviews()
    if (reviews.error) {
      return {}
    }

    return reviews.response
  }

  fetchSettings = async () => {
    const settings = await rootClient.getSettings()
    if (settings.error) {
      return {}
    }

    return settings.response
  }

  fetchTextSettings = async () => {
    const settings = await rootClient.getTextSettings()
    if (settings.error) {
      return {}
    }

    return settings.response
  }

  fetchImageSettings = async () => {
    const settings = await rootClient.getImageSettings()
    if (settings.error) {
      return {}
    }

    return settings.response
  }

  getPromotedProducts = async () => {
    const cached = websiteCache.get('promotedProducts')
    if (cached) {
      return cached
    }

    const products = await this.fetchPromotedProducts()
    websiteCache.set('promotedProducts', products)
    return products
  }

  getReviews = async () => {
    const cached = websiteCache.get('reviews')
    if (cached) {
      return cached
    }

    const reviews = await this.fetchReviews()
    websiteCache.set('reviews', reviews)
    return reviews
  }

  // Check if the cache has the categories and return them if it does, otherwise fetch them
  getCategories = async (cacheOnly: boolean = false) => {
    const cached = categoriesCache.get('categories')
    if (cached) {
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
    if (cached && cached[slug]) {
      return cached[slug]
    }
    const categories = await this.fetchCategories()
    categoriesCache.set('categories', categories)
    return categories[slug]
  }

  // Check if the cache has the product and return if it does, otherwise fetch all products
  getProduct = async (slug: string) => {
    const cached = productsCache.get('products')
    if (cached && cached[slug]) {
      return cached[slug]
    }

    const products = await this.fetchProducts()
    productsCache.set('products', products)
    return products[slug]
  }

  // Check if the cache has the products and return if it does, otherwise fetch all products
  getProducts = async () => {
    const cached = productsCache.get('products')
    if (cached) {
      return this.productsCacheToList(cached)
    }

    const products = await this.fetchProducts()
    productsCache.set('products', products)
    return this.productsCacheToList(products)
  }

  getSettings = async () => {
    const cached = websiteCache.get('settings')
    if (cached) {
      return cached
    }

    const settings = await this.fetchSettings()
    websiteCache.set('settings', settings)
    return settings
  }

  getLogo = async () => {
    const cached = websiteCache.get('logo')
    if (cached) {
      return cached
    }

    const settings = await this.fetchImageSettings()
    websiteCache.set('logo', settings.logo)
    return settings.logo
  }

  getBanner = async () => {
    const cached = websiteCache.get('banner')
    if (cached) {
      return cached
    }

    const settings = await this.fetchImageSettings()
    websiteCache.set('banner', settings.banner)
    return settings.banner
  }

  getFavicon = async () => {
    const cached = websiteCache.get('favicon')
    if (cached) {
      return cached
    }

    const settings = await this.fetchImageSettings()
    websiteCache.set('favicon', settings.favicon)
    return settings.favicon
  }

  getBannerTitle = async () => {
    const cached = websiteCache.get('bannerTitle')
    if (cached) {
      return cached
    }

    const settings = await this.fetchTextSettings()
    websiteCache.set('bannerTitle', settings.bannerTitle)
    return settings.bannerTitle
  }

  getBannerSubtitle = async () => {
    const cached = websiteCache.get('bannerSubtitle')
    if (cached) {
      return cached
    }

    const settings = await this.fetchTextSettings()
    websiteCache.set('bannerSubtitle', settings.bannerSubtitle)
    return settings.bannerSubtitle
  }

  // Clear the cache
  clearCache = () => {
    productsCache.clear()
    categoriesCache.clear()
  }
}
const cache = new Cache()
export default cache
