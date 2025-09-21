// src/pages/CreateStoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { BASE_URL } from "../baseurl";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/AuthContext";

export default function CreateStoryPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams(); // get product id from URL
  const {user} =useUser();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const navigate= useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null); // { en, hi }
  const [answer, setAnswer] = useState("");
  const [story, setStory] = useState(null); // { en, hi }
  const [history, setHistory] = useState([]);
  const [count, setCount] = useState(0);

  // fetch product from Firestore
  useEffect(() => {
    async function fetchProduct() {
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const prodData = { id: snap.id, ...snap.data() };

          // ✅ Translate description into Hindi if exists
          let hiDesc = "";
          if (prodData.description) {
            hiDesc = await translate(prodData.description, "hi");
          }

          // ✅ store both en/hi descriptions
          setProduct({
            ...prodData,
            description: {
              en: prodData.description || "",
              hi: hiDesc || "",
            },
          });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [id]);


  // Translate helper
  async function translate(text, target) {
    const res = await fetch(BASE_URL + "translate/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language: target }),
    });
    const data = await res.json();
    return data.translated_text || text;
  }

  // Start new session
  async function startSession() {
    const res = await fetch(BASE_URL + "story/start-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: product.title, image_url: product.imageUrl })
    });
    const data = await res.json();

    const hiQ = await translate(data.question, "hi");

    setSessionId(data.sessionId);
    setQuestion({ en: data.question, hi: hiQ });
    setHistory([]);
    setStory(null);
    setCount(0);
  }

  // Submit answer
  async function submitAnswer() {
    const answerEn = lang === "hi" ? await translate(answer, "en") : answer;

    const res = await fetch(BASE_URL + "story/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answer: answerEn }),
    });
    const data = await res.json();

    const nextHiQ = data.done ? "" : await translate(data.question, "hi");

    setHistory((prev) => [
      ...prev,
      { q: question, a: { en: answerEn, hi: answer } },
    ]);
    setAnswer("");
    setCount(count + 1);

    if (data.done || count + 1 >= 10) {
      const hiStory = await translate(data.question, "hi");
      setStory({ en: data.question, hi: hiStory });
      setQuestion(null);
    } else {
      setQuestion({ en: data.question, hi: nextHiQ });
    }
  }

  async function stopInterview() {
    const res = await fetch(BASE_URL + "story/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answer: "__STOP__" }),
    });
    const data = await res.json();

    const hiStory = await translate(data.question, "hi");
    setStory({ en: data.question, hi: hiStory });
    setQuestion(null);
  }

  const showText = (obj) => {
    if (!obj) return "";
    return lang === "hi" ? obj.hi : obj.en;
  };

  if (loadingProduct) {
    return <div className="as-container">{t.loading}...</div>;
  }

  if (!product) {
    return <div className="as-container">{t.noProductFound}</div>;
  }

  const submitStory = async (e) => {
  e.preventDefault();

  if (!story) return alert("Please write a story first!");

  try {
    await addDoc(collection(db, "products", id, "stories"), {
      story: story.en,            // can be object { en, hi }
      userId: user.uid,        // ✅ use uid
      createdAt: serverTimestamp(),
    });

    alert("Story submitted!");
    navigate("/artisan/products");
  } catch (err) {
    console.error("Error adding story:", err);
    alert("Failed to submit story: " + err.message);
  }
};

  return (
    <div className="as-container as-flex-row as-story-page">
      {/* Left side - Product details */}
      <div className="as-product-panel">
        <div className="as-card as-product">
          <img src={product.imageUrl} alt={product.title} className="as-img" />
          <div className="as-product-body">
            <h2 className="as-product-title">{product.title}</h2>
            <div className="as-product-meta">
              <span className="as-chip">{product.category}</span>
              <span className="as-price">${product.price}</span>
            </div>
            <p className="as-desc">
              {product.description
                ? lang === "hi"
                  ? product.description.hi
                  : product.description.en
                : t.noDescription}
            </p>

          </div>
        </div>
      </div>

      {/* Right side - Chat assistant */}
      <div className="as-chat-panel">
        <h2 className="as-section-title">{t.storyAssistant}</h2>
        <p className="as-subtitle">{t.storyAssistantDesc}</p>

        {!sessionId && (
          <button className="as-btn" onClick={startSession}>
            {t.startInterview}
          </button>
        )}

        <div className="as-chat-window">
          {history.map((item, i) => (
            <div key={i} className="as-chat-bubble-group">
              <div className="as-chat-bubble bot">
                <strong>{t.question}:</strong> {showText(item.q)}
              </div>
              <div className="as-chat-bubble user">
                <strong>{t.answer}:</strong>{" "}
                {lang === "hi" ? item.a.hi : item.a.en}
              </div>
            </div>
          ))}

          {question && !story && (
            <div className="as-chat-bubble bot">{showText(question)}</div>
          )}

          {story && (
          <>  <div className="as-chat-bubble bot final">
              <h3>{t.finalStory}</h3>
              <p>{showText(story)}</p>
            </div>
            
            </>
          )}
        </div>
          
          { story && (
            <div className="as-chat-input-row">
              <button className="as-btn" onClick={submitStory}>
              {t.submit}
            </button>

            </div>
          )

          }
        {question && !story && (
          <div className="as-chat-input-row">
            <input
              type="text"
              className="as-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.typeAnswer}
            />
            <button className="as-btn" onClick={submitAnswer}>
              {t.submit}
            </button>
            <button className="as-btn" onClick={stopInterview}>
              {t.stopInterview}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
