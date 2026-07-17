import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import Rating from './Rating.jsx'
import Price from './Price.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import './product-card.css'

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { isLoggedIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const liked = has(product.id)
  const stock = Number(product.stock ?? 0)
  const outOfStock = stock === 0
  const mrp = Number(product.originalPrice || product.original || 0)
  const selling = Number(product.price || 0)
  const discount = mrp > selling && mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0

  const handleWish = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      navigate('/account', { state: { from: location.pathname } })
      return
    }
    toggle(product.id)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) { addToast('This product is out of stock'); return }
    const result = addItem(product, {
      size: product.sizes?.[0] || 'One Size',
      color: product.colors?.[0] || '',
    })
    if (!result.ok) addToast(result.message)
    else addToast('Added to bag')
  }

  const handleQV = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  const gallery = (product.gallery && product.gallery.length)
    ? product.gallery
    : (product.images && product.images.length)
    ? product.images
    : [product.image || product.imageUrl].filter(Boolean)
  const imgSrc = gallery[0] || ''
  const hoverSrc = gallery[1] || null

  return (
    <motion.article className={'pcard' + (outOfStock ? ' pcard--oos' : '')} whileHover="hover" initial="rest" animate="rest">
      <div className="pcard__media">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <motion.img
            loading="lazy"
            src={imgSrc}
            alt={product.name}
            variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          />
          {hoverSrc && (
            <img
              className="pcard__img-hover"
              src={hoverSrc}
              alt=""
              loading="lazy"
              aria-hidden
            />
          )}
        </Link>

        {discount > 0 && !outOfStock && (
          <span className="pcard__badge">{discount}% OFF</span>
        )}

        {outOfStock ? (
          <span className="pcard__badge pcard__badge--oos">Out of stock</span>
        ) : stock <= 5 ? (
          <span className="pcard__badge pcard__badge--low">Only {stock} left</span>
        ) : (
          <span className="pcard__stock-pill">{stock} in stock</span>
        )}

        <motion.button
          className={'pcard__wish' + (liked ? ' is-on' : '')}
          aria-label="Wishlist"
          onClick={handleWish}
          variants={{ rest: { opacity: 0, y: -6 }, hover: { opacity: 1, y: 0 } }}
        >
          <Heart size={18} fill={liked ? '#0A0A0A' : 'none'} />
        </motion.button>

        <motion.div
          className="pcard__actions"
          variants={{ rest: { opacity: 0, y: 14 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3 }}
        >
          <button type="button" className="pcard__qv" onClick={handleQV}>
            <Eye size={15} /> Quick View
          </button>
          <button
            type="button"
            className={'pcard__add' + (outOfStock ? ' pcard__add--disabled' : '')}
            onClick={handleAdd}
          >
            <ShoppingBag size={15} /> {outOfStock ? 'Sold out' : 'Add to bag'}
          </button>
        </motion.div>
      </div>
      <div className="pcard__body">
        <span className="pcard__brand">{product.brand || 'OUTFIT'}</span>
        <Link to={`/product/${product.id}`} className="pcard__name">{product.name}</Link>
        <Rating value={product.rating || 5} count={product.reviews || 0} />
        <div className="pcard__foot">
          <Price price={selling} original={mrp} />
          <div className="pcard__colors">
            {(product.colors ?? []).slice(0, 4).map((c, i) => (
              <span key={i} className="pcard__dot" title={c} style={{ background: swatch(c) }} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function swatch(c) {
  const m = {
    Black: '#0A0A0A', White: '#F5F5DC', Beige: '#D9CBB8', Navy: '#1E2A44',
    Olive: '#5C6B4C', Brown: '#6B4A2E', Silver: '#C7CDD1', Gold: '#C9A24B',
  }
  return m[c] || '#ddd'
}
