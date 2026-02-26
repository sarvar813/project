import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { FaArrowLeft, FaShoppingCart, FaStar, FaRegClock, FaFireAlt } from 'react-icons/fa';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart, isStoreOpen } = useCart();

    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Maxsulot topilmadi</h2>
                <button onClick={() => navigate('/')}>Bosh sahifaga qaytish</button>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Bosh sahifaga qaytish
                </button>

                <div className="product-detail-flex">
                    <div className="product-detail-left">
                        <div className="detail-image-card">
                            <img src={product.image} alt={product.name} />
                            {product.isAvailable === false && <div className="detail-out-badge">TUGAGAN</div>}
                        </div>
                    </div>

                    <div className="product-detail-right">
                        <div className="detail-content">
                            <span className="detail-cat">{product.category}</span>
                            <h1 className="detail-title">{product.name}</h1>

                            <div className="detail-meta">
                                <div className="meta-item">
                                    <FaStar className="star-icon" />
                                    <span>{product.rating?.toFixed(1) || '5.0'} Reating</span>
                                </div>
                                <div className="meta-item">
                                    <FaRegClock />
                                    <span>15-20 min</span>
                                </div>
                                <div className="meta-item">
                                    <FaFireAlt />
                                    <span>450 kcal</span>
                                </div>
                            </div>

                            <p className="detail-desc">{product.description}</p>

                            <div className="detail-ingredients">
                                <h3>Tarkibi:</h3>
                                <ul>
                                    {product.ingredients?.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-footer">
                                <div className="detail-price-box">
                                    <span className="price-label">Narxi:</span>
                                    <span className="detail-price">{product.price}</span>
                                </div>

                                <button
                                    className="detail-add-btn"
                                    disabled={!isStoreOpen || product.isAvailable === false}
                                    onClick={() => addToCart(product)}
                                >
                                    <FaShoppingCart />
                                    {product.isAvailable === false ? 'MAXSULOT TUGAGAN' : 'SAVATCHAGA QO\'SHISH +'}
                                </button>
                            </div>

                            {!isStoreOpen && (
                                <p className="store-closed-msg">Hozirda do'kon yopiq, buyurtma berib bo'lmaydi.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="product-reviews-section">
                    <div className="section-header">
                        <h2>Mijozlarimiz fikri 💬</h2>
                        <div className="overall-rating">
                            <FaStar /> {product.rating?.toFixed(1) || '5.0'} / 5.0
                        </div>
                    </div>

                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-user">
                                <img src="https://i.pravatar.cc/150?u=ali" alt="Ali" />
                                <div>
                                    <h5>Ali Valiyev</h5>
                                    <div className="review-stars">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                </div>
                            </div>
                            <p>"Dunyodagi eng mazali burger! Go'shti nihoyatda suvli va yangi ekan."</p>
                            <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop" alt="Burger" className="review-img" />
                        </div>

                        <div className="review-card">
                            <div className="review-user">
                                <img src="https://i.pravatar.cc/150?u=kamola" alt="Kamola" />
                                <div>
                                    <h5>Kamola Orifova</h5>
                                    <div className="review-stars">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                </div>
                            </div>
                            <p>"Yetkazib berish juda tez bo'ldi. Paketlash ham a'lo darajada!"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
