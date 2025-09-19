// import { useLanguage } from "../contexts/LanguageContext";

// export default function AddProduct() {
//   const { t } = useLanguage();
//   return (
//     <div className="as-container as-page">
//       <div className="as-card">
//         <h2 className="as-title">{t.addProduct}</h2>
//         <div className="as-muted">Form coming next. Includes title, price, image upload, and category.</div>
//       </div>
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddProduct() {
  const { t } = useLanguage();
  const { user } = useUser();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
 // const [description, setDescription] = useState("");
 const [category, setCategory] = useState("textile");
 
 const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !file) {
      alert(t.fillAllFields);
      return;
    }
    if (!user) {
      alert(t.userNotLoggedIn);
      nav("/login");
      return;
    }

    try {
      setLoading(true);
      // upload image
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // save product
     await addDoc(collection(db, "products"), {
  title,
  price: Number(price),
 
  category,
  imageUrl,
  createdAt: serverTimestamp(),
  artisanId: user.uid,
});


      alert(t.productAddedSuccess);
      setTitle("");
      setPrice("");
     
      setFile(null);
      setPreview("");
      nav("/artisan/dashboard")
    } catch (err) {
      console.error(err);
      alert(t.imageUploadFailed);
    } finally {
      setLoading(false);

    }
  };

return (
  <div className="as-container as-dashboard">
    <h1 className="as-section-title">{t.addProduct}</h1>
    <div className="as-card as-form">

      <div className="as-field">
        <label className="as-label">{t.productTitle}</label>
        <input
          className="as-input"
          placeholder={t.productTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="as-field">
        <label className="as-label">{t.productPrice}</label>
        <input
          className="as-input"
          type="number"
          placeholder={t.productPrice}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="as-field">
        <label className="as-label">{t.category}</label>
        <select
          className="as-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="textile">{t.textile}</option>
          <option value="pottery">{t.pottery}</option>
          <option value="wood">{t.wood}</option>
          <option value="metal">{t.metal}</option>
          <option value="other">{t.other}</option>
        </select>
      </div>

      <div className="as-field">
        <label className="as-label">{t.uploadImage}</label>
        <input
          className="as-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <div className="as-preview">
          <img src={preview} alt="preview" className="as-img" />
          <div>{t.preview}</div>
        </div>
      )}

 

      <div className="as-row-gap">
        <button
          className="as-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  </div>
);


}

