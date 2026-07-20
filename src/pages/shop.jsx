import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import ProductFilter from '../components/ProductFilter.jsx'
import { getProducts } from '../services/productService.js'
import './shop.css'

const PageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
}

export default function Shop() {
  const [allProducts, setAllProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickView, setQuickView] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    getProducts()
      .then((list) => {
        setAllProducts(list)
        setFiltered(list)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (mobileFiltersOpen) document.body.classList.add('no-scroll')
    else document.body.classList.remove('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [mobileFiltersOpen])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price-desc':
        return list.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'name':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      default:
        return list
    }
  }, [filtered, sort])

  const handleFilter = (list) => {
    setFiltered(list)
  }

  return (
    <motion.div {...PageMotion}>
      <section className="shop-hero">
        <div className="container">
          <p className="eyebrow">Browse everything</p>
          <h1>Shop All</h1>
          <p className="shop-hero__sub">
            Filter by size and price across every category — shirts, pants, dresses, accessories &amp; more.
          </p>
        </div>
      </section>

      <section className="container section shop-layout">
        <aside className="shop-sidebar">
          {!loading && (
            <ProductFilter
              products={allProducts}
              onFilter={handleFilter}
              showGenderFilter
            />
          )}
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <button
              type="button"
              className="btn btn--ghost shop-filter-btn"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <p className="shop-count">
              {loading
                ? 'Loading…'
                : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
            </p>

            <div className="shop-sort">
              <label htmlFor="shop-sort">Sort</label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input shop-sort-select"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="shop-empty">
              <p>Loading products…</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="shop-empty">
              <h2>No products match</h2>
              <p>Try adjusting size or price filters — or clear filters to see everything.</p>
            </div>
          ) : (
            <div className="pcard-grid shop-grid">
              {sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="shop-filter-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.aside
              className="shop-filter-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              role="dialog"
              aria-label="Filters"
            >
              <div className="shop-filter-drawer__head">
                <h3>Filters</h3>
                <button
                  type="button"
                  className="nav__icon"
                  aria-label="Close filters"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="shop-filter-drawer__body">
                <ProductFilter
                  products={allProducts}
                  onFilter={handleFilter}
                  showGenderFilter
                />
              </div>
              <div className="shop-filter-drawer__foot">
                <button
                  type="button"
                  className="btn btn--block"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Show {sorted.length} result{sorted.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {quickView && (
        <QuickView product={quickView} onClose={() => setQuickView(null)} />
      )}
    </motion.div>
  )
}