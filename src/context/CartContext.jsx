import { createContext, useContext, useReducer, useState, useMemo, useCallback } from 'react'

const CartContext = createContext(null)
const initial = { items: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = action.payload.key
      const existing = state.items.find(i => i.key === key)
      if (existing) return { items: state.items.map(i => i.key === key ? { ...i, qty: i.qty + action.payload.qty } : i) }
      return { items: [...state.items, action.payload] }
    }
    case 'REMOVE': return { items: state.items.filter(i => i.key !== action.payload) }
    case 'QTY': return { items: state.items.map(i => i.key === action.payload.key ? { ...i, qty: Math.max(1, action.payload.qty) } : i) }
    case 'CLEAR': return { items: [] }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const [open, setOpen] = useState(false)
  const [coupon, setCoupon] = useState(null)

  const subtotal = useMemo(() => state.items.reduce((s, i) => s + i.price * i.qty, 0), [state.items])
  const discount = coupon ? Math.round(subtotal * coupon.rate) : 0
  const taxable = subtotal - discount
  const tax = Math.round(taxable * 0.05)
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : subtotal >= 1000 ? 50 : subtotal >= 300 ? 75 : 0
  const total = taxable + tax + shipping
  const count = state.items.reduce((s, i) => s + i.qty, 0)

  // Returns how many of a product (by id) are already in the cart
  const qtyInCart = useCallback((productId) => {
    return state.items.filter(i => i.id === productId).reduce((s, i) => s + i.qty, 0)
  }, [state.items])

  // Stock-aware add: returns { ok, message }
  const addItem = (product, { size, color, qty = 1 } = {}) => {
    const stock = Number(product.stock ?? Infinity)
    const alreadyInCart = qtyInCart(product.id)

    if (stock === 0) {
      return { ok: false, message: `${product.name} is out of stock` }
    }

    if (alreadyInCart + qty > stock) {
      const canAdd = stock - alreadyInCart
      if (canAdd <= 0) {
        return { ok: false, message: `You already have all ${stock} in stock in your bag` }
      }
      return { ok: false, message: `Only ${stock} available — you already have ${alreadyInCart} in your bag` }
    }

    const key = [product.id, size, color].filter(Boolean).join('-')
    dispatch({
      type: 'ADD',
      payload: {
        key, id: product.id, name: product.name, brand: product.brand,
        image: product.image || product.imageUrl, price: product.price,
        size, color, qty, stock,
      },
    })
    setOpen(true)
    return { ok: true }
  }

  // Stock-aware qty change for cart drawer
  const setQty = (key, qty) => {
    const item = state.items.find(i => i.key === key)
    if (item) {
      const stock = Number(item.stock ?? Infinity)
      if (qty > stock) {
        return { ok: false, message: `Only ${stock} available` }
      }
    }
    dispatch({ type: 'QTY', payload: { key, qty } })
    return { ok: true }
  }

  const applyCoupon = (code) => {
    const codes = { OUTFIT10: { code: 'OUTFIT10', rate: 0.10 }, STYLE20: { code: 'STYLE20', rate: 0.20 } }
    const c = codes[code?.toUpperCase()]
    setCoupon(c || null)
    return !!c
  }

  return (
    <CartContext.Provider value={{
      items: state.items, dispatch, open, setOpen, addItem, qtyInCart,
      removeItem: (k) => dispatch({ type: 'REMOVE', payload: k }),
      setQty,
      clear: () => dispatch({ type: 'CLEAR' }),
      coupon, applyCoupon, subtotal, discount, tax, shipping, total, count
    }}>
      {children}
    </CartContext.Provider>
  )
}
export const useCart = () => useContext(CartContext)
