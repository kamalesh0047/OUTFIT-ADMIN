import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Percent, Search, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'
import { updateProduct } from '../../services/productService'
import { useAdminData } from '../../lib/AdminData'
import { emitToast } from '../../lib/AppContext'
import { fmt } from '../../store'

export default function AdminOffers() {
  const { products, productsLoading } = useAdminData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('offers') // offers | discounted | all
  const [busyId, setBusyId] = useState(null)

  const list = useMemo(() => {
    let items = products || []
    if (filter === 'offers') items = items.filter((p) => p.isOffer)
    else if (filter === 'discounted') {
      items = items.filter(
        (p) => Number(p.originalPrice) > Number(p.price) && Number(p.price) > 0
      )
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter((p) => p.name?.toLowerCase().includes(q))
    }
    return items
  }, [products, filter, search])

  const toggleOffer = async (p) => {
    setBusyId(p.id)
    const next = !Boolean(p.isOffer)
    try {
      // Always write a real boolean so Firestore queries match
      await updateProduct(p.id, { isOffer: next })
      emitToast(next ? 'Added to Offers — live on storefront' : 'Removed from Offers')
    } catch (err) {
      console.error(err)
      emitToast('Failed to update offer flag')
    } finally {
      setBusyId(null)
    }
  }

  const discountOf = (p) => {
    const mrp = Number(p.originalPrice || 0)
    const price = Number(p.price || 0)
    if (!mrp || mrp <= price) return null
    return Math.round(((mrp - price) / mrp) * 100)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <Percent size={18} style={{ color: 'var(--gold)' }} />
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.65rem', letterSpacing: '0.04em', margin: 0 }}>Offers</h1>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', margin: 0 }}>
            Control which products appear on the customer <strong>/offers</strong> page. Changes sync in real time.
          </p>
        </div>
        <a
          href="/offers"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.78rem', letterSpacing: '0.06em', color: 'var(--gold-bright)',
            border: '1px solid rgba(200,164,93,0.35)', padding: '0.55rem 0.9rem', borderRadius: 999,
          }}
        >
          <ExternalLink size={14} /> View storefront offers
        </a>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem' }}
          />
        </div>
        {[
          ['offers', 'Active offers'],
          ['discounted', 'All discounted'],
          ['all', 'All products'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            style={{
              padding: '0.55rem 0.95rem',
              borderRadius: 999,
              border: filter === key ? '1px solid var(--gold)' : '1px solid var(--line-soft)',
              background: filter === key ? 'rgba(200,164,93,0.12)' : 'transparent',
              color: filter === key ? 'var(--gold-bright)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {productsLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading…</div>
      ) : list.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)', border: '1px dashed var(--line-soft)', borderRadius: 12 }}>
          {filter === 'offers'
            ? 'No products marked as offers yet. Open Products, edit an item, and enable “Mark as Offer” — or use the toggle below on discounted items.'
            : 'No products match this filter.'}
        </div>
      ) : (
        <div style={{ border: '1px solid var(--line-soft)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Product</th>
                <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                <th style={{ padding: '0.85rem 1rem' }}>Discount</th>
                <th style={{ padding: '0.85rem 1rem' }}>On /offers</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const disc = discountOf(p)
                return (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.imageUrl || p.image || p.gallery?.[0] || `https://picsum.photos/seed/${p.id}/80/100`}
                          alt=""
                          style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 4, background: '#111' }}
                        />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                            {p.category}{p.subcategory ? ` · ${p.subcategory}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600 }}>{fmt(p.price)}</div>
                      {Number(p.originalPrice) > Number(p.price) && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                          {fmt(p.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {disc != null ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'rgba(34,197,94,0.12)', color: '#4ade80',
                          padding: '0.25rem 0.55rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                        }}>
                          <Tag size={12} /> {disc}% OFF
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        type="button"
                        disabled={busyId === p.id}
                        onClick={() => toggleOffer(p)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          border: 0, background: 'transparent', cursor: 'pointer',
                          color: p.isOffer ? 'var(--gold-bright)' : 'var(--text-tertiary)',
                          fontSize: '0.82rem', opacity: busyId === p.id ? 0.5 : 1,
                        }}
                      >
                        {p.isOffer ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        {p.isOffer ? 'Live' : 'Off'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
