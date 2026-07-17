import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";

export default function Wishlist() {
  const { ids } = useWishlist();
  const [items, setItems] = useState([]);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, [ids]);

  async function loadWishlist() {
    const products = await getProducts();
    setItems(products.filter((p) => ids.includes(p.id)));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container section"
    >
      <div className="section__head">
        <span className="eyebrow">Saved for later</span>
        <h1>Your Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--muted)",
          }}
        >
          <p>No saved items yet.</p>
          <Link className="btn" to="/">
            Discover pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid--4">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickView}
            />
          ))}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </motion.div>
  );
}
