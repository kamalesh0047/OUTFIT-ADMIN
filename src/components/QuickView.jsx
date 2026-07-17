import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight, Share2, Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Rating from './Rating.jsx'
import Price from './Price.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useNavigate, useLocation } from 'react-router-dom'

function getGallery(product) {
  if (!product) return []
  const g = product.gallery || product.images || []
  if (Array.isArray(g) && g.length) return g.filter(Boolean)
  const single = product.image || product.imageUrl || ''
  return single ? [single] : []
}

export default function QuickView({ product, onClose }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { isLoggedIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeIdx, setActiveIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const gallery = getGallery(product)
  const stock = Number(product?.stock ?? 0)
  const outOfStock = stock === 0
  const liked = product ? has(product.id) : false

  useEffect(() => {
    if (!product) return
    setActiveIdx(0)
    setQty(1)
    setSelectedSize(product.sizes?.[0] || 'One Size')
    setSelectedColor(product.colors?.[0] || '')
  }, [product])

  // Close on Escape
  useEffect(() => {
    if (!product) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length)
      if (e.key === 'ArrowRight') setActiveIdx((i) => (i + 1) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, gallery.length, onClose])

  // Prevent body scroll
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [product])

  const prev = useCallback(() => setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length), [gallery.length])
  const next = useCallback(() => setActiveIdx((i) => (i + 1) % gallery.length), [gallery.length])

  if (!product) return null

  const mrp = Number(product.originalPrice || product.original || 0)
  const selling = Number(product.price || 0)

  const handleWish = () => {
    if (!isLoggedIn) {
      navigate('/account', { state: { from: location.pathname } })
      return
    }
    toggle(product.id)
  }

  const handleAdd = () => {
    if (outOfStock) { addToast('This product is out of stock'); return }
    const result = addItem(product, {
      size: selectedSize || product.sizes?.[0] || 'One Size',
      color: selectedColor || product.colors?.[0] || '',
      qty,
    })
    if (!result.ok) { addToast(result.message); return }
    addToast('Added to bag')
    onClose()
  }

  const handleBuyNow = () => {
    if (outOfStock) { addToast('This product is out of stock'); return }
    const result = addItem(product, {
      size: selectedSize || product.sizes?.[0] || 'One Size',
      color: selectedColor || product.colors?.[0] || '',
      qty,
    })
    if (!result.ok) { addToast(result.message); return }
    onClose()
    navigate('/checkout')
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        addToast('Link copied')
      }
    } catch { /* user cancelled */ }
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="qview__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(10,10,10,.55)',
              zIndex: 90, backdropFilter: 'blur(4px)',
            }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="qview__wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px', pointerEvents: 'none',
            }}
          >
            <motion.div
              className="qview"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                pointerEvents: 'auto',
                background: 'var(--surface, #fff)',
                borderRadius: 16,
                maxWidth: 920,
                width: '100%',
                maxHeight: '92vh',
                overflow: 'auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                boxShadow: '0 32px 80px rgba(0,0,0,.28)',
              }}
            >
              {/* LEFT – Gallery */}
              <div className="qview__gallery" style={{ position: 'relative', background: '#f5f2ed', minHeight: 320 }}>
                <img
                  key={activeIdx}
                  src={gallery[activeIdx] || product.image || product.imageUrl}
                  alt={`${product.name} – view ${activeIdx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 360 }}
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous image"
                      style={{
                        position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                        width: 36, height: 36, borderRadius: '50%', border: 'none',
                        background: 'rgba(255,255,255,.9)', display: 'grid', placeItems: 'center', cursor: 'pointer',
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next image"
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        width: 36, height: 36, borderRadius: '50%', border: 'none',
                        background: 'rgba(255,255,255,.9)', display: 'grid', placeItems: 'center', cursor: 'pointer',
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div style={{
                      position: 'absolute', bottom: 12, left: 0, right: 0,
                      display: 'flex', justifyContent: 'center', gap: 6,
                    }}>
                      {gallery.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveIdx(i)}
                          style={{
                            width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                            border: i === activeIdx ? '2px solid var(--ink)' : '2px solid transparent',
                            padding: 0, cursor: 'pointer', opacity: i === activeIdx ? 1 : 0.7,
                          }}
                        >
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT – Details */}
              <div className="qview__body" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="eyebrow" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    {product.brand || 'OUTFIT'} · {product.category || ''}
                  </span>
                  <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>

                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 500, margin: 0, lineHeight: 1.25 }}>
                  {product.name}
                </h3>

                <Rating value={product.rating || 5} count={product.reviews || 0} />

                <Price price={selling} original={mrp} size="lg" />

                {outOfStock ? (
                  <span style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>Out of stock</span>
                ) : stock <= 5 ? (
                  <span style={{ color: '#D4A017', fontSize: 13, fontWeight: 600 }}>Only {stock} left</span>
                ) : (
                  <span style={{ color: '#1e7f4f', fontSize: 13, fontWeight: 600 }}>{stock} in stock</span>
                )}

                {product.description && (
                  <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                    {product.description.slice(0, 180)}{product.description.length > 180 ? '…' : ''}
                  </p>
                )}

                {/* Sizes */}
                {(product.sizes?.length > 0) && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: '.04em' }}>SIZE</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          style={{
                            minWidth: 44, height: 36, padding: '0 12px', borderRadius: 8,
                            border: selectedSize === s ? '1.5px solid var(--ink)' : '1px solid var(--line)',
                            background: selectedSize === s ? 'var(--ink)' : 'transparent',
                            color: selectedSize === s ? '#fff' : 'var(--ink)',
                            fontSize: 13, fontWeight: 500, cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {(product.colors?.length > 0) && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: '.04em' }}>COLOR</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          title={c}
                          style={{
                            padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                            border: selectedColor === c ? '1.5px solid var(--ink)' : '1px solid var(--line)',
                            background: selectedColor === c ? 'var(--ink)' : 'transparent',
                            color: selectedColor === c ? '#fff' : 'var(--ink)',
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.04em' }}>QTY</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 8 }}>
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(stock || 10, q + 1))} style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn--block"
                    onClick={handleAdd}
                    disabled={outOfStock}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <ShoppingBag size={16} />
                    {outOfStock ? 'Sold out' : 'Add to Bag'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--block"
                    onClick={handleBuyNow}
                    disabled={outOfStock}
                  >
                    Buy Now
                  </button>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={handleWish}
                      style={{
                        flex: 1, height: 42, borderRadius: 8, border: '1px solid var(--line)',
                        background: liked ? 'var(--ink)' : 'transparent', color: liked ? '#fff' : 'var(--ink)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      }}
                    >
                      <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                      {liked ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      style={{
                        width: 42, height: 42, borderRadius: 8, border: '1px solid var(--line)',
                        background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer',
                      }}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', textDecoration: 'underline', marginTop: 4 }}
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Responsive override */}
          <style>{`
            @media (max-width: 720px) {
              .qview {
                grid-template-columns: 1fr !important;
                max-height: 94vh !important;
              }
              .qview__gallery img {
                min-height: 280px !important;
                max-height: 40vh;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}
