import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIES, SHIRT_SUBCATEGORIES, PANTS_SUBCATEGORIES, ACCESSORIES_SUBCATEGORIES, WOMEN_SUBCATEGORIES, NEW_ARRIVALS_SUBCATEGORIES } from '../data/products.js'
import './category.css'

export default function Category() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const meta = CATEGORIES.find(c => c.slug === slug)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .4 }}
    >
      <div className="cat-hero">
        <div className="container">
          <button className="btn btn--ghost back-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Back
          </button>
          <nav className="crumbs">
            <Link to="/">Home</Link> / <span>{meta?.label || slug}</span>
          </nav>

          <h1>{meta?.label || (slug === 'pants' ? 'Pants & Jeans' : 'Products')}</h1>
        </div>
      </div>

      {slug === 'shirts' && (
        <div className="cat-subcategories">
          <div className="container">
            <div className="subcategory-section">
              <h2 className="section-title">Shirts</h2>
              <div className="subcategory-grid">
                {SHIRT_SUBCATEGORIES.shirts.map(sub => (
                  <Link key={sub.slug} to={`/products/shirts/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">T-Shirts</h2>
              <div className="subcategory-grid">
                {SHIRT_SUBCATEGORIES.tshirts.map(sub => (
                  <Link key={sub.slug} to={`/products/shirts/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {slug === 'pants' && (
        <div className="cat-subcategories">
          <div className="container">
            <div className="subcategory-section">
              <h2 className="section-title">👖 Jeans Collection</h2>
              <div className="subcategory-grid">
                {PANTS_SUBCATEGORIES.jeans.map(sub => (
                  <Link key={sub.slug} to={`/products/pants/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">👖 Pants Collection</h2>
              <div className="subcategory-grid">
                {PANTS_SUBCATEGORIES.pants.map(sub => (
                  <Link key={sub.slug} to={`/products/pants/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">👔 Trousers Collection</h2>
              <div className="subcategory-grid">
                {PANTS_SUBCATEGORIES.trousers.map(sub => (
                  <Link key={sub.slug} to={`/products/pants/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">🩳 Shorts Collection</h2>
              <div className="subcategory-grid">
                {PANTS_SUBCATEGORIES.shorts.map(sub => (
                  <Link key={sub.slug} to={`/products/pants/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">🏃 Tracks & Active Wear</h2>
              <div className="subcategory-grid">
                {PANTS_SUBCATEGORIES.tracks.map(sub => (
                  <Link key={sub.slug} to={`/products/pants/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {slug === 'new-arrivals' && (
        <div className="cat-subcategories">
          <div className="container">
            <div className="subcategory-section">
              <h2 className="section-title">✨ Latest Drops</h2>
              <div className="subcategory-grid">
                {NEW_ARRIVALS_SUBCATEGORIES.latest.map(sub => (
                  <Link key={sub.slug} to={`/products/new-arrivals/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {slug === 'accessories' && (
        <div className="cat-subcategories">
          <div className="container">
            <div className="subcategory-section">
              <h2 className="section-title">Watches</h2>
              <div className="subcategory-grid">
                {ACCESSORIES_SUBCATEGORIES.watches.map(sub => (
                  <Link key={sub.slug} to={`/products/accessories/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">Chains</h2>
              <div className="subcategory-grid">
                {ACCESSORIES_SUBCATEGORIES.chains.map(sub => (
                  <Link key={sub.slug} to={`/products/accessories/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {slug === 'women-dresses' && (
        <div className="cat-subcategories">
          <div className="container">
            <div className="subcategory-section">
              <h2 className="section-title">👖 Formal Pants Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.formalPants.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">👖 Jeans Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.jeans.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">👔 Trousers Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.trousers.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">🩳 Tops Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.tops.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">👗 Kurti Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.kurti.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="subcategory-section">
              <h2 className="section-title">🥻 Kurta Sets Collection</h2>
              <div className="subcategory-grid">
                {WOMEN_SUBCATEGORIES.kurtaSets.map(sub => (
                  <Link key={sub.slug} to={`/products/women-dresses/${sub.slug}`} className="subcategory-card">
                    <img src={sub.cover} alt={sub.label} className="subcategory-image" />
                    <h3 className="subcategory-label">{sub.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  )
}
