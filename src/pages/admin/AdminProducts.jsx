import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, X, Loader2 } from 'lucide-react'
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import {
  CATEGORY_OPTIONS,
  CATEGORY_SLUGS,
  groupsFor,
  sizesFor,
  labelForCategory,
  labelForSub,
} from "../../data/taxonomy";
import { fmt } from "../../store";
import { emitToast } from '../../lib/AppContext'
import { useAdminData } from '../../lib/AdminData'

// Compress an image file to a small JPEG data URL that fits inside a Firestore doc.
// Resizes to max 600px wide and compresses to ~60-120KB JPEG.
function compressImage(file, maxWidth = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// category is the storefront top-level slug, subcategory is the storefront sub slug.
// These two fields are what the storefront queries on — nothing else needs to match.
const BLANK = {
  name: '',
  category: CATEGORY_SLUGS[0],
  subcategory: '',
  price: '',
  originalPrice: '',
  onSale: false,
  isOffer: false,
  stock: '',
  description: '',
  imageUrl: '',
  gallery: [],
  sizes: [],
  specs: '',
}

export default function AdminProducts() {
  const { products, productsLoading } = useAdminData()

  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [modal, setModal] = useState(null) // null | 'add' | product obj
  const [form, setForm] = useState(BLANK)
  const [delConfirm, setDelConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'All' || p.category === catFilter
    const matchSearch = !search.trim() || p.name?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const openAdd = () => { setForm(BLANK); setModal('add') }
  const openEdit = p => {
    const gallery = Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : Array.isArray(p.images) && p.images.length
      ? p.images
      : (p.imageUrl || p.image ? [p.imageUrl || p.image] : [])
    setForm({
      ...p,
      imageUrl: gallery[0] || p.imageUrl || p.image || '',
      gallery,
      subcategory: p.subcategory || '',
      originalPrice: p.originalPrice || '',
      onSale: p.onSale || false,
      isOffer: p.isOffer || false,
      specs: typeof p.specs === 'object' ? JSON.stringify(p.specs) : (p.specs || ''),
    })
    setModal(p)
  }
  const closeModal = () => setModal(null)

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleSize = s => setF('sizes', form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)))
      setForm((prev) => {
        const gallery = [...(prev.gallery || []), ...compressed].slice(0, 8)
        return { ...prev, gallery, imageUrl: gallery[0] || prev.imageUrl }
      })
      emitToast(compressed.length > 1 ? `${compressed.length} photos added` : 'Photo added')
    } catch (err) {
      console.error('Image compression failed:', err)
      emitToast('Failed to process image')
    }
    e.target.value = ''
  }

  const removeGalleryImage = (idx) => {
    setForm((prev) => {
      const gallery = (prev.gallery || []).filter((_, i) => i !== idx)
      return { ...prev, gallery, imageUrl: gallery[0] || '' }
    })
  }

  const moveGalleryImage = (idx, dir) => {
    setForm((prev) => {
      const gallery = [...(prev.gallery || [])]
      const j = idx + dir
      if (j < 0 || j >= gallery.length) return prev
      ;[gallery[idx], gallery[j]] = [gallery[j], gallery[idx]]
      return { ...prev, gallery, imageUrl: gallery[0] || '' }
    })
  }

  const save = async () => {
    if (!form.name.trim()) { emitToast("Product name is required"); return }
    if (!form.category) { emitToast("Category is required"); return }
    if (!form.subcategory) { emitToast("Pick a subcategory — it decides the storefront shelf"); return }
    if (!form.price || isNaN(form.price)) { emitToast("Valid price is required"); return }

    setSaving(true)

    try {
      let imageUrl = form.imageUrl || ''
      // Strip blob: URLs (shouldn't happen now but safety net)
      if (imageUrl.startsWith('blob:')) imageUrl = ''

      const gallery = (form.gallery && form.gallery.length)
        ? form.gallery
        : (imageUrl ? [imageUrl] : [])
      const primary = gallery[0] || imageUrl || ''

      const data = {
        name: form.name.trim(),
        category: form.category,
        subcategory: form.subcategory,
        price: Number(form.price),
        originalPrice: form.originalPrice !== '' && !isNaN(form.originalPrice) ? Number(form.originalPrice) : null,
        onSale: form.onSale || false,
        isOffer: !!form.isOffer,
        stock: Number(form.stock) || 0,
        description: form.description || '',
        imageUrl: primary,
        image: primary,
        gallery,
        images: gallery,
        sizes: form.sizes || [],
        specs: form.specs || '',
      }

      // try to parse specs as JSON (array of [key, value] pairs)
      if (typeof data.specs === "string" && data.specs.trim()) {
        try { data.specs = JSON.parse(data.specs) } catch { /* leave as string */ }
      }

      if (modal === "add") {
        await addProduct(data)
        emitToast("Product added — live on the store")
      } else {
        await updateProduct(modal.id, data)
        emitToast("Product updated")
      }
      closeModal()
    } catch (err) {
      console.error("Save Error:", err)
      emitToast(err.message || "Error saving product — check the console")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async id => {
    try {
      await deleteProduct(id)
      setDelConfirm(null)
      emitToast('Product removed')
    } catch (error) {
      console.error('Error deleting product:', error)
      emitToast('Failed to delete product')
    }
  }

  const availGroups = groupsFor(form.category)
  const availSizes = sizesFor(form.category, form.subcategory)
  const previewImg = (form.gallery && form.gallery[0]) || form.imageUrl?.trim() || `https://picsum.photos/seed/${form.name || 'product'}/300/375`

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <h1 className="admin-title">Products</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '.2rem' }}>{products.length} piece{products.length !== 1 ? 's' : ''} in collection</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add product</button>
      </div>

      {/* toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ maxWidth: '280px' }}>
          <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />
          {search && <button onClick={() => setSearch('')}><X size={12} style={{ color: 'var(--text-tertiary)' }} /></button>}
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {['All', ...CATEGORY_SLUGS].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`badge ${catFilter === c ? 'badge-gold' : 'badge-neutral'}`}
              style={{ cursor: 'pointer' }}>{c === 'All' ? 'All' : labelForCategory(c)}</button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="admin-card">
        <div className="table-wrap">
          {productsLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading products…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--line)', marginBottom: '1rem' }}>A</div>
              <p style={{ color: 'var(--text-tertiary)' }}>{products.length === 0 ? 'No products yet. Add the first piece.' : 'No products match the filter.'}</p>
              {products.length === 0 && <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ marginTop: '1.2rem' }}><Plus size={13} /> Add first product</button>}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th></th><th>Name</th><th>Category</th><th>Subcategory</th><th>Price</th><th>Stock</th><th>Sold</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td>
                      <img className="td-img" src={p.imageUrl || p.image || `https://picsum.photos/seed/${p.id}/100/125`} alt={p.name}
                        onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${p.id}/100/125` }} />
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '.95rem' }}>{p.name}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--text-tertiary)', marginTop: '.15rem' }}>ID: {p.id}</div>
                    </td>
                    <td><span className="badge badge-neutral">{labelForCategory(p.category)}</span></td>
                    <td style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>{p.subcategory ? labelForSub(p.category, p.subcategory) : <span style={{ color: 'var(--error, #c0392b)' }}>— not set —</span>}</td>
                    <td style={{ color: 'var(--gold-bright)' }}>{fmt(p.price)}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-error' : p.stock <= 5 ? 'badge-gold' : 'badge-success'}`}>{p.stock}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.sold || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm" style={{ padding: '.5rem .7rem' }}><Pencil size={13} /></button>
                        <button onClick={() => setDelConfirm(p.id)} className="btn btn-danger btn-sm" style={{ padding: '.5rem .7rem' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {delConfirm && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: .95 }} animate={{ scale: 1 }} exit={{ scale: .95 }}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--line)', padding: '2rem', width: 'min(400px,92vw)', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '.8rem' }}>Remove piece?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.6rem' }}>This will permanently remove the product from the collection and the storefront.</p>
              <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center' }}>
                <button className="btn btn-ghost" onClick={() => setDelConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => confirmDelete(delConfirm)}>Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: .95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 20 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
              <div className="modal-head">
                <h3>{modal === 'add' ? 'Add product' : 'Edit product'}</h3>
                <button onClick={closeModal}><X size={18} /></button>
              </div>
              <div className="modal-body">
                <div className="modal-form-grid">
                  {/* multi-image gallery */}
                  <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                      Product photos (up to 8)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {(form.gallery || []).map((src, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 72, height: 90, border: idx === 0 ? '2px solid var(--gold)' : '1px solid var(--line-soft)', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{ position: 'absolute', top: 2, left: 2, fontSize: 9, background: 'var(--gold)', color: '#111', padding: '1px 4px', borderRadius: 3, fontWeight: 700 }}>MAIN</span>
                          )}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', background: 'rgba(0,0,0,0.55)' }}>
                            <button type="button" onClick={() => moveGalleryImage(idx, -1)} style={{ flex: 1, border: 0, background: 'transparent', color: '#fff', fontSize: 11, cursor: 'pointer', padding: 2 }} title="Move left">‹</button>
                            <button type="button" onClick={() => removeGalleryImage(idx)} style={{ flex: 1, border: 0, background: 'transparent', color: '#ff8a8a', fontSize: 11, cursor: 'pointer', padding: 2 }} title="Remove">×</button>
                            <button type="button" onClick={() => moveGalleryImage(idx, 1)} style={{ flex: 1, border: 0, background: 'transparent', color: '#fff', fontSize: 11, cursor: 'pointer', padding: 2 }} title="Move right">›</button>
                          </div>
                        </div>
                      ))}
                      {(form.gallery || []).length < 8 && (
                        <label style={{ width: 72, height: 90, border: '1px dashed var(--line-soft)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 22 }}>
                          +
                          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                    <div className="field">
                      <label>Or paste image URL (adds to gallery)</label>
                      <input
                        type="text"
                        value=""
                        onChange={() => {}}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const url = e.target.value.trim()
                            if (!url) return
                            setForm((prev) => {
                              const gallery = [...(prev.gallery || []), url].slice(0, 8)
                              return { ...prev, gallery, imageUrl: gallery[0] }
                            })
                            e.target.value = ''
                          }
                        }}
                        placeholder="https://example.com/image.jpg  (press Enter)"
                      />
                    </div>
                  </div>

                  <div className="field span-2">
                    <label>Product name *</label>
                    <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="e.g. Vael Derby" />
                  </div>

                  <div className="field">
                    <label>Category *</label>
                    <select value={form.category} onChange={e => { setF('category', e.target.value); setF('sizes', []); setF('subcategory', '') }}>
                      {CATEGORY_OPTIONS.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                    </select>
                  </div>

                  <div className="field">
                    <label>Subcategory *</label>
                    <select value={form.subcategory} onChange={e => { setF('subcategory', e.target.value); setF('sizes', []) }}>
                      <option value="">Select a subcategory</option>
                      {availGroups.map(g => (
                        <optgroup key={g.key} label={g.label}>
                          {g.subs.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>This is the exact shelf on the storefront the product lands on.</span>
                  </div>

                  <div className="field">
                    <label>Selling Price (INR) *</label>
                    <input type="number" value={form.price} onChange={e => setF('price', e.target.value)} placeholder="2999" />
                  </div>

                  <div className="field">
                    <label>Original Price / MRP (INR)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setF('originalPrice', e.target.value)} placeholder="4999" />
                    {form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price) && (
                      <span style={{ fontSize: '.75rem', color: '#c45c26', fontWeight: 600, marginTop: 4, display: 'block' }}>
                        Auto discount: {Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={!!form.isOffer} onChange={e => setF('isOffer', e.target.checked)} />
                      Mark as Offer (appears on /offers)
                    </label>
                  </div>

                  <div className="field">
                    <label>Stock quantity</label>
                    <input type="number" value={form.stock} onChange={e => setF('stock', e.target.value)} placeholder="0" />
                  </div>

                  <div className="field">
                    <label>Sizes available</label>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.3rem' }}>
                      {availSizes.map(s => (
                        <button key={s} type="button" onClick={() => toggleSize(s)}
                          style={{ padding: '.45rem .7rem', border: `1px solid ${form.sizes.includes(s) ? 'var(--gold)' : 'var(--line)'}`, background: form.sizes.includes(s) ? 'var(--gold)' : 'transparent', color: form.sizes.includes(s) ? '#060607' : 'var(--text-secondary)', fontSize: '.76rem', transition: '.25s', borderRadius: '3px' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field span-2">
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Product description..." rows={3} />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? <><Loader2 size={14} className="spin" /> Saving…</> : modal === 'add' ? 'Add to collection' : 'Save changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
