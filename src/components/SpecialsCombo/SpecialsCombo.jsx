import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './SpecialsCombo.css';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

const specials = [
    {
        id: 'c1',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
        title: 'UNIQUE BURGER',
        price: '$54.00',
        rating: 2,
        description: 'Bizning eng g\'ayrioddiy va noyob ta\'mdagi burgerimiz. Maxsus tanlangan ingrediyentlar uyg\'unligi.',
        ingredients: ['Premium Go\'sht', 'Yangi Salat', 'Maxsus Ziravorlar', 'Pishloq']
    },
    {
        id: 'c2',
        image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=800&auto=format&fit=crop',
        title: 'SOFT BURGER',
        price: '$51.00',
        rating: 5,
        description: 'Yumshoqqina qora bulka va suvli tovuq go\'shti bilan tayyorlangan lazzatli tanlov.',
        ingredients: ['Qora bulka', 'Tovuq go\'shti', 'Yangi sabzavotlar', 'Oq sous']
    },
    {
        id: 'c3',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        title: 'TOAST BURGER',
        price: '$37.50',
        originalPrice: '$51.00',
        rating: 4,
        description: 'Qarsildoq tost qilingan bulka va maxsus kotlet bilan tayyorlangan klassik ta\'m.',
        ingredients: ['Tostlangan bulka', 'Mol go\'shti kotleti', 'Cheddar', 'Maxsus sous']
    },
    {
        id: 'c4',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
        title: 'ZERO BURGER',
        price: '$51.00',
        rating: 3,
        description: 'Hech qanday ortiqcha narsasiz, faqat eng toza va mazali ingrediyentlar. Coca-Cola bilan ideal kombinatsiya.',
        ingredients: ['Klassik bulka', 'Mol go\'shti', 'Salat bargi', 'Pomidor']
    }
];

const SpecialsCombo = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const { addToCart, isStoreOpen } = useCart();

    React.useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedItem]);

    const openModal = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    return (
        <section className="specials-combo" id="menu-section">
            <div className="container">
                <div className="specials-header">
                    <h3 className="specials-subtitle">Latest foody news</h3>
                    <h2 className="specials-title">IT'S ALL ABOUT FOOD</h2>
                </div>

                <div className="specials-grid">
                    {specials.map((item, index) => (
                        <div className="special-card" key={index} onClick={() => openModal(item)}>
                            <div className="special-image">
                                <img src={item.image} alt={item.title} />
                                {item.title === 'TOAST BURGER' && <div className="promo-badge">⚡</div>}
                            </div>
                            <h4 className="special-name">{item.title}</h4>
                            <div className="special-rating">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`star ${i < item.rating ? 'active' : ''}`}>★</span>
                                ))}
                            </div>
                            <div className="special-price-info">
                                <div className="price-stack">
                                    {item.originalPrice && <span className="old-price">{item.originalPrice}</span>}
                                    <span className="new-price">{item.price}</span>
                                </div>
                                <button
                                    className="special-add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isStoreOpen) addToCart(item);
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Window */}
            {selectedItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className={`modal-content ${selectedItem.isPremium ? 'premium-modal-v2' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            <FaTimes />
                        </button>

                        <div className="modal-body">
                            <div className="modal-image">
                                <img src={selectedItem.image} alt={selectedItem.title} />
                            </div>
                            <div className="modal-info">
                                <h3 className="modal-subtitle-premium">Combo Deal</h3>
                                <h2 className="modal-title-premium">{selectedItem.title}</h2>
                                <p className="modal-description-premium">{selectedItem.description}</p>

                                <div className="modal-ingredients-premium">
                                    <h4>TARKIBI:</h4>
                                    <div className="ingredients-pill-grid">
                                        {selectedItem.ingredients.map((ing, i) => (
                                            <div key={i} className="ingredient-pill">
                                                {ing}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-footer-premium">
                                    <div className="price-tag-premium">
                                        {selectedItem.price}
                                    </div>
                                    <button
                                        className="add-to-cart-premium"
                                        disabled={!isStoreOpen}
                                        onClick={() => {
                                            if (isStoreOpen) {
                                                addToCart(selectedItem);
                                                closeModal();
                                            }
                                        }}
                                    >
                                        <FaShoppingCart /> SAVATCHAGA QO'SHISH +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default SpecialsCombo;
