import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FaTimes, FaMinus, FaPlus, FaTrashAlt, FaArrowLeft, FaCreditCard, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import MapPicker from '../Map/MapPicker';
import Receipt from './Receipt';
import './CartDrawer.css';

const CartDrawer = () => {
    const {
        isCartOpen, setIsCartOpen, cartItems, cartTotal, updateQuantity, removeFromCart,
        clearCart, placeOrder, updateOrderStatus, discount, finalTotal, applyCoupon, appliedCoupon,
        sendVerificationCode, telegramSettings, bonuses, useBonuses, setUseBonuses, bonusToUse, discountAmount,
        userStats, addToCart, deliveryFee, setDeliveryFee, isSurgeActive, surgeMultiplier,
        getRecommendedItems, finalDeliveryFee, claimLoyaltyReward
    } = useCart();

    const getStatusInfo = (level) => {
        const info = {
            'BRONZE': { color: '#cd7f32', label: 'BRONZE', rate: '5%' },
            'SILVER': { color: '#c0c0c0', label: 'SILVER', rate: '7%' },
            'GOLD': { color: '#ffd700', label: 'GOLD', rate: '10%' }
        };
        return info[level] || info['BRONZE'];
    };

    const statusInfo = getStatusInfo(userStats.level);
    const [orderDetails, setOrderDetails] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [step, setStep] = useState('cart'); // 'cart', 'info', 'verification', 'payment'
    const [customerInfo, setCustomerInfo] = useState({ name: '', surname: '', phone: '+998', address: '' });
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'payme', 'click'
    const [generatedCode, setGeneratedCode] = useState('');
    const [userCode, setUserCode] = useState('');
    const [preOrderTime, setPreOrderTime] = useState('ASAP');
    const [resendCountdown, setResendCountdown] = useState(0);

    React.useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    const handleCheckoutClick = () => {
        if (cartItems.length > 0) {
            setStep('info');
        }
    };

    const handleInfoSubmit = (e) => {
        if (e) e.preventDefault();
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);
        sendVerificationCode(customerInfo.phone, code);
        setStep('verification');
        setResendCountdown(60);
    };

    const handleVerificationSubmit = (e) => {
        e.preventDefault();
        if (userCode === generatedCode) {
            setStep('payment');
        } else {
            alert('Xato kod! Qaytadan urinib ko\'ring.');
        }
    };

    const handlePaymentConfirm = (success) => {
        const orderId = Math.floor(100000 + Math.random() * 900000);
        const date = new Date().toLocaleString();
        const customerName = `${customerInfo.name} ${customerInfo.surname}`;

        const newOrder = {
            items: [...cartItems],
            total: finalTotal + finalDeliveryFee,
            orderId,
            date,
            customer: customerName,
            phone: customerInfo.phone,
            address: customerInfo.address,
            preOrderTime,
            status: success ? 'pending' : 'cancelled'
        };

        placeOrder(newOrder);
        setOrderDetails(newOrder);
        setStep('cart');
        clearCart();
    };

    const closeReceipt = () => {
        setOrderDetails(null);
        setIsCartOpen(false);
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const result = applyCoupon(couponCode);
        if (!result.success) {
            alert(result.message);
        }
    };

    const hasBurger = cartItems.some(item => item.category === 'BURGERS');
    const hasComboExtras = cartItems.some(item => item.id === 4 || item.id === 6);

    const makeItCombo = () => {
        // Add Fries and Cola
        const fries = { id: 4, name: 'French Fries', price: '$4.00', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop', category: 'SIDES' };
        const cola = { id: 6, name: 'Coca Cola', price: '$2.50', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop', category: 'DRINKS' };
        addToCart(fries);
        addToCart(cola);
    };

    return (
        <>
            {isCartOpen && (
                <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
                    <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="cart-header">
                            <h2>
                                {step === 'cart' && 'Savatchangiz'}
                                {step === 'info' && 'Maʼlumotlar'}
                                {step === 'verification' && 'Tasdiqlash'}
                                {step === 'payment' && 'Toʻlov'}
                            </h2>
                            <button className="close-cart" onClick={() => setIsCartOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="cart-body">
                            {step === 'cart' && (
                                <>
                                    <div className="loyalty-card-premium" style={{ '--level-color': statusInfo.color }}>
                                        <div className="loyalty-main">
                                            <div className="badge-glow" style={{ backgroundColor: statusInfo.color }}></div>
                                            <div className="level-badge">
                                                <span className="level-icon">🏆</span>
                                                <span className="level-name">{statusInfo.label}</span>
                                            </div>
                                            <div className="loyalty-details">
                                                <h4>Sodiqlik Darajasi</h4>
                                                <p>{statusInfo.rate} Cashback har bir buyurtmadan</p>
                                            </div>
                                        </div>

                                        <div className="stamps-section">
                                            <p className="stamps-title">Burger Maratoni: <span>{userStats.loyaltyStamps || 0}/5</span></p>
                                            <div className="stamps-grid">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={`stamp ${i <= (userStats.loyaltyStamps || 0) ? 'active' : ''}`}>
                                                        🍔
                                                    </div>
                                                ))}
                                            </div>
                                            {userStats.loyaltyStamps >= 5 && (
                                                <button className="claim-reward-btn" onClick={claimLoyaltyReward}>
                                                    SOVG'ANI OLISH 🎁
                                                </button>
                                            )}
                                        </div>

                                        {userStats.level !== 'GOLD' && (
                                            <div className="progress-to-next">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${(userStats.totalOrders % 5) * 20}%`,
                                                            backgroundColor: statusInfo.color
                                                        }}
                                                    ></div>
                                                </div>
                                                <span>Keyingi darajaga: {userStats.level === 'BRONZE' ? 5 - userStats.totalOrders : 15 - userStats.totalOrders} TA</span>
                                            </div>
                                        )}
                                    </div>

                                    {isSurgeActive && (
                                        <div className="surge-warning-card">
                                            <div className="surge-icon">⚡</div>
                                            <div className="surge-text">
                                                <h4>Yuqori talab mavjud</h4>
                                                <p>Buyurtmalar juda ko'p! Yetkazib berish vaqti va narxi biroz oshishi mumkin (x{surgeMultiplier}).</p>
                                            </div>
                                        </div>
                                    )}
                                    {cartItems.length === 0 ? (
                                        <div className="empty-cart">
                                            <FaTrashAlt />
                                            <p>Savatchangiz hozircha bo'sh</p>
                                            <button className="empty-close-btn" onClick={() => setIsCartOpen(false)}>
                                                CHIQISH
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="cart-items-list">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="cart-item">
                                                    <div className="item-img">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                    <div className="item-details">
                                                        <h4>{item.name}</h4>
                                                        <div className="drawer-item-price-group">
                                                            {item.originalPrice && (
                                                                <span className="drawer-item-original-price">{item.originalPrice}</span>
                                                            )}
                                                            <p className="item-price">{item.price}</p>
                                                        </div>
                                                        <div className="quantity-controls">
                                                            <button onClick={() => updateQuantity(item.id, -1)}><FaMinus /></button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)}><FaPlus /></button>
                                                        </div>
                                                    </div>
                                                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            ))}

                                            {hasBurger && !hasComboExtras && (
                                                <div className="combo-suggest-card">
                                                    <div className="combo-info">
                                                        <span className="combo-badge">COMBO SAVDO ⚡</span>
                                                        <p>Burgeringizga <b>Fri + Ichimlik</b> qo'shamizmi? Atigi <b>$5.00</b> qo'shimcha!</p>
                                                    </div>
                                                    <button className="add-combo-btn" onClick={makeItCombo}>Qo'shish</button>
                                                </div>
                                            )}

                                            <form className="coupon-form" onSubmit={handleApplyCoupon}>
                                                <input
                                                    type="text"
                                                    placeholder="Promokod"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                />
                                                <button type="submit">OK</button>
                                            </form>
                                            {appliedCoupon && (
                                                <p className="applied-coupon-text">Promokod qo'llanildi: <strong>{appliedCoupon} (-{discount}%)</strong></p>
                                            )}
                                            {useBonuses && bonuses > 0 && (
                                                <div className="bonus-usage">
                                                    <label className="bonus-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={useBonuses}
                                                            onChange={(e) => setUseBonuses(e.target.checked)}
                                                        />
                                                        <span className="bonus-text"> Bonusdan foydalanish ($ {bonuses.toFixed(2)} bor)</span>
                                                    </label>
                                                </div>
                                            )}

                                            {/* Upselling Section */}
                                            <div className="upsell-section">
                                                <h4>O'zi bilan yana nima olamiz? 😋</h4>
                                                <div className="upsell-items">
                                                    {getRecommendedItems(cartItems).map(item => (
                                                        <div key={item.id} className="upsell-item" onClick={() => addToCart(item)}>
                                                            <img src={item.image} alt={item.name} />
                                                            <span>{item.name}</span>
                                                        </div>
                                                    ))}
                                                    {/* Fallback if all categories present */}
                                                    {getRecommendedItems(cartItems).length === 0 && (
                                                        <>
                                                            <div className="upsell-item" onClick={() => addToCart({ id: 5, name: 'Onion Rings', price: '$5.50', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop', category: 'SIDES' })}>
                                                                <img src="https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop" alt="Onion Rings" />
                                                                <span>Onion Rings</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {step === 'info' && (
                                <form className="checkout-form" onSubmit={handleInfoSubmit}>
                                    <button type="button" className="back-to-cart" onClick={() => setStep('cart')}>
                                        <FaArrowLeft /> Savatga qaytish
                                    </button>
                                    <div className="form-group">
                                        <label>Ism</label>
                                        <input
                                            type="text"
                                            placeholder="Ismingizni kiriting"
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Familiya</label>
                                        <input
                                            type="text"
                                            placeholder="Familiyangizni kiriting"
                                            value={customerInfo.surname}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, surname: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Telefon raqam</label>
                                        <input
                                            type="tel"
                                            placeholder="+998 -- --- -- --"
                                            value={customerInfo.phone}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Faqat +998 bilan boshlanishi va jami 13 ta belgi bo'lishini ta'minlash
                                                if (val.startsWith('+998')) {
                                                    const digitsOnly = val.substring(4).replace(/\D/g, '');
                                                    if (digitsOnly.length <= 9) {
                                                        setCustomerInfo({ ...customerInfo, phone: '+998' + digitsOnly });
                                                    }
                                                } else if (val.length < 4) {
                                                    setCustomerInfo({ ...customerInfo, phone: '+998' });
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Manzil (yoki xaritadan tanlang)</label>
                                        <div className="address-input-wrapper">
                                            <input
                                                type="text"
                                                placeholder="Yetkazib berish manzili"
                                                value={customerInfo.address}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                                required
                                            />
                                            <button type="button" className="map-btn" onClick={() => setIsMapOpen(true)}>XARITA</button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Yetkazib berish vaqti</label>
                                        <select
                                            className="preorder-select"
                                            value={preOrderTime}
                                            onChange={(e) => setPreOrderTime(e.target.value)}
                                        >
                                            <option value="ASAP">Iloji boricha tezroq (30-45 daqiqa)</option>
                                            <option value="18:00">18:00 gacha</option>
                                            <option value="19:00">19:00 gacha</option>
                                            <option value="20:00">20:00 gacha</option>
                                            <option value="21:00">21:00 gacha</option>
                                            <option value="22:00">22:00 gacha</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="confirm-btn">SMS KOD YUBORISH</button>
                                </form>
                            )}

                            {step === 'verification' && (
                                <div className="verification-step">
                                    <button type="button" className="back-to-cart" onClick={() => setStep('info')}>
                                        <FaArrowLeft /> Maʼlumotlarga qaytish
                                    </button>
                                    <div className="verification-info">
                                        <p>Biz sizning {customerInfo.phone} raqamingizga kod yubordik.</p>
                                        <div className="bot-link-box">
                                            <p>Agar SMS kelmasa, botimizdan oling:</p>
                                            <a
                                                href={`https://t.me/${telegramSettings.botUsername}?start=verify`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bot-link-btn"
                                            >
                                                BOTGA KIRISH
                                            </a>
                                        </div>
                                    </div>
                                    <form onSubmit={handleVerificationSubmit}>
                                        <div className="form-group">
                                            <label>Kodni kiriting</label>
                                            <input
                                                type="text"
                                                maxLength="4"
                                                placeholder="0000"
                                                value={userCode}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setUserCode(val);
                                                }}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="confirm-btn">TASDIQLASH</button>
                                    </form>
                                    <button
                                        className="resend-code"
                                        onClick={handleInfoSubmit}
                                        disabled={resendCountdown > 0}
                                    >
                                        {resendCountdown > 0 ? `KODNI QAYTA YUBORISH (${resendCountdown}s)` : 'KODNI QAYTA YUBORISH'}
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="payment-step">
                                    <div className="payment-methods">
                                        <h3>Toʻlov usulini tanlang</h3>
                                        <div
                                            className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            <FaCreditCard />
                                            <span>Naqd / Terminal</span>
                                        </div>
                                        <div
                                            className={`payment-card ${paymentMethod === 'payme' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('payme')}
                                        >
                                            <div className="pay-logo payme">Payme</div>
                                            <span>Payme orqali</span>
                                        </div>
                                        <div
                                            className={`payment-card ${paymentMethod === 'click' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('click')}
                                        >
                                            <div className="pay-logo click">CLICK</div>
                                            <span>Click orqali</span>
                                        </div>
                                    </div>
                                    <div className="payment-actions">
                                        <p>Pul oʻtkazilganini tasdiqlaysizmi?</p>
                                        <button className="pay-confirm-btn" onClick={() => handlePaymentConfirm(true)}>
                                            HA, TOʻLOV QILDIM
                                        </button>
                                        <button className="pay-cancel-btn" onClick={() => handlePaymentConfirm(false)}>
                                            YOʻQ, BEKOR QILISH
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {step === 'cart' && cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div className="summary-details">
                                    <div className="total-row">
                                        <span>Subtotal:</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="total-row discount">
                                            <span>Chegirma:</span>
                                            <span>-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {useBonuses && bonusToUse > 0 && (
                                        <div className="total-row bonus">
                                            <span>Bonus:</span>
                                            <span>-${bonusToUse.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="total-row delivery">
                                        <span>Yetkazib berish {isSurgeActive && <span className="surge-small">⚡ SURGE</span>}:</span>
                                        <span>{finalDeliveryFee === 0 ? 'BEPUL' : `$${finalDeliveryFee.toFixed(2)}`}</span>
                                    </div>
                                    <div className="total-row grand-total">
                                        <span>Jami summasi:</span>
                                        <span>${(finalTotal + finalDeliveryFee).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="checkout-btn" onClick={handleCheckoutClick}>
                                    BUYURTMA BERISH
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {orderDetails && (
                <Receipt
                    items={orderDetails.items}
                    total={orderDetails.total - 5}
                    orderId={orderDetails.orderId}
                    date={orderDetails.date}
                    customer={orderDetails.customer}
                    onClose={closeReceipt}
                    deliveryFee={deliveryFee}
                />
            )}

            {isMapOpen && (
                <MapPicker
                    onSelect={(addr, fee) => {
                        setCustomerInfo({ ...customerInfo, address: addr });
                        setDeliveryFee(fee);
                    }}
                    onClose={() => setIsMapOpen(false)}
                />
            )}
        </>
    );
};

export default CartDrawer;
