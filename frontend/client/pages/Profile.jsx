// src/pages/Profile.jsx
import { useUser } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Profile() {
  const { user } = useUser();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="as-container as-center">
        <div className="as-card as-center-content">
          <h1 className="as-section-title">{t.profile || "Profile"}</h1>
          <p>{t.noUser || "No user data found. Please login."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="as-container as-profile-c">
      <h1 className="as-section-title">{t.profile || "Profile"}</h1>

      <div className="as-card as-profile">
      
        <div className="as-profile-body">
          <h2 className="as-profile-name">
            {user.username || t.noName || "No Name"}
          </h2>
          <p className="as-profile-email">{user.email}</p>
          <p className="as-profile-role">
            {t.role || "Role"}: {user.role || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
