import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { fmt } from '../../store'
import { useAdminData } from '../../lib/AdminData'

// There is no Firestore "users" collection (customers sign in via Firebase Auth),
// so the customer list is derived from real orders in the shared database.
export default function AdminCustomers() {
  const { orders, ordersLoading } = useAdminData()

  const customers = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const key = o.userId || o.userEmail || o.userName
      if (!map[key]) {
        map[key] = {
          id: key,
          name: o.userName,
          email: o.userEmail,
          phone: o.phone,
          city: o.city,
          count: 0,
          total: 0,
          last: o.createdAt,
        }
      }
      const c = map[key]
      c.count++
      c.total += o.total || 0
      if (!c.email && o.userEmail) c.email = o.userEmail
      if (!c.phone && o.phone) c.phone = o.phone
      if (!c.city && o.city) c.city = o.city
      if (o.createdAt && (!c.last || o.createdAt > c.last)) c.last = o.createdAt
    })
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [orders])

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="admin-title">Customers</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '.2rem' }}>{customers.length} customers who have ordered</p>
      </div>
      <div className="admin-card">
        <div className="table-wrap">
          {ordersLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading customers…</div>
          ) : customers.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Users size={48} style={{ color: 'var(--line)', strokeWidth: 1, margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-tertiary)' }}>No customers yet — they appear here after their first order.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Contact</th><th>City</th><th>Last order</th><th>Orders</th><th>Spent</th></tr>
              </thead>
              <tbody>
                {customers.map(u => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '.9rem', color: 'var(--gold-bright)', flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '.82rem' }}>{u.email || u.phone || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '.84rem' }}>{u.city || '—'}</td>
                    <td style={{ fontSize: '.78rem', color: 'var(--text-tertiary)' }}>{u.last ? new Date(u.last).toLocaleDateString('en-IN') : '—'}</td>
                    <td>{u.count}</td>
                    <td style={{ color: 'var(--gold-bright)' }}>{fmt(u.total)}</td>
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
