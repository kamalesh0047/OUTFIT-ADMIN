import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import Reveal from '../components/Reveal.jsx'
import { getProducts } from '../services/productService.js'
import './search.css'

const PageMotion = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0}, transition:{duration:.4} }

export default function Search() {
  const [searchParams] = useSearchParams()
  const [quickView, setQuickView] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .catch(err => console.error('Failed to load products:', err))
      .finally(() => setLoading(false))
  }, [])

  const q = query.trim().toLowerCase()
  const results = q ? allProducts.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q) ||
    (p.subcategory || '').toLowerCase().includes(q)
  ) : []

  return (
    <motion.div {...PageMotion}>
      <section className="search-hero">
        <div className="container search-hero__content">
          <h1>Search Results</h1>
          <p className="search-hero__query">
            {query ? `Results for "${query}"` : 'Enter a search term'}
          </p>
          <p className="search-hero__count">
            {loading ? 'Searching…' : results.length > 0 ? `${results.length} product${results.length !== 1 ? 's' : ''} found` : query ? 'No products found' : ''}
          </p>
        </div>
      </section>

      {results.length > 0 ? (
        <section className="section container">
          <div className="grid grid--4">
            {results.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.05}>
                <ProductCard product={product} onQuickView={setQuickView} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : (
        !loading && query && (
          <section className="section container">
            <div className="search-empty">
              <h2>No products found</h2>
              <p>Try searching for different keywords or browse our categories.</p>
            </div>
          </section>
        )
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </motion.div>
  )
}
