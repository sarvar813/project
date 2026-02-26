import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, animate } from 'framer-motion';
import { FaHamburger, FaUtensils, FaShippingFast, FaMapMarkerAlt } from 'react-icons/fa';
import './Stats.css';

const Counter = ({ value, duration = 2 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const endValue = parseInt(value.replace(/[^0-9]/g, ''));
            const controls = animate(0, endValue, {
                duration: duration,
                onUpdate(latest) {
                    setDisplayValue(Math.floor(latest));
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{displayValue}{value.includes('+') ? '+' : ''}{value.includes('min') ? ' min' : ''}</span>;
};

const Stats = () => {
    const statsData = [
        {
            icon: <FaHamburger />,
            value: '10000+',
            label: 'Sotilgan Burgerlar',
            color: '#e30034'
        },
        {
            icon: <FaUtensils />,
            value: '50+',
            label: 'Menyu Turlari',
            color: '#ff9d00'
        },
        {
            icon: <FaShippingFast />,
            value: '15min',
            label: 'Tezkor Yetkazib Berish',
            color: '#e30034'
        },
        {
            icon: <FaMapMarkerAlt />,
            value: '12+',
            label: 'Filiallarimiz',
            color: '#ff9d00'
        }
    ];

    return (
        <section className="stats-section">
            <div className="stats-container">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-item"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <h2 className="stat-value">
                            <Counter value={stat.value} />
                        </h2>
                        <p className="stat-label">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
