import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Package, ShoppingCart, Users, ArrowRight } from 'lucide-react'
import { fmt } from '../../store'
import { labelForCategory } from '../../data/taxonomy'
import { useAdminData } from '../../lib/AdminData'

export default function AdminDashboard() {
  const { analytics: data, orders } = useAdminData()
  const recentOrders = orders.slice(0, 5)

  const stats = [
    { label: 'Total revenue', value: fmt(data.revenue), sub: `${data.ordersCount} orders`, Icon: TrendingUp, color: 'var(--gold)' },
    { label: 'Products', value: data.productsCount, sub: 'in collection', Icon: Package, color: 'var(--platinum)' },
    { label: 'Orders', value: data.ordersCount, sub: 'all time', Icon: ShoppingCart, color: 'var(--gold-bright)' },
    { label: 'Customers', value: data.usersCount, sub: 'who ordered', Icon: Users, color: 'var(--text-secondary)' },
  ]

  const statusColor = s => ({ Pending: 'badge-gold', Confirmed: 'badge-gold', Processing: 'badge-neutral', Shipped: 'badge-success', Delivered: 'badge-success', Cancelled: 'badge-error' }[s] || 'badge-neutral')

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="admin-title">Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '.3rem' }}>Aurelis Maison overview</p>
      </div>

      {/* stats */}
      <div className="admin-stat-grid" style={{ marginBottom: '2rem' }}>
        {stats.map(({ label, value, sub, Icon, color }, i) => (
          <motion.div key={label} className="admin-stat-card"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="s-label">{label}</span>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="s-value" style={{ color }}>{value}</div>
            <div className="s-sub">{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* two-col */}
      <div className="admin-two-col">
        {/* recent orders */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Recent orders</h3>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">View all <ArrowRight size={11} /></Link>
          </div>
          <div className="table-wrap">
            {recentOrders.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '.88rem' }}>No orders yet.</div>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'var(--serif)', fontSize: '.82rem' }}>#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '.84rem' }}>{o.userName}</td>
                      <td style={{ color: 'var(--gold-bright)' }}>{fmt(o.total)}</td>
                      <td><span className={`badge ${statusColor(o.status)}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* top products */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Top products</h3>
            <Link to="/admin/products" className="btn btn-ghost btn-sm">Manage <ArrowRight size={11} /></Link>
          </div>
          <div>
            {data.topProducts.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '.88rem' }}>No products added yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.topProducts.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.4rem', borderBottom: i < data.topProducts.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--serif)', color: 'var(--text-tertiary)', fontSize: '1.2rem', minWidth: '20px' }}>0{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.9rem' }}>{p.name}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-tertiary)', marginTop: '.1rem' }}>{labelForCategory(p.category)}</div>
                    </div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{p.sold || 0} sold</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
