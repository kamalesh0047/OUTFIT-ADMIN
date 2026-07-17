// AdminOrders.jsx — live from Firestore (same "orders" collection the storefront writes to)
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown } from 'lucide-react'
import { fmt } from '../../store'
import { emitToast } from '../../lib/AppContext'
import { useAdminData, updateOrderStatus, ORDER_STATUSES } from '../../lib/AdminData'

export default function AdminOrders() {
  const { orders, ordersLoading } = useAdminData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [saving, setSaving] = useState(null)

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    const q = search.trim().toLowerCase()
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.userName?.toLowerCase().includes(q) || o.phone?.includes(q)
    return matchStatus && matchSearch
  })

  const changeStatus = async (id, status) => {
    setSaving(id)
    try {
      await updateOrderStatus(id, status)
      emitToast(`Order status updated to ${status}`)
    } catch (e) {
      console.error(e); emitToast('Failed to update status')
    } finally {
      setSaving(null)
    }
  }

  const statusColor = s => ({ Pending: 'badge-gold', Confirmed: 'badge-gold', Processing: 'badge-neutral', Shipped: 'badge-success', Delivered: 'badge-success', Cancelled: 'badge-error' }[s] || 'badge-neutral')
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="admin-title">Orders</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '.2rem' }}>{orders.length} total orders · live from the storefront</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ maxWidth: '280px' }}>
          <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID, customer, phone..." />
          {search && <button onClick={() => setSearch('')}><X size={12} style={{ color: 'var(--text-tertiary)' }} /></button>}
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {['All', ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`badge ${statusFilter === s ? 'badge-gold' : 'badge-neutral'}`}
              style={{ cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          {ordersLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading orders…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No orders found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th></th><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <React.Fragment key={o.id}>
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>
                        <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="btn btn-ghost btn-sm" style={{ padding: '.4rem' }}>
                          <ChevronDown size={13} style={{ transform: expanded === o.id ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
                        </button>
                      </td>
                      <td style={{ fontFamily: 'var(--serif)', fontSize: '.82rem' }} title={o.id}>#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td>
                        <div style={{ fontSize: '.88rem' }}>{o.userName}</div>
                        <div style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>{o.userEmail || o.phone || '—'}</div>
                      </td>
                      <td style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                      <td style={{ color: 'var(--gold-bright)' }}>{fmt(o.total)}</td>
                      <td style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{fmtDate(o.createdAt)}</td>
                      <td><span className={`badge ${statusColor(o.status)}`}>{o.status}</span></td>
                      <td>
                        <select value={o.status} disabled={saving === o.id} onChange={e => changeStatus(o.id, e.target.value)}
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line)', color: 'var(--text-primary)', fontSize: '.76rem', padding: '.4rem .6rem', borderRadius: '3px' }}>
                          {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </motion.tr>
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={8} style={{ background: 'var(--bg-elevated)', padding: '1.2rem 1.6rem' }}>
                          <div className="admin-two-col">
                            <div>
                              <div style={{ fontSize: '.7rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '.6rem' }}>Items</div>
                              {(o.items || []).map((it, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.4rem 0', borderBottom: '1px solid var(--line-soft)' }}>
                                  {it.image && <img src={it.image} alt={it.name} style={{ width: 34, height: 42, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />}
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '.84rem' }}>{it.name}</div>
                                    <div style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>
                                      {[it.size, it.color].filter(Boolean).join(' · ')} {it.size || it.color ? '·' : ''} Qty {it.qty}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '.82rem', color: 'var(--gold-bright)' }}>{fmt((it.price || 0) * (it.qty || 1))}</div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div style={{ fontSize: '.7rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '.6rem' }}>Shipping</div>
                              <div style={{ fontSize: '.84rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                <div style={{ color: 'var(--text-primary)' }}>{o.userName}</div>
                                {o.phone && <div>{o.phone}</div>}
                                {o.address?.address && <div>{o.address.address}</div>}
                                <div>{[o.address?.city, o.address?.state, o.address?.pin].filter(Boolean).join(', ')}</div>
                              </div>
                              <div style={{ marginTop: '1rem', fontSize: '.82rem', color: 'var(--text-secondary)' }}>
                                {o.paymentMethod && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}><span>Payment</span><span style={{ color: 'var(--text-primary)' }}>{o.paymentMethod}{o.paymentStatus ? ` · ${o.paymentStatus}` : ''}</span></div>}
                                {o.paymentId && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}><span>Payment ID</span><span style={{ color: 'var(--text-primary)', fontSize: '.72rem' }}>{o.paymentId}</span></div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>{fmt(o.subtotal || 0)}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.3rem', color: 'var(--text-primary)' }}><span>Total</span><span style={{ color: 'var(--gold-bright)' }}>{fmt(o.total)}</span></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
