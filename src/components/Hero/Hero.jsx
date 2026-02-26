import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import './Hero.css';

const slides = [
    {
        productId: 1,
        image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop',
        subtitle: 'PREMIUM QUALITY',
        title: 'BLACK STAR SPECIAL',
        description: 'Haqiqiy 100% mol go\'shti, maxsus qora bulka va bizning sirlangan sousimiz bilan unutilmas ta\'m.',
        price: '$14.99',
        isPremium: true,
        ingredients: ['100% Halol Go\'sht', 'Yangi Pishirilgan Bulka', 'Maxsus Siri-Sous', 'Qora bulka']
    },
    {
        productId: 15,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
        subtitle: 'EXCLUSIVE DEAL',
        title: 'PREMIUM BURGER',
        description: 'Haqiqiy mol go\'shti, yangi sabzavotlar va bizning maxsus sousimiz bilan tayyorlangan shohona lazzat.',
        price: '$12.00',
        isPremium: true,
        ingredients: ['100% Halol Go\'sht', 'Yangi Pishirilgan Bulka', 'Maxsus Siri-Sous', 'Klassik bulka']
    },
    {
        productId: 2,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop',
        subtitle: 'BEST SELLER',
        title: 'MELTY CHEESE BURGER',
        description: 'Eritilgan Cheddar pishlog\'i va qarsildoq bodring bilan boyitilgan klassik lazzat.',
        price: '$9.50',
        ingredients: ['Klassik bulka', 'Mol go\'shti', 'Cheddar pishlog\'i', 'Bodring']
    },
    {
        productId: 3,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1000&auto=format&fit=crop',
        subtitle: 'NEW ARRIVAL',
        title: 'BACON DELIGHT',
        description: 'Qarsildoq bekon va dudlangan Barbeque sousi bilan haqiqiy erish bo\'lmas lazzat.',
        price: '$11.00',
        ingredients: ['Maxsus bulka', 'Dudlangan bekon', 'Mol go\'shti kotleti', 'BBQ sousi']
    }
];

const Hero = () => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const { addToCart, setIsCartOpen, isStoreOpen } = useCart();
    const { products } = useProducts();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!selectedProduct) {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedProduct]);

    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    const handleOrderClick = () => {
        if (!isStoreOpen) return;
        const slide = slides[currentSlide];
        const product = products.find(p => p.id === slide.productId);
        if (product) {
            addToCart(product);
            setIsCartOpen(true);
        } else {
            navigate('/menu');
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedProduct]);

    const openModal = (item) => {
        setSelectedProduct(item);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const goToMenu = () => {
        navigate('/menu');
        window.scrollTo(0, 0);
    };

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const activeSlide = slides[currentSlide];

    return (
        <section className={`hero-premium ${activeSlide.isPremium ? 'premium-hero-active' : ''}`}>
            <motion.div className="scroll-progress" style={{ scaleX }} />

            <div className="hero-split-container">
                <motion.div
                    className="hero-split-left"
                    key={`img-${currentSlide}`}
                    initial={{ opacity: 0, x: -100, rotateY: -30 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, ease: "circOut" }}
                >
                    <motion.div
                        className="hero-image-wrapper"
                        onClick={() => openModal(activeSlide)}
                        whileHover={{ scale: 1.02 }}
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.1}
                    >
                        <img
                            src={activeSlide.image}
                            alt={activeSlide.title}
                            className={`floating-img ${!isStoreOpen ? 'grayscale' : ''}`}
                            style={{ cursor: 'pointer' }}
                        />
                        <div className="img-hover-hint">RECIPE</div>
                    </motion.div>
                </motion.div>

                <div className="hero-split-right">
                    <div className="hero-text-content">
                        <motion.h4
                            className="hero-label"
                            initial={{ opacity: 0, letterSpacing: "20px" }}
                            animate={{ opacity: 1, letterSpacing: "5px" }}
                            transition={{ duration: 1 }}
                        >
                            {activeSlide.subtitle}
                        </motion.h4>

                        <div className="title-container" style={{ overflow: 'hidden' }}>
                            <motion.h1
                                className="hero-main-title"
                                key={currentSlide}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "anticipate" }}
                            >
                                {isStoreOpen ? activeSlide.title : 'MAHSULOTLAR QOLMADI'}
                            </motion.h1>
                        </div>

                        <motion.p
                            className="hero-main-desc"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            {isStoreOpen
                                ? activeSlide.description
                                : 'Hozirda barcha mahsulotlarimiz tugagan. Tez orada yangi mahsulotlar keladi!'}
                        </motion.p>

                        {activeSlide.isPremium && activeSlide.ingredients && (
                            <div className="hero-premium-features">
                                {activeSlide.ingredients.map((ing, i) => (
                                    <div key={i} className="h-feature">
                                        <span className="h-check">✓</span> {ing}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isStoreOpen && !activeSlide.isPremium && (
                            <div className="hero-price-tag">
                                <span>Soting olish: </span>
                                <span className="h-price">{activeSlide.price}</span>
                            </div>
                        )}

                        <div className="hero-actions">
                            <button
                                className={`h-order-btn ${!isStoreOpen ? 'disabled' : ''}`}
                                onClick={handleOrderClick}
                                disabled={!isStoreOpen}
                            >
                                {isStoreOpen ? t('hero.order_now') + ' +' : t('hero.out_of_stock')}
                            </button>
                            {!activeSlide.isPremium && <button className="h-view-btn" onClick={goToMenu}>{t('hero.view_menu')}</button>}
                        </div>
                    </div>
                </div>
            </div>


            <div className="hero-nav-dots">
                {slides.map((_, idx) => (
                    <span
                        key={idx}
                        className={`h-dot ${currentSlide === idx ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                    ></span>
                ))}
            </div>

            {/* Recipe Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        style={{ zIndex: 10000 }}
                    >
                        <motion.div
                            className="modal-content recipe-modal"
                            initial={{ scale: 0.8, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>
                            <div className="modal-body">
                                <div className="modal-image">
                                    <img src={selectedProduct.image} alt={selectedProduct.title} />
                                </div>
                                <div className="modal-info">
                                    <h3 className="modal-subtitle-premium">Combo Deal</h3>
                                    <h2 className="modal-title-premium">{selectedProduct.title}</h2>
                                    <p className="modal-description-premium">{selectedProduct.description}</p>

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
                                                    const product = products.find(p => p.id === selectedProduct.productId);
                                                    if (product) addToCart(product);
                                                    closeModal();
                                                    setIsCartOpen(true);
                                                }
                                            }}
                                        >
                                            <FaShoppingCart /> SAVATCHAGA QO'SHISH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;
