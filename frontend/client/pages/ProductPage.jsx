// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProductPage() {
  const { id } = useParams(); // product id from URL
  const [product, setProduct] = useState(null);
  const [story, setStory] = useState([]);
    const {t}= useLanguage()
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch product details
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) setProduct(snap.data());

        // fetch story subcollection
        const storyRef = collection(db, "products", id, "stories");
        const storySnap = await getDocs(storyRef);
        const storyData = storySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStory(storyData);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!product) return <p className="as-center-text as-margin-top">Loading product...</p>;

  return (
    <div className="as-product-page">
      {/* Left side: product details */}
      <div className="as-product-left">
        <img src={product.imageUrl} alt={product.title} className="as-product-image" />
        <h1 className="as-product-title">{product.title}</h1>
        <p className="as-product-price">₹ {product.price}</p>
        <span className="as-product-category">{t.categories[product.category]}</span>
        <p className="as-product-description">{product.description}</p>

        <div className="as-product-actions">
          <button
            onClick={() => console.log("Add to Cart:", product.title)}
            className="as-btn as-btn-cart"
          >
            Add to Cart
          </button>
          <button
            onClick={() => console.log("Buy Now:", product.title)}
            className="as-btn as-btn-buy"
          >
            Buy Now
          </button>
        </div>
      </div>
    {story.length>0 && (
        
      <div className="as-product-right">
        <h2 className="as-story-title">From Artisan... </h2>
        {
          story.map((s) => (
            <div key={s.id} className="as-story-block">
              {s.title && <h3 className="as-story-subtitle">{s.title}</h3>}
              <p className="as-story-text">{s.story}</p>
            </div>
          ))
       }
      </div>
    )}
      
    </div>
  );
}
