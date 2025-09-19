// src/pages/ArtisanProducts.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import GenerateDescriptionModal from "../components/GenerateDescriptionModal";
import CreateStoryModal from "../components/CreateStoryModal";

export default function ArtisanProducts() {
    const { user } = useUser();
    const { t } = useLanguage();
    const nav = useNavigate();

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showStoryModal, setShowStoryModal] = useState(false)
    // Protect route
    useEffect(() => {
        if (!user || user.role !== "artisan") {
            nav("/login");
        }
    }, [user, nav]);

    // Fetch artisan's products
    useEffect(() => {
        if (!user) return;
        const fetchProducts = async () => {
            const q = query(
                collection(db, "products"),
                where("artisanId", "==", user.uid)
            );
            const snapshot = await getDocs(q);
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchProducts();
    }, [user]);

    const handleGenerateClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    return (
        <div className="as-container as-dashboard">
            <h1 className="as-section-title">{t.products}</h1>
            <div className="as-flex-gap">
                {products.map((p) => {
                return(
                    <div key={p.id} className="as-card as-product">
                        <img src={p.imageUrl} alt={p.title} className="as-img" />
                        <div className="as-product-body">
                            <div className="as-product-title">{p.title}</div>
                            <div className="as-product-meta">
                                <span className="as-chip">{p.category || ""}</span>
                                <span className="as-price">₹{p.price}</span>
                            </div>
                            
                            <div className="as-row-gap">
                                <button
                                    className="as-btn"
                                    onClick={() => handleGenerateClick(p)}
                                >
                                    {t.generateDescription}
                                </button>
                                <button
                                    className="as-btn"
                                    onClick={() => nav(`/artisan/story/${p.id}`)}
                                >
                                    {t.createStory}
                                </button>
                            </div>
                        </div>
                    </div>
                )})}
            </div>


            {showModal && selectedProduct && (
                <GenerateDescriptionModal
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                />
            )}

          
        </div>
    );
}
