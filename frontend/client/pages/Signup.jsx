// import { useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { useLanguage } from "../contexts/LanguageContext";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const { signup } = useAuth();
//   const { t } = useLanguage();
//   const nav = useNavigate();

//   const [form, setForm] = useState({ username: "", email: "", password: "", role: "customer" });

//   const onSubmit = (e) => {
//     e.preventDefault();
//     signup(form);
//     if (form.role === "artisan") nav("/artisan/dashboard");
//     else nav("/");
//   };

//   return (
//     <div className="as-auth-page as-container">
//       <form className="as-card as-auth-form" onSubmit={onSubmit}>
//         <h2 className="as-title">{t.signUp}</h2>
//         <label className="as-label">{t.username}</label>
//         <input className="as-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
//         <label className="as-label">{t.email}</label>
//         <input className="as-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
//         <label className="as-label">{t.password}</label>
//         <input className="as-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
//         <label className="as-label">{t.role}</label>
//         <select className="as-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
//           <option value="artisan">{t.artisan}</option>
//           <option value="customer">{t.customer}</option>
//         </select>
//         <button className="as-btn" type="submit">{t.submit}</button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const nav = useNavigate();
  const { t } = useLanguage();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { username, email, password, role } = form;

    // Basic validation
    if (!username || !email || !password) {
      return alert(t.fillAllFields || "Please fill all fields!");
    }

    if (password.length < 6) {
      return alert(t.passwordTooShort || "Password must be at least 6 characters long!");
    }

    try {
      // 1️⃣ Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Save user info in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Navigate by role
      if (role === "artisan") nav("/artisan/dashboard");
      else nav("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="as-auth-page as-container">
        <form className="as-card as-auth-form" onSubmit={handleSignup}>
          <h2 className="as-title">{t.signUp}</h2>

          <label className="as-label">{t.username}</label>
          <input
            className="as-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <label className="as-label">{t.email}</label>
          <input
            className="as-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className="as-label">{t.password}</label>
          <input
            className="as-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <label className="as-label">{t.role}</label>
          <select
            className="as-input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="artisan">{t.artisan}</option>
            <option value="customer">{t.customer}</option>
          </select>

          <button className="as-btn" type="submit">
            {t.submit}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            {t.alreadyHaveAccount || "Already have an account?"}{" "}
            <span
              onClick={() => nav("/login")}
              className="text-blue-500 font-medium cursor-pointer hover:underline"
            >
              {t.login}
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

