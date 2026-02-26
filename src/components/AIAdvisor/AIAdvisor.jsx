import React, { useState } from 'react';
import { FaRobot, FaMagic, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import './AIAdvisor.css';

const AIAdvisor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: Start, 1: Spiciness, 2: Meat, 3: Result
    const [preferences, setPreferences] = useState({});
    const [suggestion, setSuggestion] = useState(null);
    const { products } = useProducts();
    const { addToCart, setIsCartOpen } = useCart();

    const questions = [
        {
            id: 'spicy',
            q: 'Bugun kayfiyatingiz qanday? Achchiqroq taom xohlaysizmi?',
            options: [
                { label: 'Ha, olovli bo\'lsin! 🔥', value: 'hot' },
                { label: 'Yo\'q, yumshoqroq bo\'lgani ma\'qul 😊', value: 'mild' }
            ]
        },
        {
            id: 'meat',
            q: 'Go\'shtning qaysi turini ko\'proq yoqtirasiz?',
            options: [
                { label: 'Mol go\'shti 🐄', value: 'beef' },
                { label: 'Tovuq go\'shti 🍗', value: 'chicken' }
            ]
        }
    ];

    const handleOption = (val) => {
        const currentQ = questions[step - 1];
        const newPrefs = { ...preferences, [currentQ.id]: val };
        setPreferences(newPrefs);

        if (step < questions.length) {
            setStep(step + 1);
        } else {
            generateSuggestion(newPrefs);
            setStep(step + 1);
        }
    };

    const generateSuggestion = (prefs) => {
        // Simple logic to find a matching product
        const burgerItems = products.filter(p => p.category === 'BURGERS' || p.category === 'TOP BURGERS');

        // Filter based on preferences
        let matched = burgerItems.find(p => {
            const name = p.name.toLowerCase();
            const ingredients = p.ingredients ? p.ingredients.join(' ').toLowerCase() : '';
            const description = p.description ? p.description.toLowerCase() : '';

            const isChicken = name.includes('chicken') || ingredients.includes('tovuq');
            const isSpicy = name.includes('spicy') || name.includes('mexican') || ingredients.includes('jalapeno') || description.includes('achchiq');

            const matchMeat = (prefs.meat === 'chicken' && isChicken) || (prefs.meat === 'beef' && !isChicken);
            const matchSpicy = (prefs.spicy === 'hot' && isSpicy) || (prefs.spicy === 'mild' && !isSpicy);

            return matchMeat && matchSpicy;
        });

        // If no perfect match, just try to match meat
        if (!matched) {
            matched = burgerItems.find(p => {
                const name = p.name.toLowerCase();
                const ingredients = p.ingredients ? p.ingredients.join(' ').toLowerCase() : '';
                const isChicken = name.includes('chicken') || ingredients.includes('tovuq');
                return (prefs.meat === 'chicken' && isChicken) || (prefs.meat === 'beef' && !isChicken);
            });
        }

        if (!matched) matched = burgerItems[0]; // Final fallback
        setSuggestion(matched);
    };

    const resetAI = () => {
        setStep(1);
        setPreferences({});
        setSuggestion(null);
    };

    return (
        <>
            <button className="ai-trigger-btn" onClick={() => { setIsOpen(true); if (step === 0) setStep(1); }}>
                <div className="ai-icon-wrapper">
                    <FaRobot />
                    <span className="ai-badge">AI</span>
                </div>
                <span>Burger Advisor</span>
            </button>

            {isOpen && (
                <div className="ai-overlay">
                    <div className="ai-modal">
                        <button className="ai-close" onClick={() => setIsOpen(false)}><FaTimes /></button>

                        <div className="ai-header">
                            <FaRobot className="bot-icon" />
                            <h3>AI Burger Advisor</h3>
                            <p>Sizga eng mos taomni tanlab beraman</p>
                        </div>

                        <div className="ai-body">
                            {step > 0 && step <= questions.length && (
                                <div className="ai-question-box">
                                    <h4>{questions[step - 1].q}</h4>
                                    <div className="ai-options">
                                        {questions[step - 1].options.map((opt, i) => (
                                            <button key={i} onClick={() => handleOption(opt.value)}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="step-dots">
                                        {questions.map((_, i) => (
                                            <div key={i} className={`dot ${step === i + 1 ? 'active' : ''}`}></div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step > questions.length && suggestion && (
                                <div className="ai-result-box">
                                    <h4>Siz uchun eng yaxshi tanlov:</h4>
                                    <div className="suggested-product">
                                        <img src={suggestion.image} alt={suggestion.name} />
                                        <div className="suggested-info">
                                            <h5>{suggestion.name}</h5>
                                            <span className="price">{suggestion.price}</span>
                                        </div>
                                    </div>
                                    <div className="ai-actions">
                                        <button className="add-ai-btn" onClick={() => {
                                            addToCart(suggestion);
                                            setIsOpen(false);
                                            setIsCartOpen(true);
                                        }}>
                                            SAVATGA QO'SHISH <FaMagic />
                                        </button>
                                        <button className="retry-btn" onClick={resetAI}>QAYTADAN BOSHLASH</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAdvisor;
