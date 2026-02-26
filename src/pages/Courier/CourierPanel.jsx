import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FaBox, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaUserAlt, FaMotorcycle, FaListUl } from 'react-icons/fa';
import './CourierPanel.css';

const CourierPanel = () => {
    const { orders, updateOrderStatus } = useCart();
    const courierOrders = orders.filter(o => o.status === 'shipping');
    const availableOrders = orders.filter(o => o.status === 'preparing' || o.status === 'completed'); // Actually in reality preparing/ready

    const [activeTab, setActiveTab] = useState('my-orders');

    const handleDeliveryComplete = (orderId) => {
        updateOrderStatus(orderId, 'completed');
        alert('Buyurtma muvaffaqiyatli yetkazildi! ✅');
    };

    return (
        <div className="courier-panel">
            <div className="courier-header">
                <div className="c-user">
                    <FaMotorcycle className="c-icon" />
                    <div>
                        <h2>Kuryer Paneli</h2>
                        <span className="online-badge">Online</span>
                    </div>
                </div>
            </div>

            <div className="courier-tabs">
                <button
                    className={activeTab === 'my-orders' ? 'active' : ''}
                    onClick={() => setActiveTab('my-orders')}
                >
                    <FaBox /> Mening buyurtmalarim ({courierOrders.length})
                </button>
                <button
                    className={activeTab === 'available' ? 'active' : ''}
                    onClick={() => setActiveTab('available')}
                >
                    <FaListUl /> Mavjud buyurtmalar
                </button>
            </div>

            <div className="courier-content">
                {activeTab === 'my-orders' && (
                    <div className="order-cards">
                        {courierOrders.length === 0 ? (
                            <div className="empty-state">
                                <p>Sizda hozircha yetkazilayotgan buyurtmalar yo'q.</p>
                            </div>
                        ) : (
                            courierOrders.map(order => (
                                <div key={order.orderId} className="courier-order-card">
                                    <div className="order-header">
                                        <span className="order-id">#{order.orderId}</span>
                                        <span className="order-time">{order.date.split(',')[1]}</span>
                                    </div>
                                    <div className="customer-info">
                                        <div className="info-row">
                                            <FaUserAlt /> <strong>{order.customer}</strong>
                                        </div>
                                        <div className="info-row">
                                            <FaPhoneAlt /> <a href={`tel:${order.phone}`}>{order.phone}</a>
                                        </div>
                                        <div className="info-row">
                                            <FaMapMarkerAlt /> <span>{order.address}</span>
                                        </div>
                                    </div>
                                    <div className="order-footer">
                                        <button className="done-btn" onClick={() => handleDeliveryComplete(order.orderId)}>
                                            <FaCheckCircle /> YETKAZDIM
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'available' && (
                    <div className="empty-state">
                        <p>Hozircha yangi buyurtmalar mavjud emas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourierPanel;
