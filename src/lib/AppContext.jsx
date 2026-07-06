import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getSession, setSession, clearSession,
  cartCount, getCart, saveCart, cartAdd, cartRemove, cartSetQty, clearCart, getCartItems,
  getWishlist, saveWishlist, toggleWishlist as storeToggleWishlist, isWishlisted,
} from '../store'

const Ctx = createContext(null)

let _toastId = 0
const toastListeners = new Set()
export const emitToast = (msg, type = 'default') => {
  const id = ++_toastId
  toastListeners.forEach(fn => fn({ id, msg, type }))
}

export function AppProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession())
  const [cartQty, setCartQty] = useState(() => cartCount())
  const [wishlistIds, setWishlistIds] = useState(() => getWishlist())
  const [toasts, setToasts] = useState([])

  // subscribe to toast emitter
  useEffect(() => {
    const fn = t => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000)
    }
    toastListeners.add(fn)
    return () => toastListeners.delete(fn)
  }, [])

  const refreshCart = useCallback(() => setCartQty(cartCount()), [])
  const refreshWishlist = useCallback(() => setWishlistIds(getWishlist()), [])

  const login = useCallback(user => { setSession(user); setSessionState(user) }, [])
  const logout = useCallback(() => { clearSession(); setSessionState(null); clearCart(); refreshCart() }, [refreshCart])

  const addToCart = useCallback((productId, qty = 1, size = null) => {
    cartAdd(productId, qty, size); refreshCart()
    emitToast('Added to your bag')
  }, [refreshCart])

  const removeFromCart = useCallback(key => { cartRemove(key); refreshCart() }, [refreshCart])
  const setQty = useCallback((key, qty) => { cartSetQty(key, qty); refreshCart() }, [refreshCart])
  const clearCartCtx = useCallback(() => { clearCart(); refreshCart() }, [refreshCart])

  const toggleWishlist = useCallback(id => {
    const added = storeToggleWishlist(id); refreshWishlist()
    emitToast(added ? 'Added to wishlist' : 'Removed from wishlist')
    return added
  }, [refreshWishlist])

  const value = {
    session, login, logout,
    cartQty, refreshCart, addToCart, removeFromCart, setQty, clearCartCtx,
    wishlistIds, toggleWishlist, isWishlisted,
    toasts,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
