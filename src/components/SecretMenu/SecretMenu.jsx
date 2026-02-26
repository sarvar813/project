import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUserShield, FaCrown, FaGem, FaSkull } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './SecretMenu.css';

const secretProducts = [
    {
        id: 'vip-1',
        name: 'The Golden Emperor',
        price: 250.00,
        image: 'https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?q=80&w=1974&auto=format&fit=crop',
        desc: 'Wrapped in 24K edible gold leaf, Wagyu beef from Hyogo, truffle-infused brie, and Iranian saffron aioli.',
        exclusive: true
    },
    {
        id: 'vip-2',
        name: 'Black Diamond Beast',
        price: 180.00,
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop',
        desc: 'Charcoal-infused bun, 10-ounce dry-aged beef, Osetra caviar, and a reduction of 50-year aged balsamic.',
        exclusive: true
    },
    {
        id: 'vip-3',
        name: 'Midnight Mafia',
        price: 155.00,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2070&auto=format&fit=crop',
        desc: 'The deadliest recipe. Smoked ghost pepper, bison meat, and a secret spice blend known only to the boss.',
        exclusive: true
    }
];

const SecretMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const { addToCart } = useCart();
    const timerRef = useRef(null);

    // This listener will be globally available to detect the 3-second hold on the logo
    // For now, let's provide a hidden trigger in the component itself for testing
    const handleStart = () => {
        setIsUnlocking(true);
        timerRef.current = setTimeout(() => {
            setIsOpen(true);
            setIsUnlocking(false);
            // Play a sound effect if possible
        }, 3000);
    };

    const handleEnd = () => {
        clearTimeout(timerRef.current);
        if (!isOpen) setIsUnlocking(false);
    };

    useEffect(() => {
        // Find the logo in the DOM and attach long-press listeners
        const logo = document.querySelector('.navbar-brand');
        if (logo) {
            logo.addEventListener('mousedown', handleStart);
            logo.addEventListener('mouseup', handleEnd);
            logo.addEventListener('mouseleave', handleEnd);
            logo.addEventListener('touchstart', handleStart);
            logo.addEventListener('touchend', handleEnd);
        }
        return () => {
            if (logo) {
                logo.removeEventListener('mousedown', handleStart);
                logo.removeEventListener('mouseup', handleEnd);
                logo.removeEventListener('mouseleave', handleEnd);
                logo.removeEventListener('touchstart', handleStart);
                logo.removeEventListener('touchend', handleEnd);
            }
        };
    }, []);

    return (
        <>
            {/* Hidden Progress Bar on Top while unlocking */}
            <AnimatePresence>
                {isUnlocking && !isOpen && (
                    <motion.div
                        className="unlock-progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "linear" }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="secret-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="secret-matrix-bg"></div>

                        <motion.button
                            className="close-secret"
                            onClick={() => setIsOpen(false)}
                            whileHover={{ rotate: 90 }}
                        >
                            ×
                        </motion.button>

                        <div className="secret-content">
                            <motion.div
                                className="secret-header"
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <FaUserShield className="vip-shield" />
                                <h1>VIP SECRET MENU</h1>
                                <p>Faqat elita uchun maxsus yashirin menyu</p>
                                <div className="header-line"></div>
                            </motion.div>

                            <div className="secret-products-grid">
                                {secretProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        className="secret-card"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="secret-img-container">
                                            <img src={product.image} alt={product.name} />
                                            <div className="exclusive-badge">
                                                <FaCrown /> EXCLUSIVE
                                            </div>
                                        </div>
                                        <div className="secret-info">
                                            <h3>{product.name}</h3>
                                            <p>{product.desc}</p>
                                            <div className="secret-footer">
                                                <span className="secret-price">${product.price.toFixed(2)}</span>
                                                <motion.button
                                                    className="vip-order-btn"
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        addToCart(product);
                                                        // Maybe close modal or show success
                                                    }}
                                                >
                                                    MEMBER ACCESS +
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className="security-notice"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ delay: 0.8 }}
                            >
                                <FaSkull /> Ushbu menyu matbuot va omma uchun yopiq. Tarqatish qat'iyan man etiladi.
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SecretMenu;
