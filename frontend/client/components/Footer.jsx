import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="as-footer">
      <div className="as-container as-footer-inner">
        <div className="as-footer-brand">
          <div className="as-logo">🟠</div>
          <div>
            <h3 className="as-footer-title">{t.brand}</h3>
            <p className="as-muted">{t.footerTagline}</p>
          </div>
        </div>
        <div className="as-footer-links">
          <div style={{"width":"50%"}}>
           
           <h4 className="as-muted">{t.forArtisans}</h4>
            <ul>
            <li><Link to="/artisan/dashboard" className="as-link">{t.artisanDashboard}</Link></li>
            <li><Link to="/artisan/add-product" className="as-link">{t.addProduct}</Link></li>
            <li><Link to="/artisan/manage-orders" className="as-link">{t.manageOrders}</Link></li>
            </ul>
          </div>
          <div style={{"width":"50%"}}>
            <h4 className="as-muted">{t.forCustomers}</h4>
            <ul>
            <li><Link to="/" className="as-link">{t.browseProducts}</Link></li>
            <li><Link to="/customer/cart" className="as-link">{t.customerCart}</Link></li>
            <li><Link to="/customer/orders" className="as-link">{t.orderHistory}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
