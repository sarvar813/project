import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaBolt, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './FlashDeals.css';

const FlashDeals = () => {
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState(3600 + 45 * 60 + 22); // Mock timer for effects

    const dealItem = {
        id: 'flash-1',  
        name: 'FLAMING COMBO DELUXE',
        originalPrice: 25.00,
        dealPrice: 15.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        category: 'BURGERS',
        description: 'Black Star Burger Max + Fri + Coca-Cola. Faqat hozir!'
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <section className="flash-deals-section">
            <div className="section-container">
                <div className="deal-banner">
                    <div className="deal-info-side">
                        <motion.div
                            className="deal-badge"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <FaBolt /> SHOОNQOR TAKLIF
                        </motion.div>
                        <h2>KUNNING "YONAYOTGAN" AKSIYASI 🔥</h2>
                        <p>Vaxt tugamoqda! Ushbu komboni eng arzon narxda sotib oling.</p>

                        <div className="timer-container">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={timeLeft}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="countdown"
                                >
                                    {formatTime(timeLeft)}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="price-tag-big">
                            <span className="old-line">${dealItem.originalPrice}</span>
                            <span className="new-price">${dealItem.dealPrice}</span>
                        </div>

                        <button
                            className="grab-deal-btn"
                            onClick={() => addToCart({ ...dealItem, price: `$${dealItem.dealPrice}` })}
                        >
                            <FaShoppingCart /> SAVATGA QO'SHISH +
                        </button>
                    </div>

                    <div className="deal-visual-side">
                        <div className="floating-elements">
                            <motion.span animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>🔥</motion.span>
                            <motion.span animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>⚡</motion.span>
                        </div>
                        <img src={dealItem.image} alt="Flash Deal" />
                        <div className="discount-circle"> -30% </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashDeals;
