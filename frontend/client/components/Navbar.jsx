import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(""); // 🔹 search state
  const { user, loading } = useUser();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    // 🔹 Navigate to search results page
    nav(`/search?query=${encodeURIComponent(search)}`);
    setSearch(""); // clear search after navigating
  };

  return (
    <header className="as-nav">
      <div className="as-container as-nav-inner">

        <div className="as-actions">
          {/* Brand */}
          <Link to="/" className="as-brand">
            <span className="as-logo">🟠</span>
            <span>{t.brand}</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="as-search-wrap">
            <input
              className="as-input"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)} // 🔹 update state
            />
            <button type="submit" className="as-btn as-btn-ghost">🔍</button>
          </form>

          {/* Auth Buttons */}
          {!loading && !user ? (
            <>
              <Link to="/login" className="as-btn as-btn-ghost">{t.login}</Link>
              <Link to="/signup" className="as-btn">{t.signup}</Link>
            </>
          ) : (
            !loading && (
              <button className="as-btn as-btn-ghost" onClick={handleLogout}>{t.logout}</button>
            )
          )}
        </div>

        <div className="as-actions">
          {/* Language + Theme */}
          <div className="as-toggle-group">
            <button className="as-chip" onClick={() => setLang(lang === "en" ? "hi" : "en")}>
              {t.languageToggle}
            </button>
            <button className="as-chip" onClick={toggleTheme}>
              {theme === "dark" ? t.lightMode : t.darkMode}
            </button>
          </div>

          {/* Marketplace & Dashboard */}
          <div className="as-auth">
            <NavLink to="/" className="as-btn as-btn-ghost">{t.home}</NavLink>
            <NavLink to="/marketplace" className="as-btn as-btn-ghost">{t.marketplace}</NavLink>
            {user?.role === "artisan" && (
              <NavLink to="/artisan/dashboard" className="as-btn as-btn-ghost">{t.artisanDashboard}</NavLink>
            )}
          </div>

          {/* Icons */}
          <div className="as-toggle-group">
            <Link to="/favourites" aria-label="favorites" className="as-icon-btn">❤</Link>
            <button
              aria-label="profile"
              className="as-icon-btn"
              onClick={() => nav(user ? "/profile" : "/login")}
            >
              👤
            </button>
            <Link aria-label="cart" to="/customer/cart" className="as-icon-btn">🛒</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
