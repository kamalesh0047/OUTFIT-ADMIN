import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Truck, RefreshCw, ShieldCheck, Zap, ArrowRight, Star, Sparkles, Users, User, Play, X, Tag } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import QuickView from '../components/QuickView.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES } from '../data/products.js'
import { subscribeOfferProducts } from '../services/productService.js'
import { useState, useRef, useEffect } from 'react'

const PageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }
const word = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] },
  },
}

const MARQUEE = [
  'FREE SHIPPING OVER ₹1499',
  'NEW SEASON DROP',
  'CURATED ESSENTIALS',
  'MEN & WOMEN',
  '30-DAY RETURNS',
  'TIMELESS SILHOUETTES',
]

export default function Home() {
  
  const headline = ['Style', 'Beyond', 'Trends']
  const displayCategories = CATEGORIES
  const [quickView, setQuickView] = useState(null)
  const [reelOpen, setReelOpen] = useState(false)
  const [offerProducts, setOfferProducts] = useState([])
  const categoriesRef = useRef(null)
  const heroRef = useRef(null)
  const magneticRef = useRef(null)

  useEffect(() => {
    const unsub = subscribeOfferProducts((list) => setOfferProducts(list.slice(0, 8)))
    return () => unsub?.()
  }, [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const handleShopClick = (e) => {
    e.preventDefault()
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMagnetic = (e) => {
    const el = magneticRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)

    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`
  }

  const resetMagnetic = () => {
    if (magneticRef.current) {
      magneticRef.current.style.transform = 'translate(0, 0)'
    }
  }

  return (
    <motion.div {...PageMotion}>
      <section className="hero" ref={heroRef}>
        <motion.img
          className="hero__bg"
          src="https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"
          alt="Fashion hero background"
          loading="eager"
          style={{ y: bgY, scale: bgScale }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
        />
    
        <div className="hero__overlay" />
        <div className="hero__grain" />

        <motion.div
          className="container hero__content"
          style={{ y: contentY, opacity: contentOpacity }}
        >
         <motion.div
    className="hero__brand"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05, duration: 0.6 }}
  >
    <div className="hero__brand-header">
      <h1 className="hero__brand-name">OUTFIT</h1>
      <span className="hero__brand-subtitle">For</span>
      <div className="hero__brand-pair">
  {/* Male */}
  <svg className="hero__pair-icon" viewBox="10 3 19 47" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path
      d="M18 16 L12 24 L12 40 L15 40 L15 48 L21 48 L21 40 L27 40 L27 24 L21 16 Z"
      stroke="currentColor" strokeWidth="1.5" fill="none"
      strokeLinejoin="round" strokeLinecap="round"
    />
  </svg>

  {/* Female */}
  <svg className="hero__pair-icon" viewBox="3 3 22 47" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path
      d="M14 16 L6 34 L11 34 L11 48 L17 48 L17 34 L22 34 Z"
      stroke="currentColor" strokeWidth="1.5" fill="none"
      strokeLinejoin="round" strokeLinecap="round"
    />
  </svg>
</div>
    </div>
    <div className="hero__brand-tag">
      <span className="hero__brand-line" />
      <span className="hero__brand-text">Do it with outfit</span>
      <span className="hero__brand-line" />
    </div>
  </motion.div> 
        
          <motion.span
            className="eyebrow eyebrow--hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            
            <Sparkles size={14} /> Premium Fashion Marketplace
          </motion.span>

          <motion.h1 className="hero__title" variants={stagger} initial="hidden" animate="show">
            {headline.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                style={{ display: 'inline-block', marginRight: '.28em' }}
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            Curated essentials for Men & Women - timeless silhouettes, exceptional materials,
            effortless minimalism.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center', alignItems: 'center' }}
          >
            <button
              ref={magneticRef}
              onClick={handleShopClick}
              onMouseMove={handleMagnetic}
              onMouseLeave={resetMagnetic}
              className="btn hero__cta"
            >
              Shop Now <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setReelOpen(true)}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.55)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Play size={16} fill="currentColor" /> Watch Reel
            </button>
          </motion.div>

          <motion.div
            className="hero__trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <div className="hero__stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span>Loved by 1.5lakh+ customers</span>
          </motion.div>
        </motion.div>

        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </div>
      </section>

      <section className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {MARQUEE.map((t, i) => (
            <span key={i} className="marquee__item">
              {t} <span className="marquee__dot">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="section container" ref={categoriesRef}>
        <Reveal>
          <div className="section__head">
            <span className="eyebrow">Browse</span>
            <h2>Shop by Category</h2>
            <p className="section__sub">Find your fit across our most-loved edits.</p>
          </div>
        </Reveal>

        <div className="cat-grid">
          {displayCategories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to={`/category/${c.slug}`} className="cat-card">
                <div className="cat-card__media">
                  <img src={c.cover} alt={c.label} loading="lazy" />
                </div>

                
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="editorial">
          <Reveal delay={0.1}>
            <div className="editorial__copy">
              <h2>Designed to last, styled to move</h2>
              <p>
                Every piece is chosen for how it feels in your hands and how it wears over time -
                premium fabrics, considered cuts, and a palette that never goes out of style.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Offers — live from Firebase isOffer products */}
      {offerProducts.length > 0 && (
        <section className="section container">
          <Reveal>
            <div className="section__head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <span className="eyebrow"><Tag size={14} style={{ marginRight: 6 }} /> Limited Time</span>
                <h2>Offers &amp; Deals</h2>
                <p className="section__sub">Hand-picked pieces at special prices — updated live from the admin panel.</p>
              </div>
              <Link to="/offers" className="btn btn--ghost" style={{ whiteSpace: 'nowrap' }}>
                View all offers <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div
            className="product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
              marginTop: 8,
            }}
          >
            {offerProducts.map((p) => (
              <Reveal key={p.id}>
                <ProductCard product={p} onQuickView={setQuickView} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container promo">
          {[
            [Truck, 'Free Shipping', 'On orders over ₹1499'],
            [RefreshCw, 'Easy Returns', '30-day hassle-free'],
            [ShieldCheck, 'Secure Payments', '256-bit encryption'],
            [Zap, 'Fast Delivery', '1 business day'],
          ].map(([Icon, t, s], i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="promo__item">
                <span className="promo__icon">
                  <Icon size={24} />
                </span>
                <div>
                  <strong>{t}</strong>
                  <span>{s}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}

      {/* Watch Reel modal */}
      <AnimatePresence>
        {reelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReelOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.82)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: 'min(400px, 100%)',
                aspectRatio: '9/16',
                background: '#111',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}
            >
              <button
                type="button"
                onClick={() => setReelOpen(false)}
                aria-label="Close reel"
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 2,
                  width: 36, height: 36, borderRadius: '50%',
                  border: 0, background: 'rgba(0,0,0,0.55)', color: '#fff',
                  display: 'grid', placeItems: 'center', cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
              <video
                src="https://cdn.coverr.co/videos/coverr-fashion-model-walking-on-the-street-5727/1080p.mp4"
                poster="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=70"
                autoPlay
                muted
                loop
                playsInline
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '1.25rem',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                  color: '#fff',
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: 4 }}>OUTFIT · New Season</p>
                <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>Discover the latest drop</p>
                <Link
                  to="/category/new-arrivals"
                  onClick={() => setReelOpen(false)}
                  className="btn"
                  style={{ fontSize: 13, padding: '0.55rem 1rem' }}
                >
                  Shop the look
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
