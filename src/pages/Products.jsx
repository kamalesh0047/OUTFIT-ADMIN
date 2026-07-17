import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import { getProductsByCategory } from "../services/productService";
import "./category.css";

export default function Products() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(decodeURIComponent(category), decodeURIComponent(subcategory))
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, subcategory]);

  const title = decodeURIComponent(subcategory)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ color: "var(--muted)" }}>Loading products…</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container section">
      <button
        className="btn btn--ghost back-btn"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h2 className="section-title" style={{ marginTop: "0.6rem" }}>{title}</h2>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ color: "var(--muted)", fontSize: "15px" }}>No products in this category yet.</p>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "0.4rem" }}>Add products from the admin panel and they'll appear here.</p>
        </div>
      ) : (
        <div className="pcard-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </motion.div>
  );
}
