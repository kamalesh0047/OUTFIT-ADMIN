import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Boxes, ExternalLink, Menu, X, LogOut, Percent } from 'lucide-react'
import { useAdminData } from '../../lib/AdminData'

const NAV = [
  { to: '/admin',            label: 'Dashboard',  Icon: LayoutDashboard, end: true },
  { to: '/admin/products',   label: 'Products',   Icon: Package },
  { to: '/admin/categories', label: 'Categories', Icon: Tag },
  { to: '/admin/offers',     label: 'Offers',     Icon: Percent },
  { to: '/admin/orders',     label: 'Orders',     Icon: ShoppingCart },
  { to: '/admin/customers',  label: 'Customers',  Icon: Users },
  { to: '/admin/inventory',  label: 'Inventory',  Icon: Boxes },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pendingOrders } = useAdminData()

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(4,4,5,.7)', zIndex: 99 }} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.6rem 1.4rem 1rem', borderBottom: '1px solid var(--line-soft)' }}>
          <Link to="/" style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', letterSpacing: '.22em', fontWeight: 500 }}>AURELIS</Link>
          <div style={{ fontSize: '0.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '.3rem' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '1.2rem 0' }}>
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '.85rem',
                padding: '.85rem 1.4rem',
                fontSize: '0.82rem', letterSpacing: '.06em',
                color: isActive ? 'var(--gold-bright)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(200,164,93,.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'color .3s, background .3s',
              })}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {to === '/admin/orders' && pendingOrders > 0 && (
                <span style={{
                  minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '999px',
                  background: 'var(--gold)', color: '#060607', fontSize: '.68rem', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}>{pendingOrders}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid var(--line-soft)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '.7rem', fontSize: '.78rem', letterSpacing: '.08em', color: 'var(--text-tertiary)', transition: 'color .3s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-bright)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <ExternalLink size={14} /> View storefront
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-content">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="show-mobile" onClick={() => setSidebarOpen(v => !v)} style={{ color: 'var(--text-primary)' }}>
              <Menu size={20} />
            </button>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Maison admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '.78rem', color: 'var(--text-tertiary)' }}>Admin</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--gold-bright)' }}>A</div>
          </div>
        </div>
        <Outlet />
      </div>
      <style>{`.show-mobile{display:none}@media(max-width:768px){.show-mobile{display:flex}}`}</style>
    </div>
  )
}
