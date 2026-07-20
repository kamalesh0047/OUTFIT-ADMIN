import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft,SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import ProductFilter from "../components/ProductFilter";
import { getProductsByCategory } from "../services/productService";
import "./category.css";
import "./shop.css";

export default function Products() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(
      decodeURIComponent(category),
      decodeURIComponent(subcategory)
    )
      .then((list) => {
        setProducts(list);
        setFiltered(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, subcategory]);

  useEffect(() => {
    if (mobileFiltersOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [mobileFiltersOpen]);

  const title = decodeURIComponent(subcategory)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return list.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name":
        return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      default:
        return list;
    }
  }, [filtered, sort]);

  if (loading) {
    return (
      <div
        className="container section"
        style={{ textAlign: "center", padding: "4rem 0" }}
      >
        <p style={{ color: "var(--muted)" }}>Loading products…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container section"
    >
      <button
        className="btn btn--ghost back-btn"
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h2 className="section-title" style={{ marginTop: "0.6rem" }}>
        {title}
      </h2>

      <div className="shop-layout" style={{ paddingTop: 20 }}>
        <aside className="shop-sidebar">
          <ProductFilter products={products} onFilter={setFiltered} />
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <button
              type="button"
              className="btn btn--ghost shop-filter-btn"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            <p className="shop-count">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""}
            </p>

            <div className="shop-sort">
              <label htmlFor="cat-sort">Sort</label>
              <select
                id="cat-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input shop-sort-select"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="shop-empty">
              <p style={{ color: "var(--muted)", fontSize: "15px" }}>
                {products.length === 0
                  ? "No products in this category yet."
                  : "No products match the selected filters."}
              </p>
              {products.length === 0 && (
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    marginTop: "0.4rem",
                  }}
                >
                  Add products from the admin panel and they&apos;ll appear here.
                </p>
              )}
            </div>
          ) : (
            <div className="pcard-grid shop-grid">
              {sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="shop-filter-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.aside
              className="shop-filter-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                duration: 0.35,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              role="dialog"
              aria-label="Filters"
            >
              <div className="shop-filter-drawer__head">
                <h3>Filters</h3>
                <button
                  type="button"
                  className="nav__icon"
                  aria-label="Close filters"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="shop-filter-drawer__body">
                <ProductFilter products={products} onFilter={setFiltered} />
              </div>
              <div className="shop-filter-drawer__foot">
                <button
                  type="button"
                  className="btn btn--block"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Show {sorted.length} result{sorted.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {quickView && (
        <QuickView product={quickView} onClose={() => setQuickView(null)} />
      )}
    </motion.div>
  );
}