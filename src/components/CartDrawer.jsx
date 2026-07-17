import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { inr } from './Price.jsx'
import { useState, useEffect } from 'react'
import './cart-drawer.css'

export default function CartDrawer() {
  const { open, setOpen, items, removeItem, setQty, subtotal, discount, tax, shipping, total, applyCoupon, coupon } = useCart()
  const { isLoggedIn } = useAuth()
  const { addToast } = useToast()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const location = useLocation()

  // Close the drawer on any route change so it never covers a new page
  useEffect(() => { setOpen(false) }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lock background scroll while the drawer is open (mobile fix)
  useEffect(() => {
    if (open) document.body.classList.add('no-scroll')
    else document.body.classList.remove('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  const handleCheckout = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      addToast('Please log in to continue', {
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/account'
        },
        duration: 0
      })
    } else {
      setOpen(false)
    }
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer__scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} />
          <motion.aside className="drawer" role="dialog" aria-label="Shopping cart"
            initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'tween',duration:.4,ease:[0.22,0.61,0.36,1]}}>
            <header className="drawer__head"><h3>Your Cart</h3><button className="nav__icon" aria-label="Close" onClick={()=>setOpen(false)}><X size={20}/></button></header>
            <div className="drawer__items">
              <AnimatePresence initial={false}>
                {items.length===0 && (
                  <div className="drawer__empty">
                    <p>Your cart is empty.</p>
                    <button className="btn btn--ghost" style={{marginTop:14}} onClick={()=>setOpen(false)}>Continue Shopping</button>
                  </div>
                )}
                {items.map(it=>(
                  <motion.div key={it.key} className="drawer__item" layout
                    initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:24,height:0,marginBottom:0,paddingTop:0,paddingBottom:0}}>
                        <img
    src={it.image || it.imageUrl}
    alt={it.name}
    loading="lazy"
  />
                    <div className="drawer__meta">
                      <span className="drawer__brand">{it.brand}</span>
                      <strong>{it.name}</strong>
                      <span className="drawer__opts">{[it.size,it.color].filter(Boolean).join(' · ')}</span>
                      <div className="drawer__qty">
                        <button aria-label="Decrease" onClick={()=>setQty(it.key,it.qty-1)}><Minus size={14}/></button>
                        <span>{it.qty}</span>
                        <button aria-label="Increase" onClick={()=>{
                          const result = setQty(it.key, it.qty+1)
                          if (!result.ok) addToast(result.message)
                        }}><Plus size={14}/></button>
                      </div>
                    </div>
                    <div className="drawer__right"><strong>{inr(it.price*it.qty)}</strong><button className="drawer__rm" aria-label="Remove" onClick={()=>removeItem(it.key)}><Trash2 size={16}/></button></div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {items.length>0 && (
              <footer className="drawer__foot">
                <div className="drawer__coupon">
                  <input className="input" placeholder="Coupon (try OUTFIT10)" value={code} onChange={e=>setCode(e.target.value)} />
                  <button className="btn btn--ghost" onClick={()=>setMsg(applyCoupon(code)?'Applied':'Invalid code')}>Apply</button>
                </div>
                {msg && <span className="drawer__msg">{msg}{coupon?` — ${coupon.code}`:''}</span>}
                <Row label="Subtotal" val={inr(subtotal)} />
                {discount>0 && <Row label="Discount" val={'-'+inr(discount)} />}
                <Row label="Tax (5%)" val={inr(tax)} />
                <Row label="Shipping" val={shipping===0?'Free':inr(shipping)} />
                <Row label="Total" val={inr(total)} strong />
                <Link to={isLoggedIn ? "/checkout" : "#"} className="btn btn--block" onClick={handleCheckout}>Secure Checkout</Link>
                <button className="btn btn--ghost btn--block" onClick={()=>setOpen(false)}>Continue Shopping</button>
                <p className="drawer__secure"><ShieldCheck size={14}/> Encrypted & secure payments</p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
function Row({label,val,strong}){return <div className={'drawer__row'+(strong?' is-total':'')}><span>{label}</span><span>{val}</span></div>}
