import '../styles/vendor/bootstrap/css/bootstrap.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import '../styles/global.css'
import { CartProvider } from 'react-use-cart'
import type { AppProps } from 'next/app'
import { AnimatePresence } from 'framer-motion'
import { SSRProvider } from 'react-bootstrap'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { getCategories } from '../lib/cache'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Category } from '../lib/types'
import { useEffect, useState } from 'react'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    getCategories().then((categories) => setCategories(categories))
  }, [])

  return (
    <SSRProvider>
      <CartProvider>
        <Layout categories={categories}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={router.asPath}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              itemID="page-wrapper"
              id="main"
            >
              <Component {...pageProps} key={router.asPath} />
            </motion.div>
          </AnimatePresence>
        </Layout>
      </CartProvider>
    </SSRProvider>
  )
}

export default App
