import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import './MosaicGallery.css';

const MosaicGallery = () => {
    const navigate = useNavigate();
    const { addToCart, isStoreOpen } = useCart();
    const [showRestaurantModal, setShowRestaurantModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const items = [
        {
            id: 1,
            type: 'main-burger',
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
            title: "Premium Burger",
            price: "$50.99",
            desc: "Haqiqiy mol go'shti, yangi sabzavotlar va bizning maxsus sousimiz bilan tayyorlangan shohona lazzat.",
            features: ["100% Halol Go'sht", "Yangi Pishirilgan Bulka", "Maxsus Siri-Sous"],
            ingredients: ['Qora bulka', "Mol go'shti", 'Yangi sabzavotlar', 'Maxsus sous']
        },
        {
            id: 9,
            type: 'sauce',
            image: "https://media.istockphoto.com/id/1306565945/photo/arrabbiata-sauce-spicy-italian-tomato-sauce-in-a-wooden-bowl.jpg?s=612x612&w=0&k=20&c=eW9EC3MLMzWBuTSB2bdDBwpSJNP2_v95EZr_Rhqtnm0=",
            title: "Signature Sauce",
            price: "$5.00",
            desc: "Bizning maxfiy retseptli sousimiz.",
            ingredients: ['Pomidor', 'Maxfiy ziravorlar', 'Zaytun moyi']
        },
        {
            id: 10,
            type: 'cheese',
            image: "https://media.istockphoto.com/id/1393780197/photo/cheese-sauce.jpg?s=612x612&w=0&k=20&c=bbEQKHlnPZVLrT1xbnOakX6qheTjeLsn6Rrs5HZZaHE=",
            title: "Cheddar Bowl",
            price: "$8.00",
            desc: "Issiq va erigan pishloq.",
            ingredients: ['Cheddar pishlog\'i', 'Qaymoq', 'Ziravorlar']
        },
        {
            id: 101,
            type: 'sauce',
            image: 'https://s.myspar.ru/upload/img/10/1014/101417745.jpg?1722265067',
            title: "Sweet & Thai",
            price: "$5.00",
            desc: "Ekzotik nordon-shirin Thai sousi.",
            ingredients: ['Shakar', 'Sarimsoq', 'Limon']
        },
        {
            id: 102,
            type: 'sauce',
            image: 'https://i.pinimg.com/1200x/3c/7d/c1/3c7dc160f6db1e0b3256d4429a9d9094.jpg',
            title: "White Garlic",
            price: "$5.00",
            desc: "Mayin sarimsoqli oq sous.",
            ingredients: ['Sarimsoq', 'Qaymoq', 'Ko\'katlar']
        }
    ];

    React.useEffect(() => {
        if (selectedProduct || showRestaurantModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedProduct, showRestaurantModal]);

    const openProductModal = (item) => {
        setSelectedProduct(item);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    return (
        <section className="mosaic-gallery" id="mosaic-gallery">
            <div className="mosaic-container">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`mosaic-item ${item.type}`}
                        onClick={() => openProductModal(item)}
                    >
                        <img src={item.image} alt={item.title} />
                        <div className="mosaic-overlay">
                            <div className="burger-info-split">
                                <div className="info-left"></div>
                                <div className="info-right">
                                    <h3>{item.title}</h3>
                                    <p className="burger-desc">{item.desc}</p>
                                    {item.features && (
                                        <ul className="burger-features">
                                            {item.features.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    )}
                                    <button className="order-small-btn">BATAFSIL +</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div
                    className="mosaic-item restaurant-story"
                    onClick={() => setShowRestaurantModal(true)}
                >
                    <img src="https://www.afisha.uz/uploads/media/2022/05/0563542.jpeg" alt="Our Restaurant" />
                    <div className="mosaic-overlay">
                        <div className="burger-info-split">
                            <div className="info-left"></div>
                            <div className="info-right">
                                <h3>Bizning Tarix</h3>
                                <p className="burger-desc">Restoranimiz haqida qiziqarli ma'lumotlar.</p>
                                <button className="order-small-btn">KO'RISH +</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProductModal}
                    >
                        <motion.div
                            className="modal-content product-modal"
                            initial={{ scale: 0.8, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={closeProductModal}>
                                <FaTimes />
                            </button>
                            <div className="modal-body">
                                <div className="modal-image">
                                    <img src={selectedProduct.image} alt={selectedProduct.title} />
                                </div>
                                <div className="modal-info">
                                    <h3 className="modal-subtitle-premium">Combo Deal</h3>
                                    <h2 className="modal-title-premium">{selectedProduct.title}</h2>
                                    <p className="modal-description-premium">{selectedProduct.desc}</p>

                                    <div className="modal-ingredients-premium">
                                        <h4>TARKIBI:</h4>
                                        <div className="ingredients-pill-grid">
                                            {selectedProduct.ingredients && selectedProduct.ingredients.map((ing, i) => (
                                                <div key={i} className="ingredient-pill">
                                                    {ing}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="modal-footer-premium">
                                        <div className="price-tag-premium">
                                            {selectedProduct.price}
                                        </div>
                                        <button
                                            className="add-to-cart-premium"
                                            disabled={!isStoreOpen}
                                            onClick={() => {
                                                if (isStoreOpen) {
                                                    addToCart(selectedProduct);
                                                    closeProductModal();
                                                }
                                            }}
                                        >
                                            <FaShoppingCart /> SAVATCHAGA QO'SHISH +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Restaurant Info Modal */}
            <AnimatePresence>
                {showRestaurantModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRestaurantModal(false)}
                    >
                        <motion.div
                            className="modal-content restaurant-modal"
                            initial={{ scale: 0.8, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={() => setShowRestaurantModal(false)}>
                                <FaTimes />
                            </button>
                            <div className="modal-body restaurant-body">
                                <div className="restaurant-info-left">
                                    <h3 className="modal-subtitle">BIZ HAQIMIZDA</h3>
                                    <h2 className="modal-title">Afsonaviy Ta'm Tarixi</h2>
                                    <p className="modal-description">
                                        Bizning restoran 2026 yilda tashkil topgan bo'lib, eng sifatli va mazali fast-food taomlarini taqdim etishni o'z oldiga maqsad qilgan.
                                        <br /><br />
                                        Har bir burgerimizda:
                                        <br />
                                        • 100% tabiy va halol mahsulotlar
                                        <br />
                                        • Har kuni yangi pishirilgan nonlar
                                        <br />
                                        • Maxsus retsept asosida tayyorlangan souslar
                                        <br /><br />
                                        Bizning jamoamiz sizga nafaqat mazali taom, balki a'lo darajadagi xizmat va unutilmas muhitni taqdim etishdan faxrlanadi.
                                    </p>
                                    <div className="restaurant-stats">
                                        {[
                                            { num: '5k+', label: 'Mamnun Mijozlar' },
                                            { num: '50+', label: 'Xil Taomlar' },
                                            { num: '24/7', label: 'Xizmat' }
                                        ].map((stat, i) => (
                                            <div key={i} className="stat-item">
                                                <span className="stat-number">{stat.num}</span>
                                                <span className="stat-label">{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="restaurant-image-right">
                                    <img src="https://www.afisha.uz/uploads/media/2022/05/0563542.jpeg" alt="Restaurant Interior" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MosaicGallery;
