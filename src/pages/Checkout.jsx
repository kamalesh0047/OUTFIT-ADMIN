import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { inr } from '../components/Price.jsx'
import { placeOrder } from "../services/orderService";
import { payWithRazorpay } from "../services/paymentService";
import { getAuth } from "firebase/auth";
const STEPS = ['Address','Payment','Review']
export default function Checkout() {
  const { items, subtotal, discount, tax, shipping, total, clear, coupon } = useCart()
  const { addToast } = useToast()
  const [step,setStep] = useState(0)
  const [done,setDone] = useState(false)
  const [payMethod,setPayMethod] = useState('Card')
  const [placing,setPlacing] = useState(false)
  const [formData,setFormData] = useState({
    'Full name':'',
    'Phone':'',
    'Address line':'',
    'City':'',
    'State':'',
    'PIN code':''
  })
  const [errors,setErrors] = useState({})

  const validateAddress = () => {
    const newErrors = {}

    if (!formData['Full name']?.trim()) {
      newErrors['Full name'] = 'Full name is required'
    } else if (formData['Full name'].trim().length < 3) {
      newErrors['Full name'] = 'Full name must be at least 3 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData['Full name'])) {
      newErrors['Full name'] = 'Full name should only contain letters'
    }

    if (!formData['Phone']?.trim()) {
      newErrors['Phone'] = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData['Phone'].replace(/\D/g, ''))) {
      newErrors['Phone'] = 'Phone number must be 10 digits'
    }

    if (!formData['Address line']?.trim()) {
      newErrors['Address line'] = 'Address line is required'
    } else if (formData['Address line'].trim().length < 5) {
      newErrors['Address line'] = 'Address must be at least 5 characters'
    }

    if (!formData['City']?.trim()) {
      newErrors['City'] = 'City is required'
    } else if (!/^[a-zA-Z\s\-]+$/.test(formData['City'])) {
      newErrors['City'] = 'City should only contain letters'
    }

    if (!formData['State']?.trim()) {
      newErrors['State'] = 'State is required'
    } else if (!/^[a-zA-Z\s\-]+$/.test(formData['State'])) {
      newErrors['State'] = 'State should only contain letters'
    }

    if (!formData['PIN code']?.trim()) {
      newErrors['PIN code'] = 'PIN code is required'
    } else if (!/^\d{6}$/.test(formData['PIN code'])) {
      newErrors['PIN code'] = 'PIN code must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const next = async () => {
  if (step === 0 && !validateAddress()) return;

  if (step < STEPS.length - 1) {
    setStep(s => s + 1);
    return;
  }

  if (items.length === 0) return; // nothing to order

  const user = getAuth().currentUser;
  if (!user || placing) return;

  const baseOrder = {
    userId: user.uid,
    userEmail: user.email || "",
    customerName: formData["Full name"],
    phone: formData["Phone"],
    address: {
      address: formData["Address line"],
      city: formData["City"],
      state: formData["State"],
      pin: formData["PIN code"],
    },
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    paymentMethod: payMethod,
  };

  try {
    setPlacing(true);

    if (payMethod === "Cash on Delivery") {
      // COD — no gateway, order goes straight in
      await placeOrder({ ...baseOrder, paymentStatus: "COD" });
    } else {
      // Card / UPI — amount is priced server-side from the cart, so the
      // UPI app / card sheet shows the exact total automatically.
      const pay = await payWithRazorpay({
        items,
        couponCode: coupon?.code || "",
        customer: {
          name: formData["Full name"],
          email: user.email || "",
          phone: formData["Phone"],
        },
        method: payMethod,
      });
      await placeOrder({
        ...baseOrder,
        total: pay.amountPaid / 100, // what was actually paid (server-verified)
        paymentStatus: "Paid",
        paymentId: pay.paymentId,
        razorpayOrderId: pay.razorpayOrderId,
      });
    }

    clear();
    setDone(true);
  } catch (err) {
    console.error("Order failed:", err);
    addToast(err?.message || "Something went wrong — you have not been charged");
  } finally {
    setPlacing(false);
  }
};
  if(done) return (
    <div className="container section" style={{textAlign:'center',maxWidth:560}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,damping:14}} style={{width:72,height:72,borderRadius:'50%',background:'var(--ink)',color:'F5F5DCf',display:'grid',placeItems:'center',margin:'0 auto 20px'}}><Check size={34}/></motion.div>
      <h1>Order confirmed</h1><p style={{color:'var(--muted)'}}>Thank you for shopping with OUTFIT. A confirmation has been sent to your email.</p>
    </div>
  )
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="container section checkout">
      <div className="checkout__main">
        <div className="steps">{STEPS.map((s,i)=>(<div key={s} className={'steps__item'+(i<=step?' is-on':'')}><span className="steps__dot">{i<step?<Check size={14}/>:i+1}</span><span>{s}</span></div>))}</div>
        <motion.div key={step} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{duration:.35}} className="checkout__panel">
          {step===0 && <Form fields={[['Full name','text'],['Phone','tel'],['Address line','text'],['City','text'],['State','text'],['PIN code','text']]} title="Shipping address" data={formData} onChange={setFormData} errors={errors} />}
          {step===1 && <div className="opts">{[['Card','Visa, Mastercard, Amex'],['UPI','GPay, PhonePe, Paytm'],['Cash on Delivery','Pay when it arrives']].map(([t,s])=>(<label key={t} className="opt"><input type="radio" name="pay" checked={payMethod===t} onChange={()=>setPayMethod(t)}/><div><strong>{t}</strong><span>{s}</span></div></label>))}</div>}
          {step===2 && <div><h3 style={{marginBottom:12}}>Review your order</h3>{items.map(it=>(<div key={it.key} className="checkout__line"><span>{it.name} × {it.qty}</span><strong>{inr(it.price*it.qty)}</strong></div>))}{items.length>0 && <div className="checkout__line" style={{marginTop:8,color:'var(--muted)'}}><span>Payment method</span><strong>{payMethod}</strong></div>}{items.length===0 && <p style={{color:'var(--muted)'}}>Your cart is empty.</p>}</div>}
        </motion.div>
        <div className="checkout__nav">{step>0 && <button className="btn btn--ghost" onClick={()=>setStep(s=>s-1)} disabled={placing}>Back</button>}<button className="btn" onClick={next} disabled={placing || (step===STEPS.length-1 && items.length===0)}>{placing?'Processing…':step===STEPS.length-1?(payMethod==='Cash on Delivery'?'Place Order':`Pay ${inr(total)}`):'Continue'}</button></div>
      </div>
      <aside className="checkout__summary">
        <h3>Order Summary</h3>
        <Row l="Subtotal" v={inr(subtotal)} />{discount>0 && <Row l="Discount" v={'-'+inr(discount)} />}<Row l="Tax" v={inr(tax)} /><Row l="Shipping" v={shipping===0?'Free':inr(shipping)} /><Row l="Total" v={inr(total)} strong />
      </aside>
    </motion.div>
  )
}
function Form({fields,title,data,onChange,errors}){return <div><h3 style={{marginBottom:14}}>{title}</h3><div className="grid grid--2">{fields.map(([l,t])=>(<div key={l} className="field"><label>{l}</label><input className={`input ${errors?.[l]?'input-error':''}`} type={t} value={data?.[l]||''} onChange={(e)=>onChange({...data,[l]:e.target.value})}/>{errors?.[l] && <span className="field-error">{errors[l]}</span>}</div>))}</div></div>}
function Row({l,v,strong}){return <div className={'drawer__row'+(strong?' is-total':'')}><span>{l}</span><span>{v}</span></div>}
