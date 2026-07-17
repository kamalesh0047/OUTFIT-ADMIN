import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import PageLoader from './components/admin/PageLoader'
import AdminToast from './components/admin/AdminToast'
import { AdminDataProvider } from './lib/AdminData'

// --- Admin pages (lazy) ---
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts   = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders     = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCustomers  = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminInventory  = lazy(() => import('./pages/admin/AdminInventory'))
const AdminAnalytics  = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminOffers     = lazy(() => import('./pages/admin/AdminOffers'))

export default function App() {
  return (
    <>
      <div className="grain" />
      <AdminToast />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDataProvider><AdminLayout /></AdminDataProvider>}>
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategories /></Suspense>} />
          <Route path="offers" element={<Suspense fallback={<PageLoader />}><AdminOffers /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<PageLoader />}><AdminCustomers /></Suspense>} />
          <Route path="inventory" element={<Suspense fallback={<PageLoader />}><AdminInventory /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense>} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </>
  )
}
