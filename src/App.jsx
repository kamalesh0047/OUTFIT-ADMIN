  import { Suspense, lazy } from 'react'
  import { Routes, Route, useLocation } from 'react-router-dom'
  import { AnimatePresence } from 'framer-motion'
  import Navbar from './components/Navbar.jsx'
  import Footer from './components/Footer.jsx'
  import CartDrawer from './components/CartDrawer.jsx'
  import PageLoader from './components/PageLoader.jsx'
  import Toast from './components/Toast.jsx'
  import { AuthProvider } from './context/AuthContext.jsx'
  import { ToastProvider } from './context/ToastContext.jsx'
  import useLenis from './hooks/useLenis.js'

  const Home = lazy(() => import('./pages/Home.jsx'))
  const Search = lazy(() => import('./pages/Search.jsx'))
  const About = lazy(() => import('./pages/About.jsx'))
  const Category = lazy(() => import('./pages/Category.jsx'))
  const Product = lazy(() => import('./pages/Product.jsx'))
  const Checkout = lazy(() => import('./pages/Checkout.jsx'))
  const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
  const Account = lazy(() => import('./pages/Account.jsx'))
  const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Products = lazy(() => import('./pages/Products.jsx'))
const Offers = lazy(() => import('./pages/Offers.jsx'))
  export default function App() {
    const location = useLocation()
    useLenis()
    return (
      <AuthProvider>
        <ToastProvider>
          <>
            <Navbar />
            <CartDrawer />
            <Toast />
            <main id="main">
              <Suspense fallback={<PageLoader />}>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/category/:slug" element={<Category />} />

<Route
  path="/products/:category/:subcategory"
  element={<Products />}
/>

<Route path="/product/:id" element={<Product />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>
            <Footer />
          </>
        </ToastProvider>
      </AuthProvider>
    )
  }
