import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import { subscribeOfferProducts } from '../services/productService.js'
import Reveal from '../components/Reveal.jsx'

const PageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45 },
}

export default function Offers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickView, setQuickView] = useState(null)

  useEffect(() => {
    // ONLY products with isOffer === true. No discounted fallback —
    // admin toggle must remove items from this page immediately.
    const unsub = subscribeOfferProducts((list) => {
      setProducts(Array.isArray(list) ? list : [])
      setLoading(false)
    })
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  return (
    <motion.div {...PageMotion}>
      <section className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Limited Time</p>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: 12 }}>
              Offers & Deals
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
              Exclusive prices on selected pieces. Grab them before they&apos;re gone.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>Loading offers…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
            No active offers right now. Check back soon.
          </div>
        ) : (
          <div
            className="product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </section>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </motion.div>
  )
}
