// store/index.js  –  shared localStorage-backed data layer
// Both the admin panel and the storefront read/write from the same keys.

const KEYS = {
  products: 'aurelis_products',
  orders:   'aurelis_orders',
  users:    'aurelis_users',
  cart:     'aurelis_cart',
  wishlist: 'aurelis_wishlist',
  session:  'aurelis_session',
};

const load  = key => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };
const save  = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const stamp = () => new Date().toISOString();
const uid   = () => Math.random().toString(36).slice(2, 10).toUpperCase();

/* ---- products ---- */
export const getProducts = () => load(KEYS.products) || [];
export const saveProducts = p => save(KEYS.products, p);

export const addProduct = product => {
  const all = getProducts();
  const p = { ...product, id: uid(), createdAt: stamp(), stock: Number(product.stock) || 0, sold: 0 };
  all.unshift(p);
  saveProducts(all);
  return p;
};

export const updateProduct = (id, updates) => {
  const all = getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProducts(all);
};

export const deleteProduct = id => {
  saveProducts(getProducts().filter(p => p.id !== id));
};

export const getProduct = id => getProducts().find(p => p.id === id) || null;

/* ---- orders ---- */
export const getOrders = () => load(KEYS.orders) || [];
export const saveOrders = o => save(KEYS.orders, o);

export const placeOrder = (items, total, user, address, payment) => {
  const orders = getOrders();
  const order = {
    id: 'ORD-' + uid(),
    items,
    total,
    userId: user?.id || 'guest',
    userName: user?.name || 'Guest',
    userEmail: user?.email || '',
    address,
    payment,
    status: 'Confirmed',
    placedAt: stamp(),
  };
  orders.unshift(order);
  saveOrders(orders);
  // decrement stock
  items.forEach(item => {
    const p = getProduct(item.id);
    if (p) updateProduct(item.id, { stock: Math.max(0, p.stock - item.qty), sold: (p.sold || 0) + item.qty });
  });
  return order;
};

export const updateOrderStatus = (id, status) => {
  saveOrders(getOrders().map(o => o.id === id ? { ...o, status } : o));
};

export const getUserOrders = userId => getOrders().filter(o => o.userId === userId);

/* ---- users ---- */
export const getUsers = () => load(KEYS.users) || [];
export const saveUsers = u => save(KEYS.users, u);

export const registerUser = (name, email, password) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { error: 'Email already registered.' };
  const user = { id: 'USR-' + uid(), name, email, password, createdAt: stamp(), role: 'customer', totalOrders: 0 };
  users.unshift(user);
  saveUsers(users);
  return { user };
};

export const loginUser = (email, password) => {
  const u = getUsers().find(u => u.email === email && u.password === password);
  if (!u) return { error: 'Invalid email or password.' };
  return { user: u };
};

/* ---- session ---- */
export const getSession  = () => load(KEYS.session);
export const setSession  = user => save(KEYS.session, user);
export const clearSession = () => localStorage.removeItem(KEYS.session);

/* ---- cart ---- */
export const getCart  = () => load(KEYS.cart) || {};
export const saveCart = c => save(KEYS.cart, c);

export const cartAdd = (productId, qty = 1, size = null) => {
  const cart = getCart();
  const key = size ? `${productId}_${size}` : productId;
  cart[key] = { ...(cart[key] || { productId, size, qty: 0 }), qty: (cart[key]?.qty || 0) + qty };
  saveCart(cart);
};

export const cartRemove = key => {
  const cart = getCart();
  delete cart[key];
  saveCart(cart);
};

export const cartSetQty = (key, qty) => {
  const cart = getCart();
  if (qty <= 0) { delete cart[key]; }
  else { cart[key] = { ...cart[key], qty }; }
  saveCart(cart);
};

export const clearCart = () => save(KEYS.cart, {});

export const getCartItems = () => {
  const cart = getCart();
  return Object.entries(cart).map(([key, entry]) => {
    const product = getProduct(entry.productId);
    return product ? { key, product, size: entry.size, qty: entry.qty } : null;
  }).filter(Boolean);
};

export const cartTotal = items => items.reduce((s, i) => s + i.product.price * i.qty, 0);
export const cartCount = () => Object.values(getCart()).reduce((s, v) => s + v.qty, 0);

/* ---- wishlist ---- */
export const getWishlist  = () => load(KEYS.wishlist) || [];
export const saveWishlist = w => save(KEYS.wishlist, w);

export const toggleWishlist = id => {
  const w = getWishlist();
  const idx = w.indexOf(id);
  if (idx === -1) { w.push(id); } else { w.splice(idx, 1); }
  saveWishlist(w);
  return idx === -1;
};

export const isWishlisted = id => getWishlist().includes(id);

/* ---- helpers ---- */
export const fmt = n => '₹ ' + Number(n).toLocaleString('en-IN');

export const CATEGORIES = ['Men', 'Women', 'Accessories', 'New Arrivals'];

