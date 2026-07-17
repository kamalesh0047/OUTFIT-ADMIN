import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'
import { fmt } from '../../store'
import { CATEGORY_SLUGS, labelForCategory } from '../../data/taxonomy'
import { useAdminData } from '../../lib/AdminData'

export default function AdminAnalytics() {
  const { analytics: data, products, orders } = useAdminData()

  const maxRevenue = Math.max(...data.monthlySales.map(m => m.revenue), 1)

  // revenue per storefront category, matched through the order line items
  const byCat = useMemo(() => {
    const productCat = Object.fromEntries(products.map(p => [p.id, p.category]))
    const rev = {}
    const cnt = {}
    CATEGORY_SLUGS.forEach(c => { rev[c] = 0; cnt[c] = 0 })
    products.forEach(p => { if (cnt[p.category] !== undefined) cnt[p.category]++ })
    orders.forEach(o => (o.items || []).forEach(i => {
      const cat = productCat[i.id]
      if (cat && rev[cat] !== undefined) rev[cat] += (i.price || 0) * (i.qty || 1)
    }))
    return CATEGORY_SLUGS.map(cat => ({ cat, revenue: rev[cat], count: cnt[cat] }))
  }, [products, orders])

  const maxCat = Math.max(...byCat.map(b => b.revenue), 1)

  return (
    <div className="admin-page">
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 className="admin-title">Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '.2rem' }}>Sales overview across all houses</p>
      </div>

      <div className="admin-stat-grid" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total revenue', value: fmt(data.revenue), Icon: TrendingUp },
          { label: 'Total orders', value: data.ordersCount, Icon: ShoppingCart },
          { label: 'Products', value: data.productsCount, Icon: Package },
          { label: 'Customers', value: data.usersCount, Icon: Users },
        ].map(({ label, value, Icon }, i) => (
          <motion.div key={label} className="admin-stat-card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="s-label">{label}</span>
              <Icon size={16} style={{ color: 'var(--gold)' }} />
            </div>
            <div className="s-value" style={{ color: 'var(--gold-bright)' }}>{value}</div>
          </motion.div>
        ))}
      </div>

      <div className="admin-two-col">
        {/* monthly bar chart */}
        <div className="admin-card">
          <div className="admin-card-head"><h3>Monthly revenue</h3></div>
          <div className="admin-card-body">
            {data.monthlySales.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No sales data yet.</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.7rem', height: '200px', paddingTop: '1rem' }}>
                {data.monthlySales.map((m, i) => {
                  const pct = Math.round((m.revenue / maxRevenue) * 100)
                  return (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '.68rem', color: 'var(--gold-bright)' }}>{fmt(m.revenue).split(' ')[1]}</div>
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 4)}%` }}
                        transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16,1,0.3,1] }}
                        style={{ width: '100%', background: 'linear-gradient(to top, var(--gold-deep), var(--gold-bright))', minHeight: '4px' }}
                      />
                      <div style={{ fontSize: '.64rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{m.month.slice(5)}/{m.month.slice(2, 4)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* by category */}
        <div className="admin-card">
          <div className="admin-card-head"><h3>Revenue by house</h3></div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {byCat.map(({ cat, revenue }) => {
              const pct = Math.round((revenue / maxCat) * 100)
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', marginBottom: '.35rem' }}>
                    <span>{labelForCategory(cat)}</span>
                    <span style={{ color: 'var(--gold-bright)' }}>{fmt(revenue)}</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '999px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 2)}%` }}
                      transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-bright))' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* top products table */}
      {data.topProducts.length > 0 && (
        <div className="admin-card" style={{ marginTop: '1.4rem' }}>
          <div className="admin-card-head"><h3>Top selling pieces</h3></div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Rank</th><th>Product</th><th>Category</th><th>Price</th><th>Sold</th></tr></thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--serif)', color: 'var(--text-tertiary)', fontSize: '1.1rem' }}>0{i + 1}</td>
                    <td style={{ fontFamily: 'var(--serif)' }}>{p.name}</td>
                    <td><span className="badge badge-neutral">{labelForCategory(p.category)}</span></td>
                    <td style={{ color: 'var(--gold-bright)' }}>{fmt(p.price)}</td>
                    <td>{p.sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
