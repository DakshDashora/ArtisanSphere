// src/pages/ExploreMarketplace.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ExploreMarketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const nav = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Group products by category
  const grouped = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="as-container">
      <h1 className="as-section-title">{t.exploreMarketplace || "Explore Marketplace"}</h1>

      {loading ? (
        <p>{t.loading || "Loading..."}</p>
      ) : (
        Object.keys(grouped).map((cat) => (
          <div key={cat} className="as-category-section">
            <h2 className="as-category-title">
              {t.categories?.[cat] || cat}
            </h2>
            <div className="as-flex-gap">
              {grouped[cat].map((p) => (
                <div key={p.id} className="as-card as-product">
                  <img src={p.imageUrl} alt={p.title} className="as-img" />
                  <div className="as-product-body">
                    <div className="as-product-title">{p.title}</div>
                    <div className="as-product-meta">
                      <span className="as-price">₹{p.price}</span>
                    </div>
                    <button
                      className="as-btn"
                      onClick={() => nav(`/product/${p.id}`)}
                    >
                      {t.viewProduct || "View Product"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
