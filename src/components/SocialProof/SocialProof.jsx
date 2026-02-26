import React, { useState, useEffect } from 'react';
import { FaFire, FaStar, FaShoppingBag } from 'react-icons/fa';
import './SocialProof.css';

const SocialProof = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const names = ['Ali', 'Sardor', 'Malika', 'Jasur', 'Madina', 'Bobur', 'Zilola', 'Temur', 'Shaxzod', 'Dilnoza'];
    const products = ['Black Star Special', 'Cheese Burger', 'Bacon Burger', 'Ultimate Mega Combo', 'Chicken Wings'];
    const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Namangan', 'Farg\'ona'];

    const generateNotification = () => {
        const type = Math.random() > 0.3 ? 'purchase' : 'review';
        const name = names[Math.floor(Math.random() * names.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];

        if (type === 'purchase') {
            return {
                id: Date.now(),
                icon: <FaShoppingBag />,
                title: 'Yangi xarid!',
                text: `${name} (${city}) hozirgina ${product} buyurtma berdi!`,
                color: '#e30034'
            };
        } else {
            return {
                id: Date.now(),
                icon: <FaStar />,
                title: 'Ajoyib fikr!',
                text: `${name} ${product} uchun 5 yulduzli sharh qoldirdi!`,
                color: '#f1c40f'
            };
        }
    };

    useEffect(() => {
        const showNext = () => {
            // Wait for 5-10 seconds before showing
            const delay = 5000 + Math.random() * 5000;

            setTimeout(() => {
                setNotification(generateNotification());
                setIsVisible(true);

                // Hide after 5 seconds
                setTimeout(() => {
                    setIsVisible(false);
                    // Cycle again
                    showNext();
                }, 5000);
            }, delay);
        };

        showNext();
    }, []);

    if (!notification) return null;

    return (
        <div className={`social-proof-toast ${isVisible ? 'show' : ''}`} style={{ borderLeftColor: notification.color }}>
            <div className="sp-icon" style={{ color: notification.color }}>
                {notification.icon}
            </div>
            <div className="sp-content">
                <p className="sp-title">{notification.title}</p>
                <p className="sp-text">{notification.text}</p>
                <span className="sp-time">Hozirgina</span>
            </div>
        </div>
    );
};

export default SocialProof;
