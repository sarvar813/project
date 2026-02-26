import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaTimes, FaRegSmile, FaRegAngry, FaRegLaugh, FaTired, FaFire, FaLeaf, FaUtensils } from 'react-icons/fa';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import './MoodFood.css';

const MoodFood = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({ mood: '', preference: '' });
    const [recommendation, setRecommendation] = useState(null);
    const { products } = useProducts();
    const { addToCart } = useCart();

    const moods = [
        { id: 'happy', icon: <FaRegLaugh />, label: 'Baxtiyor', color: '#f1c40f' },
        { id: 'angry', icon: <FaRegAngry />, label: 'Jahldor', color: '#e30034' },
        { id: 'lazy', icon: <FaTired />, label: 'Dangasa', color: '#3498db' },
        { id: 'hungry', icon: <FaRegSmile />, label: 'Juda och', color: '#2ecc71' }
    ];

    const preferences = [
        { id: 'Spicy', icon: <FaFire />, label: 'Achchiq' },
        { id: 'Healthy', icon: <FaLeaf />, label: 'Sog\'lom' },
        { id: 'Popular', icon: <FaUtensils />, label: 'Klassik' }
    ];

    const handleMoodSelect = (mood) => {
        setSelections({ ...selections, mood });
        setStep(2);
    };

    const handlePreferenceSelect = (pref) => {
        setStep(3);
        // "AI Thinking" simulation
        setTimeout(() => {
            const pool = products.filter(p => p.tags && p.tags.includes(pref));
            const selected = pool.length > 0
                ? pool[Math.floor(Math.random() * pool.length)]
                : products[Math.floor(Math.random() * products.length)];
            setRecommendation(selected);
            setStep(4);
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setRecommendation(null);
        setSelections({ mood: '', preference: '' });
    };

    return (
        <>
            <button className="mood-trigger" onClick={() => setIsOpen(true)}>
                <FaMagic />
                <span className="tooltip">Sehrli Quti</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mood-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="mood-modal"
                            initial={{ y: 50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-mood" onClick={() => setIsOpen(false)}><FaTimes /></button>

                            {step === 1 && (
                                <div className="mood-step">
                                    <h3>Hozirgi kayfiyatingiz qanday?</h3>
                                    <div className="mood-grid">
                                        {moods.map(m => (
                                            <button key={m.id} onClick={() => handleMoodSelect(m.id)} style={{ '--hover-color': m.color }}>
                                                <span className="m-icon">{m.icon}</span>
                                                <span className="m-label">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="mood-step">
                                    <h3>Nima xohlaysiz?</h3>
                                    <div className="pref-list">
                                        {preferences.map(p => (
                                            <button key={p.id} onClick={() => handlePreferenceSelect(p.id)}>
                                                {p.icon} {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="mood-step thinking">
                                    <div className="magic-loader">
                                        <FaMagic className="spin-magic" />
                                    </div>
                                    <h3>AI siz uchun eng yaxshisini tanlayapti...</h3>
                                </div>
                            )}

                            {step === 4 && recommendation && (
                                <div className="mood-step final">
                                    <div className="confetti-mini">✨</div>
                                    <h3>Siz uchun tanlovimiz:</h3>
                                    <div className="rec-card">
                                        <img src={recommendation.image} alt={recommendation.name} />
                                        <h4>{recommendation.name}</h4>
                                        <p>{recommendation.price}</p>
                                        <button className="add-rec-btn" onClick={() => {
                                            addToCart(recommendation);
                                            setIsOpen(false);
                                            reset();
                                        }}>Savatchaga qo'shish +</button>
                                    </div>
                                    <button className="try-again" onClick={reset}>Boshqa tanlov</button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MoodFood;
