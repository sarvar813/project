import React, { useState } from 'react';
import { FaPlus, FaMinus, FaLayerGroup, FaCheck, FaShoppingCart, FaShareAlt, FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import './BurgerBuilder.css';

const ingredients = {
    buns: [
        { id: 'b1', name: 'Klassik nonga', price: 2, color: '#f5d6a7' },
        { id: 'b2', name: 'Qora Non (BlackStar)', price: 3, color: '#111' },
        { id: 'b3', name: 'Sutli bulochka', price: 2.5, color: '#f9f3e3' }
    ],
    meat: [
        { id: 'm1', name: 'Mol go\'shti', price: 5, color: '#7b3f00' },
        { id: 'm2', name: 'Tovuq go\'shti', price: 4, color: '#e2ab5f' },
        { id: 'm3', name: 'Double Meat', price: 9, color: '#5a2d00' }
    ],
    cheese: [
        { id: 'c1', name: 'Chedder', price: 1.5, color: '#ffcc00' },
        { id: 'c2', name: 'Motsarella', price: 2, color: '#fff9e3' },
        { id: 'c3', name: 'Pishloq Yo\'q', price: 0, color: 'transparent' }
    ],
    toppings: [
        { id: 't1', name: 'Salat bargi', price: 0.5 },
        { id: 't2', name: 'Pomidor', price: 0.5 },
        { id: 't3', name: 'Tuzlangan bodring', price: 1 },
        { id: 't4', name: 'Piyoz', price: 0.5 },
        { id: 't5', name: 'Jalapeno 🔥', price: 1.5 }
    ],
    sauces: [
        { id: 's1', name: 'Klassik sous', price: 0.5 },
        { id: 's2', name: 'Barbeque', price: 1 },
        { id: 's3', name: 'Achchiq sous', price: 1 }
    ]
};

const BurgerBuilder = () => {
    const [isExploded, setIsExploded] = useState(false);
    const layerVariants = {
        initial: { y: -50, opacity: 0, scale: 0.8 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: 50, opacity: 0, scale: 0.8 }
    };
    const { addToCart, setIsCartOpen } = useCart();
    const [selections, setSelections] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const combo = params.get('combo');
        if (combo) {
            try {
                const decoded = JSON.parse(atob(combo));
                return {
                    bun: ingredients.buns.find(b => b.id === decoded.b) || ingredients.buns[0],
                    meat: ingredients.meat.find(m => m.id === decoded.m) || ingredients.meat[0],
                    cheese: ingredients.cheese.find(c => c.id === decoded.c) || ingredients.cheese[0],
                    toppings: ingredients.toppings.filter(t => decoded.t.includes(t.id)),
                    sauce: ingredients.sauces.find(s => s.id === decoded.s) || ingredients.sauces[0]
                };
            } catch (e) { console.error(e); }
        }
        return {
            bun: ingredients.buns[0],
            meat: ingredients.meat[0],
            cheese: ingredients.cheese[0],
            toppings: [],
            sauce: ingredients.sauces[0]
        };
    });

    const calculateTotal = () => {
        let total = selections.bun.price + selections.meat.price + selections.cheese.price + selections.sauce.price;
        selections.toppings.forEach(t => total += t.price);
        return total;
    };

    const handleTopping = (topping) => {
        setSelections(prev => {
            const exists = prev.toppings.find(t => t.id === topping.id);
            if (exists) {
                return { ...prev, toppings: prev.toppings.filter(t => t.id !== topping.id) };
            }
            return { ...prev, toppings: [...prev.toppings, topping] };
        });
    };

    const handleShare = () => {
        const config = {
            b: selections.bun.id,
            m: selections.meat.id,
            c: selections.cheese.id,
            t: selections.toppings.map(t => t.id),
            s: selections.sauce.id
        };
        const encoded = btoa(JSON.stringify(config));
        const url = `${window.location.origin}${window.location.pathname}?combo=${encoded}`;
        navigator.clipboard.writeText(url);
        alert("Combo havolasi nusxalandi! Do'stlaringizga yuboring 🍔");
    };

    const handleFinish = () => {
        const customBurger = {
            id: 'custom-' + Date.now(),
            name: 'MAXSUS BURGER (Sizniki!)',
            price: `$${calculateTotal().toFixed(2)}`,
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
            category: 'CUSTOM',
            description: `${selections.bun.name}, ${selections.meat.name}, ${selections.cheese.name}, ${selections.toppings.map(t => t.name).join(', ')}, ${selections.sauce.name}`
        };
        addToCart(customBurger);
        setIsCartOpen(true);
    };

    return (
        <section className="burger-builder">
            <div className="builder-container">
                <div className="builder-visual">
                    <button
                        className={`explode-toggle ${isExploded ? 'active' : ''}`}
                        onClick={() => setIsExploded(!isExploded)}
                        title={isExploded ? "Birlashtirish" : "Qatlamlarni ko'rish"}
                    >
                        {isExploded ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
                    </button>
                    <div className={`burger-layers ${isExploded ? 'is-exploded' : ''}`}>
                        <motion.div
                            key={selections.bun.id + '-top'}
                            variants={layerVariants}
                            initial="initial"
                            animate={{
                                ...layerVariants.animate,
                                y: isExploded ? -120 : 0,
                                zIndex: 100
                            }}
                            className="layer bun-top"
                            style={{ backgroundColor: selections.bun.color }}
                        />

                        <AnimatePresence>
                            {selections.toppings.map((t, idx) => (
                                <motion.div
                                    key={t.id}
                                    variants={layerVariants}
                                    initial="initial"
                                    animate={{
                                        ...layerVariants.animate,
                                        y: isExploded ? (-60 - (idx * 20)) : 0,
                                        zIndex: 80 - idx
                                    }}
                                    exit="exit"
                                    className={`layer topping ${t.id}`}
                                />
                            ))}
                        </AnimatePresence>

                        <motion.div
                            key={selections.cheese.id}
                            variants={layerVariants}
                            animate={{
                                ...layerVariants.animate,
                                y: isExploded ? 0 : 0,
                                zIndex: 60
                            }}
                            initial="initial"
                            className="layer cheese"
                            style={{
                                backgroundColor: selections.cheese.color,
                                display: selections.cheese.id === 'c3' ? 'none' : 'block'
                            }}
                        />

                        <motion.div
                            key={selections.meat.id}
                            variants={layerVariants}
                            animate={{
                                ...layerVariants.animate,
                                y: isExploded ? 60 : 0,
                                zIndex: 40
                            }}
                            initial="initial"
                            className="layer meat"
                            style={{ backgroundColor: selections.meat.color }}
                        />

                        <motion.div
                            key={selections.bun.id + '-bottom'}
                            variants={layerVariants}
                            animate={{
                                ...layerVariants.animate,
                                y: isExploded ? 120 : 0,
                                zIndex: 20
                            }}
                            initial="initial"
                            className="layer bun-bottom"
                            style={{ backgroundColor: selections.bun.color }}
                        />
                    </div>
                </div>

                <div className="builder-controls">
                    <div className="builder-header">
                        <h2><FaLayerGroup /> O'z burgerni yarat!</h2>
                        <p>Har bir qavatni o'z xohishingizga ko'ra tanlang</p>
                    </div>

                    <div className="control-group">
                        <h3>Noni tanlang</h3>
                        <div className="options-grid">
                            {ingredients.buns.map(b => (
                                <button
                                    key={b.id}
                                    className={selections.bun.id === b.id ? 'active' : ''}
                                    onClick={() => setSelections({ ...selections, bun: b })}
                                >
                                    {b.name} <span>(+${b.price})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <h3>Go'sht turi</h3>
                        <div className="options-grid">
                            {ingredients.meat.map(m => (
                                <button
                                    key={m.id}
                                    className={selections.meat.id === m.id ? 'active' : ''}
                                    onClick={() => setSelections({ ...selections, meat: m })}
                                >
                                    {m.name} <span>(+${m.price})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <h3>To'ldirgichlar (Extras)</h3>
                        <div className="options-grid toppings">
                            {ingredients.toppings.map(t => (
                                <button
                                    key={t.id}
                                    className={selections.toppings.find(st => st.id === t.id) ? 'active' : ''}
                                    onClick={() => handleTopping(t)}
                                >
                                    {t.name} <span>(+${t.price})</span>
                                    {selections.toppings.find(st => st.id === t.id) && <FaCheck className="check-icon" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="builder-footer">
                        <div className="total-price">
                            <span>Umumiy narx:</span>
                            <h3>${calculateTotal().toFixed(2)}</h3>
                        </div>
                        <div className="builder-actions">
                            <button className="share-btn" onClick={handleShare} title="Combo-ni ulashish">
                                <FaShareAlt />
                            </button>
                            <button className="finish-btn" onClick={handleFinish}>
                                <FaShoppingCart /> SAVATGA QO'SHISH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BurgerBuilder;
