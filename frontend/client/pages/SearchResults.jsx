// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../contexts/LanguageContext";

export default function SearchResults() {
  const location = useLocation();
  const nav = useNavigate();
  const { t } = useLanguage();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Simple filter by title or category
        const filtered = allProducts.filter(
          (p) =>
            p.title?.toLowerCase().includes(searchQuery) ||
            p.category?.toLowerCase().includes(searchQuery)
        );

        setResults(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
      setLoading(false);
    };

    if (searchQuery) fetchProducts();
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <div className="as-container as-center">
        <h1 className="as-section-title">{t.searchResults || "Search Results"}</h1>
        <p>{t.noQuery || "Please enter a search query."}</p>
      </div>
    );
  }

  return (
    <div className="as-container">
      <h1 className="as-section-title">
        {t.searchResults || "Search Results"}: "{searchQuery}"
      </h1>

      {loading ? (
        <p>{t.loading || "Loading..."}</p>
      ) : results.length === 0 ? (
        <p>{t.noResults || "No products found."}</p>
      ) : (
        <div className="as-flex-gap">
          {results.map((p) => (
            <div key={p.id} className="as-card as-product">
              <img src={p.imageUrl} alt={p.title} className="as-img" />
              <div className="as-product-body">
                <div className="as-product-title">{p.title}</div>
                <div className="as-product-meta">
                  <span className="as-chip">{t.categories[p.category]}</span>
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
      )}
    </div>
  );
}
