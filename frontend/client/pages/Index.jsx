import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";




export default function Index() {
  const { t } = useLanguage();
  const { user, upgradeToArtisan } = useUser();
  const nav = useNavigate();

  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);

  const [querya, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "artisan"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtisans(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching artisans:", err);
      }
    };

    fetchArtisans();
  }, []);


  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(querya.toLowerCase());
      const matchesCat = category === "All" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCat && matchesPrice;
    });
  }, [products, querya, category, maxPrice]);

  return (
    <div className="as-landing">
      <section className="as-hero as-container">
        <div className="as-hero-content as-card">
          <h1 className="as-hero-title">{t.tagline}</h1>
          <div className="as-row-gap">
            <Link className="as-btn" to="/marketplace">{t.explore}</Link>
            <button
              className="as-btn as-btn-ghost"
              onClick={() => {
                if (user?.role === "artisan") nav("/artisan/dashboard");
                else if (user?.role === "customer") nav("/signup");
                else nav("/signup");
              }}
            >
              {t.becomeArtisan}
            </button>
          </div>
          <div className="as-stats">
            <div className="as-stat"><div>👩‍🎨</div><div><strong>480+</strong><span>{t.statsArtisans}</span></div></div>
            <div className="as-stat"><div>🖼</div><div><strong>2.7k</strong><span>{t.statsProducts}</span></div></div>
            <div className="as-stat"><div>🧶</div><div><strong>36</strong><span>{t.statsCraftTypes}</span></div></div>
          </div>
        </div>
      </section>

      <section id="market" className="as-container as-market">
        <div className="as-card as-filterbar">
          <div className="as-filter-title">{t.filters}</div>
          <div className="as-filter-controls">
            <input
              className="as-input"
              placeholder={t.searchPlaceholder}
              value={querya}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="as-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">{t.allProducts}</option>
              <option value="textile">{t.categories.textile}</option>
              <option value="pottery">{t.categories.pottery}</option>
              <option value="wood">{t.categories.wood}</option>
              <option value="metal">{t.categories.metal}</option>
              <option value="painting">{t.categories.painting}</option>
              <option value="stone">{t.categories.stone}</option>
              <option value="other">{t.categories.other}</option>
            </select>

            <div className="as-range">
              <label>{t.price}: <strong>₹{maxPrice}</strong></label>
              <input
                type="range"
                min="10"
                max="20000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <h2 className="as-section-title">{t.featuredArtworks}</h2>
        <div className="as-grid">
          {filtered.map((p) => (
            <div key={p.id} className="as-card as-product">
              <img src={p.imageUrl} alt={p.title} className="as-img" />
              <div className="as-product-body">
                <div className="as-product-title">{p.title}</div>
                <div className="as-product-meta">
                  <span className="as-chip">
                    {t.categories[p.category] || p.category}
                  </span>

                  <span className="as-price">₹{p.price}</span>
                </div>
                <div className="as-row-gap">
                  <Link to={`/product/${p.id}`} className="as-btn">Buy</Link>
                  {user?.role === "customer" && (
                    <button
                      className="as-btn as-btn-ghost"
                      onClick={() => {
                        const ok = confirm("Upgrade to Artisan and add your first product?");
                        if (ok) {
                          upgradeToArtisan();
                          nav("/artisan/add-product");
                        }
                      }}
                    >
                      {t.upgradeToArtisan}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="as-section-title">{t.featuredArtisans}</h2>
        <div className="as-grid-sm">
          {artisans.map((a) => (
            <div key={a.id} className="as-card as-artisan">
              <img src={"https://cdn3.iconfinder.com/data/icons/avatar-165/536/NORMAL_HAIR-1024.png"} alt={a.name} className="as-avatar" />
              <div>
                <div className="as-strong">{a.username}</div>
                <div className="as-muted">{a.craft}</div>
              </div>
              {/* <button className="as-btn as-btn-ghost">Follow</button> */}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}