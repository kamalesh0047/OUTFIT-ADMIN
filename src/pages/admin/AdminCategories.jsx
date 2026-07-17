import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { deleteProduct } from '../../services/productService'
import { fmt } from '../../store'
import { TAXONOMY } from '../../data/taxonomy'
import { emitToast } from '../../lib/AppContext'
import { useAdminData } from '../../lib/AdminData'

export default function AdminCategories() {
  const { products } = useAdminData()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAll = async () => {
    setDeleting(true)
    try {
      await Promise.all(products.map(p => deleteProduct(p.id)))
      emitToast('All products deleted')
      setShowConfirm(false)
    } catch (e) {
      console.error(e); emitToast('Failed to delete all products')
    } finally {
      setDeleting(false)
    }
  }

  const stats = useMemo(() => TAXONOMY.map(c => {
    const items = products.filter(p => p.category === c.slug)
    return {
      slug: c.slug,
      label: c.label,
      count: items.length,
      totalStock: items.reduce((s, p) => s + (p.stock || 0), 0),
      avgPrice: items.length ? Math.round(items.reduce((s, p) => s + (p.price || 0), 0) / items.length) : 0,
    }
  }), [products])

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Categories</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '.2rem' }}>The houses of Aurelis — synced with the storefront</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link to="/admin/products" className="btn btn-primary">Manage products</Link>
          <button onClick={() => setShowConfirm(true)} className="btn btn-danger" style={{ padding: '0.6rem 1.2rem' }}>Delete All Products</button>
          {showConfirm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '0.5rem', maxWidth: '400px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '1rem' }}>Delete All Products?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This permanently removes all {products.length} products from Firestore — they disappear from the storefront too. This cannot be undone.</p>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowConfirm(false)} className="btn" disabled={deleting}>Cancel</button>
                  <button onClick={handleDeleteAll} className="btn btn-danger" disabled={deleting}>{deleting ? 'Deleting…' : 'Delete All'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-cat-grid">
        {stats.map(({ slug, label, count, totalStock, avgPrice }, i) => (
          <motion.div key={slug} className="admin-card"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
                <div>
                  <div style={{ fontSize: 'var(--fs-cap)', letterSpacing: '.28em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '.4rem' }}>House 0{i + 1}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 500 }}>{label}</h3>
                  <code style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>{slug}</code>
                </div>
                <span className={`badge ${count === 0 ? 'badge-error' : 'badge-success'}`}>{count} piece{count !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem' }}>
                {[['Products', count], ['In stock', totalStock], ['Avg price', fmt(avgPrice)]].map(([l, v]) => (
                  <div key={l} style={{ background: 'var(--bg-elevated)', padding: '.8rem', border: '1px solid var(--line-soft)' }}>
                    <div style={{ fontSize: 'var(--fs-cap)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '.3rem' }}>{l}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--gold-bright)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
