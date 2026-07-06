import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Check, X } from 'lucide-react'
import { updateProduct } from '../../services/productService'
import { fmt } from '../../store'
import { CATEGORY_SLUGS, labelForCategory } from '../../data/taxonomy'
import { emitToast } from '../../lib/AppContext'
import { useAdminData } from '../../lib/AdminData'

export default function AdminInventory() {
  const { products, productsLoading } = useAdminData()
  const [editing, setEditing] = useState({}) // id -> tempStock
  const [catFilter, setCatFilter] = useState('All')

  const filtered = catFilter === 'All' ? products : products.filter(p => p.category === catFilter)

  const startEdit = (id, current) => setEditing(e => ({ ...e, [id]: String(current) }))
  const cancelEdit = id => setEditing(e => { const n = { ...e }; delete n[id]; return n })
  const saveStock = async id => {
    const val = parseInt(editing[id])
    if (isNaN(val) || val < 0) { emitToast('Enter a valid stock number'); return }
    try {
      await updateProduct(id, { stock: val })
      cancelEdit(id)
      emitToast('Stock updated')
      // list refreshes live via Firestore subscription
    } catch (e) {
      console.error(e); emitToast('Failed to update stock')
    }
  }

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0)
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="admin-title">Inventory</h1>
      </div>

      <div className="admin-stat-grid" style={{ marginBottom: '1.4rem' }}>
        {[['Total stock', totalStock, ''], ['Low stock', lowStock, 'badge-gold'], ['Out of stock', outOfStock, 'badge-error']].map(([l, v, c]) => (
          <div key={l} className="admin-stat-card">
            <span className="s-label">{l}</span>
            <div className={`s-value ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {['All', ...CATEGORY_SLUGS].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`badge ${catFilter === c ? 'badge-gold' : 'badge-neutral'}`}
            style={{ cursor: 'pointer' }}>{c === 'All' ? 'All' : labelForCategory(c)}</button>
        ))}
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          {productsLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading inventory…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No products.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Sold</th><th>Stock</th><th>Edit stock</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td><img className="td-img" src={p.imageUrl || p.image || `https://picsum.photos/seed/${p.id}/100/125`} alt={p.name}
                      onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${p.id}/100/125` }} /></td>
                    <td style={{ fontFamily: 'var(--serif)', fontSize: '.92rem' }}>{p.name}</td>
                    <td><span className="badge badge-neutral">{labelForCategory(p.category)}</span></td>
                    <td style={{ color: 'var(--gold-bright)' }}>{fmt(p.price)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.sold || 0}</td>
                    <td><span className={`badge ${p.stock === 0 ? 'badge-error' : p.stock <= 5 ? 'badge-gold' : 'badge-success'}`}>{p.stock}</span></td>
                    <td>
                      {editing[p.id] !== undefined ? (
                        <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                          <input type="number" value={editing[p.id]} onChange={e => setEditing(ev => ({ ...ev, [p.id]: e.target.value }))}
                            style={{ width: '70px', background: 'var(--bg-elevated)', border: '1px solid var(--gold)', color: 'var(--text-primary)', padding: '.4rem .5rem', fontSize: '.84rem' }} />
                          <button onClick={() => saveStock(p.id)} style={{ color: 'var(--success)' }}><Check size={14} /></button>
                          <button onClick={() => cancelEdit(p.id)} style={{ color: 'var(--text-tertiary)' }}><X size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(p.id, p.stock)} className="btn btn-ghost btn-sm" style={{ padding: '.45rem .7rem' }}><Pencil size={12} /></button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
