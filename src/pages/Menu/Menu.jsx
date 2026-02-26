import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { FaTimes, FaShoppingCart, FaPlus, FaStar, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import Skeleton from '../../components/Skeleton/Skeleton';
import './Menu.css';

const Menu = () => {
    const { t } = useTranslation();
    const { products, addReview } = useProducts();
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', user: '' });
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const searchQuery = searchParams.get('search') || '';
    const { addToCart, isStoreOpen } = useCart();
    const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
    const [activeTag, setActiveTag] = useState('ALL');
    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [filter, searchQuery]);

    const openModal = (item) => {
        setSelectedItem(item);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    const filteredItems = products.filter(item => {
        const matchesCategory = filter === 'ALL' || item.category === filter;
        const matchesTag = activeTag === 'ALL' || (item.tags && item.tags.includes(activeTag));
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesTag && matchesSearch;
    });

    const clearSearch = () => {
        setSearchParams({});
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReview.user || !newReview.comment) return;
        addReview(selectedItem.id, newReview);
        setNewReview({ rating: 5, comment: '', user: '' });
    };

    return (
        <div className="menu-page">
            <div className="menu-hero">
                <h1>{t('menu.title', 'OUR EXQUISITE MENU')}</h1>
                <p>{t('menu.subtitle', 'Taste the best fast food in town')}</p>
            </div>

            <div className="container">
                <div className="menu-controls">
                    <div className="menu-search-bar">
                        <input
                            type="text"
                            placeholder={t('menu.search_placeholder', 'Ovqatni qidirish...')}
                            value={localSearch}
                            onChange={(e) => {
                                setLocalSearch(e.target.value);
                                setSearchParams({ search: e.target.value });
                            }}
                        />
                        <FaSearch className="search-icon-inside" />
                    </div>

                    <div className="menu-filter">
                        {['ALL', 'BURGERS', 'SALADS', 'PIZZA', 'SIDES', 'DRINKS'].map(cat => (
                            <button
                                key={cat}
                                className={filter === cat ? 'active' : ''}
                                onClick={() => {
                                    setIsLoading(true);
                                    setFilter(cat);
                                }}
                            >
                                {t(`menu.categories.${cat.toLowerCase()}`, cat)}
                            </button>
                        ))}
                    </div>

                    <div className="tag-filters">
                        {['ALL', 'Popular', 'Spicy', 'Vegan', 'Healthy'].map(tag => (
                            <button
                                key={tag}
                                className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
                                onClick={() => setActiveTag(tag)}
                            >
                                {tag === 'ALL' ? t('menu.all_tags', 'Barchasi') : tag}
                            </button>
                        ))}
                    </div>
                </div>

                {searchQuery && (
                    <div className="search-results-info">
                        <p>{t('menu.search_results', 'Qidiruv natijasi')}: <strong>"{searchQuery}"</strong></p>
                        <button onClick={clearSearch} className="clear-search-btn">{t('menu.clear_search', 'Qidiruvni tozalash')}</button>
                    </div>
                )}

                <div className="menu-items-grid">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="menu-item-card skeleton-card">
                                <Skeleton height="200px" borderRadius="15px 15px 0 0" />
                                <div style={{ padding: '20px' }}>
                                    <Skeleton width="60%" height="24px" />
                                    <Skeleton width="40%" height="18px" />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                        <Skeleton width="30%" height="28px" />
                                        <Skeleton width="40px" height="40px" borderRadius="50%" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                className={`menu-item-card ${item.isAvailable === false ? 'out-of-stock' : ''}`}
                                onClick={() => openModal(item)}
                            >
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-category">{item.category}</div>
                                    {item.isAvailable === false && <div className="out-of-stock-badge">{t('menu.out_of_stock', 'TUGAGAN')}</div>}
                                    {item.discountLabel && (
                                        <div className="item-discount-badge">{item.discountLabel}</div>
                                    )}
                                    {item.rating && (
                                        <div className="item-rating-badge">
                                            <FaStar /> {item.rating.toFixed(1)}
                                        </div>
                                    )}
                                    <button
                                        className={`item-wishlist-btn ${isInWishlist(item.id) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(item);
                                        }}
                                    >
                                        {isInWishlist(item.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <div className="item-footer">
                                        <div className="item-price-group">
                                            {item.originalPrice && (
                                                <span className="item-original-price">{item.originalPrice}</span>
                                            )}
                                            <span className="item-price">{item.price}</span>
                                        </div>
                                        <div className="card-rating-info">
                                            <FaStar /> {(item.reviews && item.reviews.length > 0)
                                                ? (item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length).toFixed(1)
                                                : item.rating ? item.rating.toFixed(1) : '5.0'}
                                            <span>({item.reviews?.length || 0})</span>
                                        </div>
                                        <button
                                            className="add-btn"
                                            disabled={!isStoreOpen || item.isAvailable === false}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isStoreOpen && item.isAvailable !== false) addToCart(item);
                                            }}
                                        >
                                            <FaPlus /> +
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="no-results">
                            <h3>{t('menu.no_results_title', 'Hech narsa topilmadi 😕')}</h3>
                            <p>{t('menu.no_results_desc', 'Boshqa so\'z bilan qidirib ko\'ring yoki barcha mahsulotlarni ko\'ring.')}</p>
                            <button onClick={clearSearch}>{t('menu.view_all', 'BARCHA MAHSULOTLAR')}</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Item Modal */}
            {selectedItem && (
                <div className="menu-modal-overlay" onClick={closeModal}>
                    <div className={`menu-modal-content ${selectedItem.isPremium ? 'premium-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="menu-modal-close" onClick={closeModal}>
                            <FaTimes />
                        </button>

                        <div className="menu-modal-body">
                            <div className="menu-modal-image">
                                <img src={selectedItem.image} alt={selectedItem.name} />
                                <div className="modal-rating">
                                    <FaStar /> {selectedItem.rating?.toFixed(1) || 'N/A'}
                                </div>
                                <button
                                    className={`modal-wishlist-btn ${isInWishlist(selectedItem.id) ? 'active' : ''}`}
                                    onClick={() => toggleWishlist(selectedItem)}
                                >
                                    {isInWishlist(selectedItem.id) ? <FaHeart /> : <FaRegHeart />}
                                </button>
                            </div>
                            <div className="menu-modal-info">
                                <span className="modal-category">{selectedItem.category}</span>
                                <h2 className="modal-title">{selectedItem.name}</h2>
                                <p className="modal-description">{selectedItem.description}</p>

                                <div className="modal-ingredients">
                                    <h4>{t('menu.ingredients_title', 'Tarkibi:')}</h4>
                                    <ul>
                                        {selectedItem.ingredients.map((ing, i) => (
                                            <li key={i}>
                                                {selectedItem.isPremium && <span className="premium-check">✓</span>}
                                                {ing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="modal-reviews-section">
                                    <h4>{t('menu.reviews_title', 'Mijozlar fikrlari:')}</h4>
                                    <div className="reviews-list">
                                        {selectedItem.reviews && selectedItem.reviews.length > 0 ? (
                                            selectedItem.reviews.map(rev => (
                                                <div key={rev.id} className="review-item">
                                                    <div className="review-header">
                                                        <strong>{rev.user}</strong>
                                                        <span><FaStar /> {rev.rating}</span>
                                                    </div>
                                                    <p>{rev.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-reviews">{t('menu.no_reviews', 'Hozircha fikrlar yo\'q.')}</p>
                                        )}
                                    </div>

                                    <form className="add-review-form" onSubmit={handleReviewSubmit}>
                                        <h5>{t('menu.add_review_title', 'Fikr qoldirish')}</h5>
                                        <input
                                            type="text"
                                            placeholder={t('menu.name_placeholder', 'Ismingiz')}
                                            value={newReview.user}
                                            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                                            required
                                        />
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                        >
                                            <option value="5">5 - {t('menu.rating.5', 'Alo')}</option>
                                            <option value="4">4 - {t('menu.rating.4', 'Yaxshi')}</option>
                                            <option value="3">3 - {t('menu.rating.3', 'O\'rtacha')}</option>
                                            <option value="2">2 - {t('menu.rating.2', 'Yomon')}</option>
                                            <option value="1">1 - {t('menu.rating.1', 'Juda yomon')}</option>
                                        </select>
                                        <textarea
                                            placeholder={t('menu.comment_placeholder', 'Fikringiz...')}
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            required
                                        />
                                        <button type="submit">{t('menu.submit_review', 'YUBORISH')}</button>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <div className="modal-price-group">
                                        {selectedItem.originalPrice && (
                                            <span className="modal-old-price">{selectedItem.originalPrice}</span>
                                        )}
                                        <span className="modal-price">{selectedItem.price}</span>
                                        {selectedItem.discountLabel && (
                                            <span className="modal-sale-tag">{selectedItem.discountLabel}</span>
                                        )}
                                    </div>
                                    <button
                                        className="modal-add-btn"
                                        disabled={!isStoreOpen || selectedItem.isAvailable === false}
                                        onClick={() => {
                                            if (isStoreOpen && selectedItem.isAvailable !== false) {
                                                addToCart(selectedItem);
                                                closeModal();
                                            }
                                        }}
                                    >
                                        <FaShoppingCart />
                                        {selectedItem.isAvailable === false ? t('menu.out_of_stock', 'MAXSULOT TUGAGAN') : t('menu.add_to_cart', 'SAVATCHAGA QO\'SHISH') + ' +'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
