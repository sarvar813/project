import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPrint, FaCheckCircle, FaTimes, FaShippingFast, FaClock, FaCheckDouble, FaBan, FaUtensils, FaClipboardList, FaMotorcycle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Receipt.css';

const Receipt = ({ items, total, orderId, date, customer, onClose, deliveryFee }) => {
    const navigate = useNavigate();
    const { orders } = useCart();

    // Admin tomonidan o'zgartiriladigan statusni real vaqtda olish uchun
    const currentOrder = orders.find(o => String(o.orderId) === String(orderId));
    const status = currentOrder ? currentOrder.status : 'pending';

    const liveMapRef = React.useRef(null);
    const courierMarker = React.useRef(null);

    React.useEffect(() => {
        if (status === 'shipping' && liveMapRef.current && !liveMapRef.current._leaflet_id) {
            const restaurantPos = [41.311081, 69.240562];
            const customerPos = [41.320000, 69.250000]; // Mock customer pos since we don't have real latlng

            const map = window.L.map(liveMapRef.current).setView(restaurantPos, 14);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const scooterIcon = window.L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#e30034; color:white; padding:8px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 5px 15px rgba(227,0,52,0.4)'><i class='fas fa-motorcycle'></i></div>",
                iconSize: [35, 35],
                iconAnchor: [17, 35]
            });

            courierMarker.current = window.L.marker(restaurantPos, { icon: scooterIcon }).addTo(map);

            // Marker for customer
            window.L.marker(customerPos).addTo(map).bindPopup('Sizning manzilingiz').openPopup();

            // Simple animation
            let progress = 0;
            const animate = () => {
                if (progress >= 1) return;
                progress += 0.001;
                const nextLat = restaurantPos[0] + (customerPos[0] - restaurantPos[0]) * progress;
                const nextLng = restaurantPos[1] + (customerPos[1] - restaurantPos[1]) * progress;
                courierMarker.current.setLatLng([nextLat, nextLng]);
                requestAnimationFrame(animate);
            };
            animate();
        }
    }, [status]);

    const statusConfig = {
        pending: {
            label: 'Kutilmoqda',
            icon: <FaClock />,
            color: '#ffab00',
            step: 1,
            kitchenMsg: 'Buyurtmangiz navbatda turibdi... 🧾'
        },
        preparing: {
            label: 'Tayyorlanmoqda',
            icon: <FaUtensils />,
            color: '#ff5722',
            step: 2,
            kitchenMsg: 'Shef-pazarlar go\'shtni olovda pishirishmoqda! 🔥🥩'
        },
        shipping: {
            label: 'Yetkazilmoqda',
            icon: <FaShippingFast />,
            color: '#2196f3',
            step: 3,
            kitchenMsg: 'Kuryer issiqqina ovqatingizni olib yo\'lga chiqdi! 🛵💨'
        },
        completed: {
            label: 'Bajarildi',
            icon: <FaCheckDouble />,
            color: '#4caf50',
            step: 4,
            kitchenMsg: 'Yoqimli ishtaha! Bizni tanlaganingiz uchun rahmat! 😋🍔'
        },
        cancelled: {
            label: 'Bekor qilindi',
            icon: <FaBan />,
            color: '#f44336',
            step: 0,
            kitchenMsg: 'Afsuski, buyurtma bekor qilindi. ❌'
        }
    };

    const currentStatus = statusConfig[status] || statusConfig.pending;
    const activeStep = currentStatus.step;

    const handleBackToMenu = () => {
        onClose();
        navigate('/menu');
    };

    return (
        <div className="receipt-overlay" onClick={onClose}>
            <div className="receipt-container" onClick={(e) => e.stopPropagation()}>
                <button className="receipt-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="receipt-header">
                    <div className="receipt-logo">
                        <h1>BLACK STAR <span>BURGER</span></h1>
                    </div>

                    {/* Yangi Order Stepper qismi */}
                    {status !== 'cancelled' ? (
                        <div className="order-stepper">
                            <div className={`order-step ${activeStep >= 1 ? 'active' : ''}`}>
                                <div className="step-circle">
                                    <FaClipboardList />
                                    <div className="step-glow"></div>
                                </div>
                                <span className="step-label">TUSHDI</span>
                            </div>

                            <div className={`step-connector ${activeStep >= 2 ? 'active' : ''}`}></div>

                            <div className={`order-step ${activeStep >= 2 ? 'active' : ''}`}>
                                <div className="step-circle">
                                    <FaUtensils />
                                    <div className="step-glow"></div>
                                </div>
                                <span className="step-label">PISHMOQDA</span>
                            </div>

                            <div className={`step-connector ${activeStep >= 3 ? 'active' : ''}`}></div>

                            <div className={`order-step ${activeStep >= 3 ? 'active' : ''}`}>
                                <div className="step-circle">
                                    <FaShippingFast />
                                    <div className="step-glow"></div>
                                </div>
                                <span className="step-label">YO'LDA</span>
                            </div>

                            <div className={`step-connector ${activeStep >= 4 ? 'active' : ''}`}></div>

                            <div className={`order-step ${activeStep >= 4 ? 'active' : ''}`}>
                                <div className="step-circle">
                                    <FaCheckDouble />
                                    <div className="step-glow"></div>
                                </div>
                                <span className="step-label">BAJARILDI</span>
                            </div>
                        </div>
                    ) : (
                        <div className="order-cancelled-notice">
                            <div className="cancelled-icon">
                                <FaBan />
                            </div>
                            <h3>BUYURTMA BEKOR QILINDI</h3>
                            <p>Admin tomonidan rad etildi yoki bekor qilindi</p>
                        </div>
                    )}

                    <div className="kitchen-live-status">
                        <div className="live-dot"></div>
                        <p>{currentStatus.kitchenMsg}</p>
                    </div>

                    <div className={`success-badge status-${status}`} style={{ color: currentStatus.color }}>
                        {currentStatus.icon} {currentStatus.label}
                    </div>

                    {status === 'shipping' && (
                        <div className="live-tracking-box">
                            <div className="tracking-header">
                                <FaMotorcycle />
                                <span>Kuryer yo'lda (Jonli kuzatuv)</span>
                            </div>
                            <div ref={liveMapRef} className="live-map-mini"></div>
                        </div>
                    )}
                </div>

                <div className="receipt-status-info">
                    <div className="info-item">
                        <span>Mijoz:</span>
                        <strong>{customer}</strong>
                    </div>
                    <div className="info-item">
                        <span>Buyurtma ID:</span>
                        <strong>#{orderId}</strong>
                    </div>
                    <div className="info-item">
                        <span>Sana:</span>
                        <strong>{date}</strong>
                    </div>
                    {currentOrder?.preOrderTime && currentOrder.preOrderTime !== 'ASAP' && (
                        <div className="info-item" style={{ color: 'var(--primary-color)' }}>
                            <span>Vaqti:</span>
                            <strong>{currentOrder.preOrderTime} gacha</strong>
                        </div>
                    )}
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-items">
                    {items.map((item, index) => (
                        <div key={index} className="receipt-item">
                            <div className="ri-details">
                                <span className="ri-name">{item.name}</span>
                                <span className="ri-qty">x{item.quantity}</span>
                            </div>
                            <div className="ri-price-group">
                                {item.originalPrice && (
                                    <span className="ri-original-price">
                                        ${(parseFloat(item.originalPrice.replace('$', '')) * item.quantity).toFixed(2)}
                                    </span>
                                )}
                                <span className="ri-price">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-summary">
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Yetkazib berish:</span>
                        <span>{deliveryFee === 0 ? 'BEPUL' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="summary-row total">
                        <span>JAMI:</span>
                        <span>${(total + (deliveryFee || 0)).toFixed(2)}</span>
                    </div>
                </div>

                <div className="receipt-footer">
                    <p>Bizni tanlaganingiz uchun rahmat!</p>
                    <div className="receipt-barcode">
                        <div className="barcode-line"></div>
                        <span>* BSB-{orderId} *</span>
                    </div>
                </div>

                <div className="receipt-actions">
                    <button className="action-btn track" onClick={() => {
                        onClose();
                        navigate(`/order-status/${orderId}`);
                    }}>
                        <FaShippingFast /> KUZATISH
                    </button>
                    <button className="action-btn shopping" onClick={handleBackToMenu}>
                        CHIQISH
                    </button>
                    <button className="action-btn print" onClick={() => window.print()}>
                        <FaPrint /> PRINT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
