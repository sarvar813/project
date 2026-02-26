import React from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { FaUserCircle, FaHistory, FaMedal, FaCrown, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import WheelOfFortune from '../../components/WheelOfFortune/WheelOfFortune';
import LoyaltyStampCard from '../../components/LoyaltyStampCard/LoyaltyStampCard';
import './Profile.css';

const Profile = () => {
    const { orders, userStats, bonuses, addToCart } = useCart();
    const toast = useToast();
    const [userPhone, setUserPhone] = React.useState(localStorage.getItem('bsb_user_phone') || '');
    const [isLinked, setIsLinked] = React.useState(false);
    const [checking, setChecking] = React.useState(false);

    React.useEffect(() => {
        if (userPhone.length >= 9) {
            checkTelegramLink();
        }
    }, []);

    const checkTelegramLink = async () => {
        if (!userPhone) return;
        setChecking(true);
        try {
            const res = await fetch(`http://localhost:8000/check-phone/${userPhone}`);
            const data = await res.json();
            setIsLinked(data.linked);
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

    const handleSavePhone = () => {
        localStorage.setItem('bsb_user_phone', userPhone);
        checkTelegramLink();
        toast.success("Raqamingiz muvaffaqiyatli saqlandi! ✅");
    };

    const getStatusInfo = (level) => {
        switch (level) {
            case 'GOLD': return { label: 'GOLD', color: '#f1c40f', icon: <FaCrown /> };
            case 'SILVER': return { label: 'SILVER', color: '#bdc3c7', icon: <FaMedal /> };
            default: return { label: 'BRONZE', color: '#cd7f32', icon: <FaMedal /> };
        }
    };

    const statusInfo = getStatusInfo(userStats.level);
    const nextLevelOrders = userStats.level === 'BRONZE' ? 5 : 15;
    const progress = Math.min(100, (userStats.totalOrders / nextLevelOrders) * 100);

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="user-info-card">
                        <div className="user-avatar">
                            <FaUserCircle />
                        </div>
                        <h3>Xush kelibsiz!</h3>
                        <p className="user-bonus">Sizning bonuslaringiz: <span>${bonuses.toFixed(2)}</span></p>

                        <div className="phone-link-mini">
                            <input
                                type="tel"
                                placeholder="+998901234567"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                            />
                            <button onClick={handleSavePhone}>Saqlash</button>
                        </div>
                    </div>

                    <LoyaltyStampCard />

                    <div className="loyalty-card" style={{ borderTop: `5px solid ${statusInfo.color}`, marginTop: '20px' }}>
                        <div className="loyalty-header">
                            <span className="level-icon" style={{ color: statusInfo.color }}>{statusInfo.icon}</span>
                            <h4>{statusInfo.label} STATUS</h4>
                        </div>
                        <div className="loyalty-progress-container">
                            <div className="progress-text">
                                <span>Daraja ko'rsatkichi</span>
                                <span>{userStats.totalOrders} / {nextLevelOrders}</span>
                            </div>
                            <div className="loyalty-progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: statusInfo.color }}></div>
                            </div>
                            {userStats.level !== 'GOLD' && (
                                <p className="next-level-hint">
                                    Yana {nextLevelOrders - userStats.totalOrders} ta buyurtma keyingi daraja uchun
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="vip-card-wrapper">
                        <div className="vip-card">
                            <div className={`card-face card-front ${userStats.level.toLowerCase()}`}>
                                <div className="card-logo">BLACK STAR VIP</div>
                                <div className="card-number">**** **** **** 2024</div>
                                <div className="card-owner">
                                    <div>
                                        <small>MEMBERSHIP</small>
                                        <p>{userStats.level}</p>
                                    </div>
                                    <div className="qr-mock">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BSB-VIP" alt="QR" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="card-face card-back">
                                <div className="card-logo" style={{ color: '#fff' }}>BSB PREMIUM ACCESS</div>
                            </div>
                        </div>
                    </div>

                    <div className={`telegram-link-card ${isLinked ? 'verified' : ''}`}>
                        <div className="tg-header">
                            <span className="tg-icon">{isLinked ? <FaCheckCircle /> : '✈️'}</span>
                            <h4>{isLinked ? 'Telegram Ulangan' : 'Telegram Bot'}</h4>
                        </div>
                        <p>
                            {isLinked
                                ? "Sizning hisobingiz Telegram botimiz bilan muvaffaqiyatli bog'langan! ✅"
                                : "Buyurtma holatini kuzatish uchun botimizni ulashni unutmang!"}
                        </p>
                        {!isLinked && (
                            <a
                                href={`https://t.me/blackstar_burger_bot?start=link`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tg-link-btn"
                            >
                                BOTGA KIRISH
                            </a>
                        )}
                        {isLinked && <span className="linked-badge">ULANGAN</span>}
                    </div>

                    <WheelOfFortune isStatic={true} />
                </div>

                <div className="profile-main">
                    <div className="section-header">
                        <FaHistory />
                        <h2>Buyurtmalar tarixi</h2>
                    </div>

                    <div className="orders-history-list">
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <p>Sizda hali buyurtmalar yo'q. Hozirroq birinchi buyurtmani bering!</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.orderId} className="history-item">
                                    <div className="history-item-header">
                                        <span className="order-id">#{order.orderId}</span>
                                        <span className="order-date">{order.date}</span>
                                        <span className={`order-status ${order.status}`}>
                                            {order.status === 'completed' && <FaCheckCircle />}
                                            {order.status === 'pending' && <FaClock />}
                                            {order.status === 'preparing' && <FaClock />}
                                            {order.status === 'shipping' && <FaClock />}
                                            {order.status === 'cancelled' && <FaTimesCircle />}
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                                        <div className="order-stepper">
                                            <div className={`step ${['pending', 'preparing', 'shipping'].includes(order.status) ? 'completed' : ''} ${order.status === 'pending' ? 'active' : ''}`}>
                                                <div className="step-icon"><FaCheckCircle /></div>
                                                <span className="step-label">Qabul qilindi</span>
                                            </div>
                                            <div className={`step ${['preparing', 'shipping'].includes(order.status) ? 'completed' : ''} ${order.status === 'preparing' ? 'active' : ''}`}>
                                                <div className="step-icon">🍳</div>
                                                <span className="step-label">Tayyorlik</span>
                                            </div>
                                            <div className={`step ${['shipping'].includes(order.status) ? 'completed' : ''} ${order.status === 'shipping' ? 'active' : ''}`}>
                                                <div className="step-icon">🚚</div>
                                                <span className="step-label">Yo'lda</span>
                                            </div>
                                            <div className={`step ${order.status === 'completed' ? 'completed' : ''}`}>
                                                <div className="step-icon">🏠</div>
                                                <span className="step-label">Yetkazildi</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="history-item-body">
                                        <div className="history-item-products">
                                            {order.items.map((item, idx) => (
                                                <span key={idx}>{item.name} x{item.quantity}</span>
                                            ))}
                                        </div>
                                        <div className="history-item-total">
                                            Jami: <strong>${order.total.toFixed(2)}</strong>
                                            <button
                                                className="reorder-btn"
                                                onClick={() => {
                                                    order.items.forEach(item => addToCart(item));
                                                    alert("Mahsulotlar savatchaga qo'shildi!");
                                                }}
                                            >
                                                Qayta buyurtma
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
