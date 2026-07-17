import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Minus, Plus, ArrowLeft } from 'lucide-react'
import { getProduct, getProductsByCategory } from "../services/productService";
import Rating from '../components/Rating.jsx'
import Price from '../components/Price.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { addItem, setOpen } = useCart()
  const { has, toggle } = useWishlist()
  const { isLoggedIn } = useAuth()
  const { addToast } = useToast()

  const [p, setP] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [active, setActive] = useState(0)
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState("desc")
  useEffect(() => {
  loadProduct();
}, [id]);

const loadProduct = async () => {
  try {
    const product = await getProduct(id);

    setP(product);

    if (product) {
      setSize(product.sizes?.[0] || "");
      setColor(product.colors?.[0] || "");

      // Related: everything in the same category (subcategory alone is
      // usually too narrow), preferring same-subcategory items first.
      const items = await getProductsByCategory(product.category);
      const others = items.filter((x) => x.id !== product.id);
      const sameSub = others.filter((x) => x.subcategory === product.subcategory);
      const rest = others.filter((x) => x.subcategory !== product.subcategory);
      setRelatedProducts([...sameSub, ...rest].slice(0, 4));
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleBuyNow = () => {
  if (!isLoggedIn) {
    navigate("/account", { state: { from: location.pathname } });
    return;
  }
  if (Number(p.stock ?? 0) === 0) { addToast('This product is out of stock'); return }
  const result = addItem({ ...p, image: p.imageUrl || p.image }, { size, color, qty });
  if (!result.ok) { addToast(result.message); return }
  navigate("/checkout");
}
if (loading) {
  return (
    <div className="container section">
      <h2>Loading...</h2>
    </div>
  );
}

if (!p)
  return (
    <div className="container section">
      <h2>Product not found</h2>
      <Link className="btn" to="/">Back home</Link>
    </div>
  );

const gallery = p.gallery ?? [p.imageUrl || p.image];
const colors = p.colors ?? [];
const sizes = p.sizes ?? [];
const specs = p.specs ?? [];
const care = p.care ?? [];

const liked = has(p.id);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.4}}>
      <section className="section container pdp">
        <div className="pdp__gallery">
          <div className="pdp__main">
  <motion.img
  key={active}
  src={gallery[active]}
  alt={p.name}
  initial={{ opacity: 0, scale: 1.02 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
/></div>
          <div className="pdp__thumbs">
  {gallery.map((g, i) => (
    <button
      key={i}
      className={'pdp__thumb' + (i === active ? ' is-on' : '')}
      onClick={() => setActive(i)}
    >
      <img src={g} alt="" loading="lazy" />
    </button>
  ))}</div>
        </div>
        <div className="pdp__info">
          <button className="btn btn--ghost pdp__back" onClick={() => window.history.back()} style={{marginBottom:'0.6rem',display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'13px',padding:'8px 14px'}}>
            <ArrowLeft size={15}/> Back
          </button>
          <nav className="crumbs"><Link to="/">Home</Link> / <Link to={`/category/${p.category}`}>{p.category}</Link> / <span>{p.name}</span></nav>
          <span className="eyebrow">{p.brand || "OUTFIT"}</span>
          <h1>{p.name}</h1>
          <div className="pdp__rate"><Rating
  value={p.rating || 5}
  count={p.reviews || 0}
/></div>
          <div className="pdp__price"><Price
  price={p.price}
  original={Number(p.original || p.originalPrice)}
/>
{Number(p.originalPrice) > p.price && 
<span className="pdp__save">Save {Math.round(((Number(p.originalPrice) - p.price) / Number(p.originalPrice)) * 100)}%</span>}</div>
          <p className="pdp__desc">{p.description}</p>
          {colors.length>0 && <div className="pdp__opt"><span className="pdp__opt-label">Color: <strong>{color}</strong></span><div className="pdp__sAccesories">{colors.map(c=>(<button key={c} className={'pdp__sw'+(c===color?' is-on':'')} onClick={()=>setColor(c)}>{c}</button>))}</div></div>}
          {sizes.length>0 && <div className="pdp__opt"><span className="pdp__opt-label">Size: <strong>{size}</strong></span><div className="pdp__sizes">{sizes.map(s=>(<button key={s} className={'pdp__size'+(s===size?' is-on':'')} onClick={()=>setSize(s)}>{s}</button>))}</div></div>}
          <div className="pdp__buyrow">
            <div className="pdp__qty">
              <button aria-label="Decrease" onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus size={14}/></button>
              <span>{qty}</span>
              <button aria-label="Increase" onClick={()=>{
                const stock = Number(p.stock ?? 0)
                if (qty >= stock) { addToast(`Only ${stock} available`); return }
                setQty(q=>q+1)
              }}><Plus size={14}/></button>
            </div>
            <span className={'pdp__stock' + (Number(p.stock ?? 0) === 0 ? ' is-oos' : Number(p.stock ?? 0) <= 5 ? ' is-low' : '')}>
              {Number(p.stock ?? 0) === 0 ? 'Out of stock' : Number(p.stock ?? 0) <= 5 ? `Only ${p.stock} left` : `${p.stock} in stock`}
            </span>
          </div>
          <div className="pdp__cta">
 <button
  className="btn btn--block"
  disabled={Number(p.stock ?? 0) === 0}
  onClick={() => {
    const result = addItem(
      { ...p, image: p.imageUrl || p.image },
      { size, color, qty }
    );
    if (!result.ok) { addToast(result.message); return }
    setOpen(true);
  }}
>
  <ShoppingBag size={16} />
  {Number(p.stock ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
</button>

  <button className="btn btn--ghost" onClick={handleBuyNow}>
    Buy Now
  </button>

  <button
    className={'pdp__wish' + (liked ? ' is-on' : '')}
    aria-label="Wishlist"
    onClick={() => {
      if (!isLoggedIn) {
        navigate("/account", {
          state: {
            from: location.pathname,
          },
        });
        return;
      }

      toggle(p.id);
    }}
  >
    <Heart size={18} fill={liked ? '#0A0A0A' : 'none'} />
  </button>
</div>
          <div className="pdp__assure">
            <span><Truck size={16}/> Est. delivery 2–4 days</span><span><RefreshCw size={16}/> 30-day returns</span><span><ShieldCheck size={16}/> Secure checkout</span>
          </div>
          <div className="pdp__tabs">
            <div className="pdp__tabnav">{[['desc','Description']].map(([k,l])=>(<button key={k} className={tab===k?'is-on':''} onClick={()=>setTab(k)}>{l}</button>))}</div>
            <div className="pdp__tabbody">
              {tab==='desc' && <p>
  {p.description || "No description available."}
</p>}
              {tab==='specs' && <ul className="pdp__list">{specs.length
  ? specs.map(([k,v])=>(
      <li key={k}>
        <span>{k}</span>
        <strong>{v}</strong>
      </li>
    ))
  : <p>No specifications available.</p>
}</ul>}
              {tab==='care' && <ul className="pdp__bullets">{care.length
  ? care.map(c=>(
      <li key={c}>{c}</li>
    ))
  : <p>No care instructions available.</p>
}</ul>}
            </div>
          </div>
        </div>
      </section>
      {relatedProducts.length > 0 && (
        <section className="section container">
          <Reveal><div className="section__head"><span className="eyebrow">You may also like</span><h2>Related Products</h2></div></Reveal>
          <div className="grid grid--4">{relatedProducts.map((r, i) =>(<Reveal key={r.id} delay={i*.05}><ProductCard product={r} /></Reveal>))}</div>
        </section>
      )}
    </motion.div>
  )
}
