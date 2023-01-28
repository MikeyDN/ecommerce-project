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
import '@fortawesome/fontawesome-svg-core/styles.css'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SSRProvider>
      <CartProvider>
        <Layout>
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
