// import { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useLanguage } from "../contexts/LanguageContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//   const { login } = useAuth();
//   
//   const nav = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const onSubmit = (e) => {
//     e.preventDefault();
//     login(email, password);
//     const raw = localStorage.getItem("as_user");
//     const parsed = raw ? JSON.parse(raw) : { role: "customer" };
//     if (parsed.role === "artisan") nav("/artisan/dashboard");
//     else nav("/");
//   };


import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext"
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const onSubmit = async (e) => {
    // Basic validation
    e.preventDefault();
    if (!email || !password) {
      return alert("Please enter both email and password!");
    }

    try {
      // 1️⃣ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("reaching here");
      
      // 2️⃣ Fetch user info from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("Logged in user profile:", userDoc.data());
        // You can store user data in context or state here if needed
      } else {
        console.log("No user profile found in Firestore!");
      }

      // 3️⃣ Navigate to dashboard
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="as-auth-page as-container">
      <form className="as-card as-auth-form" onSubmit={onSubmit}>
        <h2 className="as-title">{t.signIn}</h2>
        <label className="as-label">{t.email}</label>
        <input className="as-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="as-label">{t.password}</label>
        <input className="as-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="as-btn" type="submit">{t.signIn}</button>
        <div className="as-auth-alt">
          <span className="as-muted">{t.or}</span>
          <Link className="as-link" to="/signup">{t.signUp}</Link>
        </div>
      </form>
    </div>
  );
}
