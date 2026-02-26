import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './ComboSpecials.css';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

const comboData = [
    {
        id: 'cb1',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
        title: 'BURGER + FRIES AND SODA',
        price: '$54.00',
        rating: 5,
        description: 'Bizning eng mashhur combo to\'plamimiz: klassik burger, qarsildoq kartoshka va yaxna ichimlik.',
        ingredients: ['Premium Go\'sht', 'Yangi Salat', 'Kartoshka', 'Ichimlik']
    },
    {
        id: 'cb2',
        image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop',
        title: 'THE MEGABURGER SPECIALTY',
        price: '$51.00',
        rating: 5,
        description: 'Haqiqiy gigantlar uchun! Ikki karra go\'sht va ko\'proq pishloq bilan tayyorlangan megaburger.',
        ingredients: ['Ikki karra go\'sht', 'Ekstra Pishloq', 'Qora bulka', 'Maxsus sous']
    },
    {
        id: 'cb3',
        image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop',
        title: 'TWO BURGERS SUPER OFFER',
        price: '$37.50',
        originalPrice: '$51.00',
        rating: 5,
        description: 'Ikkita klassik burger birgalikda arzonroq! Do\'stingiz bilan baham ko\'ring.',
        ingredients: ['2x Klassik bulka', '2x Mol go\'shti', 'Yangi sabzavotlar', 'Cheddar']
    }
];

const ComboSpecials = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const { addToCart, isStoreOpen } = useCart();

    const openModal = (item) => setSelectedItem(item);
    const closeModal = () => setSelectedItem(null);

    return (
        <section className="combo-specials">
            <div className="container">
                <div className="combo-header">
                    <h3 className="combo-subtitle">Latest foody news</h3>
                    <h2 className="combo-main-title">SPECIALS COMBO</h2>
                </div>

                <div className="combo-grid">
                    {comboData.map((item, index) => (
                        <div className="combo-card" key={index} onClick={() => openModal(item)}>
                            <div className="combo-image-wrapper">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <h4 className="combo-item-title">{item.title}</h4>
                            <div className="combo-card-footer">
                                <span className="combo-card-price">{item.price}</span>
                                <button
                                    className="combo-card-add-btn"
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

            {selectedItem && (
                <div className="combo-modal-overlay" onClick={closeModal}>
                    <div className="combo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="combo-modal-close" onClick={closeModal}><FaTimes /></button>
                        <div className="combo-modal-body">
                            <div className="combo-modal-image">
                                <img src={selectedItem.image} alt={selectedItem.title} />
                            </div>
                            <div className="combo-modal-info">
                                <h3 className="combo-modal-subtitle-premium">COMBO DEAL</h3>
                                <p className="combo-modal-description">
                                    Qarsildoq tost qilingan bulka va maxsus kotlet bilan tayyorlangan klassik ta'm.
                                </p>

                                <div className="combo-modal-ingredients">
                                    <h4>TARKIBI:</h4>
                                    <div className="combo-ingredients-pills">
                                        {(selectedItem.ingredients || ['Tostlangan bulka', "Mol go'shti kotleti", 'Cheddar', 'Maxsus sous']).map((ing, i) => (
                                            <div key={i} className="combo-pill">{ing}</div>
                                        ))}
                                    </div>
                                </div>

                                <div className="combo-modal-footer">
                                    <div className="combo-modal-price">{selectedItem.price}</div>
                                    <button
                                        className="combo-add-btn"
                                        disabled={!isStoreOpen}
                                        onClick={() => {
                                            if (isStoreOpen) {
                                                addToCart(selectedItem);
                                                closeModal();
                                            }
                                        }}
                                    >
                                        <FaShoppingCart /> SAVATCHAGA QO'SHISH
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

export default ComboSpecials;
