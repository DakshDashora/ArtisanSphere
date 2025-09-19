import { Link } from "react-router-dom";
import { useUser } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function ArtisanDashboard() {
  const { user } = useUser();
  const { t } = useLanguage();
  return (
    <div className="as-container as-page">
      <div className="as-grid-2">
        <div className="as-card">
          <h2 className="as-title">{t.welcome}, {user?.username}</h2>
          <div className="as-row-gap">
            <Link className="as-btn" to="/artisan/add-product">{t.addProduct}</Link>
            <Link to="/profile" className="as-btn as-btn-ghost">{t.viewProfile}</Link>
          </div>
          <div className="as-tabs">
          <Link to="/artisan/products" className="as-chip">{t.products}</Link>
          <Link to="/artisan/manage-orders" className="as-chip">{t.orders}</Link>
          <Link to="/artisan/products" className="as-chip">{t.aiAssistant}</Link>
        </div>
        </div>
        <div className="as-card">
          <h3 className="as-subtitle">{t.analytics}</h3>
          <div className="as-stats">
            <div className="as-stat"><div>📦</div><div><strong>12</strong><span>{t.totalProducts}</span></div></div>
            <div className="as-stat"><div>🧾</div><div><strong>34</strong><span>{t.orders}</span></div></div>
            <div className="as-stat"><div>💰</div><div><strong>$2,340</strong><span>{t.revenue}</span></div></div>
            <div className="as-stat"><div>⭐</div><div><strong>4.8</strong><span>{t.rating}</span></div></div>
          </div>
        </div>
      </div>
   
    </div>
  );
}
