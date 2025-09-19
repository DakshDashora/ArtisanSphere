// src/components/GenerateDescriptionModal.jsx
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { BASE_URL } from "../baseurl";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function GenerateDescriptionModal({ product, onClose }) {
  const { t, lang } = useLanguage();
  const [descriptions, setDescriptions] = useState({ en: [], hi: [] });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [customDescription, setCustomDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Translate English text to Hindi
  const translateDescription = async (text) => {
    try {
      const res = await fetch(BASE_URL + "translate/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language: "hi" }),
      });
      const data = await res.json();
      return data.translated_text || "";
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  // Fetch AI descriptions and translate
  const fetchDescriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL + "create/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: product.title, image_url: product.imageUrl }),
      });
      const data = await res.json();
      const englishDescriptions = data.aiDescription || [];

      // Translate to Hindi
      const hindiDescriptions = await Promise.all(
        englishDescriptions.map((desc) => translateDescription(desc))
      );

      // Save to localStorage as object of arrays
      const stored = JSON.parse(localStorage.getItem("product_descriptions") || "{}");
      stored[product.id] = { en: englishDescriptions, hi: hindiDescriptions };
      localStorage.setItem("product_descriptions", JSON.stringify(stored));

      setDescriptions({ en: englishDescriptions, hi: hindiDescriptions });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch descriptions");
    } finally {
      setLoading(false);
    }
  };

  // Save selected/custom description (English only in Firestore)
  const handleSave = async () => {
    let finalDescription = "";

    if (customDescription.trim()) {
      finalDescription = customDescription.trim();
    } else if (selectedIndex !== null) {
      finalDescription = descriptions.en[selectedIndex];
    }

    if (!finalDescription) {
      alert("Select or add a description first!");
      return;
    }

    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { description: finalDescription });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save description");
    } finally{
        localStorage.removeItem("product_descriptions")
    }
  };

  // Get display text
  const getDisplayText = (idx) =>
    lang === "hi" ? descriptions.hi[idx] : descriptions.en[idx];

  return (
    <div className="as-modal">
      <div className="as-card">
        <button className="as-close" onClick={onClose}>
          X
        </button>
        <h2>
          {t.generateDescription} - {product.title}
        </h2>

        {!descriptions.en.length && (
          <button className="as-btn" onClick={fetchDescriptions} disabled={loading}>
            {loading ? t.submitting : "Fetch Descriptions"}
          </button>
        )}

        {descriptions.en.length > 0 && (
          <div className="as-col-gap">
            {descriptions.en.map((_, idx) => (
              <label key={idx} className="as-radio-label">
                <input
                  type="radio"
                  name="description"
                  checked={selectedIndex === idx}
                  onChange={() => setSelectedIndex(idx)}
                />
                {getDisplayText(idx)}
              </label>
            ))}

            <textarea
              className="as-input"
              placeholder={lang === "hi" ? "अपना विवरण जोड़ें" : "Add your own description"}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
            />

            <button className="as-btn" onClick={handleSave} disabled={loading}>
              {loading ? t.submitting : "Save Description"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