export const SUBCATEGORIES = {
  Men: [
    'Shirts',
    'T-Shirts',
    'Denim',
    'Pants',
    'Shorts',
    'Active Wear',
    'Tracks'
  ],
  Women: [
    'Formal Pants',
    'Jeans',
    'Kurti',
    'Tops',
    'Kurta Sets'
  ],
  Accessories: ['watches', 'chain'],
  'New Arrivals': [
    'Latest Shirts',
    'Latest T-Shirts',
    'Latest Jeans',
    'Latest Pants',
    'Latest Shorts',
    'Latest Tracks'
  ],
};

export const PRODUCT_VARIANTS = {
  Men: {
    Shirts: [
      'Executive Formal Shirts',
      'Smart Casual Shirts',
      'Classic Check Shirts',
      'Premium Denim Shirts',
      'Signature Printed Shirts',
      'Luxury Corduroy Shirts',
      'Imported Premium Shirts',
      'Pure Linen Shirts',
      'Half Sleeve Shirts',
      'Office Wear Shirts',
      'Party Wear Shirts'
    ],
    'T-Shirts': [
      'Polo T-Shirts (Half Sleeve)',
      'Polo T-Shirts (Full Sleeve)',
      'Oversized Drop Shoulder T-Shirts',
      'Half Sleeve T-Shirts',
      'Full Sleeve T-Shirts',
      'Graphic Printed T-Shirts',
      'Performance Dry-Fit T-Shirts'
    ],
    Denim: [
      'Balloon Fit Jeans',
      'Baggy Fit Jeans',
      'Mom Fit Jeans',
      'Regular Fit Jeans',
      'Cargo Fit Jeans'
    ],
    Pants: [
      'Formal Trousers',
      'Linen Pants',
      'Gurkha Trousers',
      'Korean Fit Pants',
      'Cotton Pants',
      'Cargo Pants'
    ],
    Shorts: [
      'Cotton Shorts',
      'Denim Shorts',
      'Performance Dry-Fit Shorts'
    ],
    'Active Wear': [
      'Performance Dry-Fit T-Shirts',
      'Performance Dry-Fit Shorts'
    ],
    Tracks: [
      'Dry-Fit Tracks',
      'Baggy Tracks'
    ]
  },
  Women: {
    'Formal Pants': [
      'Boot Cut',
      'Linen Trousers',
      'Imported Stretched',
      'Cotton Pants'
    ],
    Jeans: [
      'Wide Leg',
      'Boot Cut',
      'Straight Fit',
      'Casual Trouser',
      'Baggy',
      'High Rise'
    ],
    Kurti: [
      'Plain',
      'Designer',
      'Embroidered',
      'Flared'
    ],
    Tops: [
      'Striped Shirts',
      'Crop Top',
      'Oversized T-Shirt',
      'Formal Shirts'
    ],
    'Kurta Sets': [
      'Embroider Sets',
      'Palazzo Sets',
      'Georgette Sets'
    ]
  },
  Accessories: {},
  'New Arrivals': {
    'Latest Shirts': [
      'Executive Formal Shirts',
      'Smart Casual Shirts',
      'Classic Check Shirts',
      'Premium Denim Shirts',
      'Signature Printed Shirts',
      'Luxury Corduroy Shirts',
      'Imported Premium Shirts',
      'Pure Linen Shirts',
      'Half Sleeve Shirts',
      'Office Wear Shirts',
      'Party Wear Shirts'
    ],
    'Latest T-Shirts': [
      'Polo T-Shirts (Half Sleeve)',
      'Polo T-Shirts (Full Sleeve)',
      'Oversized Drop Shoulder T-Shirts',
      'Half Sleeve T-Shirts',
      'Full Sleeve T-Shirts',
      'Graphic Printed T-Shirts',
      'Performance Dry-Fit T-Shirts'
    ],
    'Latest Jeans': [
      'Balloon Fit Jeans',
      'Baggy Fit Jeans',
      'Mom Fit Jeans',
      'Regular Fit Jeans',
      'Cargo Fit Jeans'
    ],
    'Latest Pants': [
      'Formal Trousers',
      'Linen Pants',
      'Gurkha Trousers',
      'Korean Fit Pants',
      'Cotton Pants',
      'Cargo Pants'
    ],
    'Latest Shorts': [
      'Cotton Shorts',
      'Denim Shorts',
      'Performance Dry-Fit Shorts'
    ],
    'Latest Tracks': [
      'Dry-Fit Tracks',
      'Baggy Tracks'
    ]
  }
};

export const ORDER_STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

/* ---- analytics helpers ---- */
export const getAnalytics = () => {
  const orders  = getOrders();
  const products = getProducts();
  const users   = getUsers();
  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const topProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5);
  const monthlySales = (() => {
    const map = {};
    orders.forEach(o => {
      const m = o.placedAt?.slice(0, 7) || 'unknown';
      if (!map[m]) map[m] = { month: m, revenue: 0, count: 0 };
      map[m].revenue += o.total;
      map[m].count++;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  })();
  return { revenue, ordersCount: orders.length, productsCount: products.length, usersCount: users.length, topProducts, monthlySales };
};
