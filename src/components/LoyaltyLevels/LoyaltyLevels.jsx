import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaGem, FaMedal, FaStar, FaChevronRight, FaCheckCircle, FaLock } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './LoyaltyLevels.css';

const LoyaltyLevels = () => {
    const { userStats } = useCart();
    const currentOrders = userStats?.totalOrders || 0;
    const currentLevel = userStats?.level || 'BRONZE';

    const levels = [
        {
            id: 'BRONZE',
            name: 'BRONZA',
            range: '1-5 buyurtma',
            minOrders: 0,
            cashback: '5%',
            color: '#cd7f32',
            icon: <FaMedal />,
            benefits: ['Standart qo\'llab-quvvatlash', 'Tug\'ilgan kun uchun kupon', 'Bonus ballarni to\'plash']
        },
        {
            id: 'SILVER',
            name: 'KUMUSH',
            range: '5-15 buyurtma',
            minOrders: 5,
            cashback: '7%',
            color: '#c0c0c0',
            icon: <FaStar />,
            benefits: ['Tezkor yetkazib berish', 'Ustuvor yordam xizmati', 'Haftalik maxsus aksiyalar', 'Doimiy keshbek']
        },
        {
            id: 'GOLD',
            name: 'OLTIN',
            range: '15+ buyurtma',
            minOrders: 15,
            cashback: '10%',
            color: '#ffd700',
            icon: <FaCrown />,
            benefits: ['Lahzali yetkazib berish', 'Shaxsiy menejer xizmati', 'Doimiy bepul yetkazib berish', 'Eksklyuziv tadbirlar']
        }
    ];

    const getProgressInfo = (level) => {
        if (currentLevel === level.id) return "Hozirgi darajangiz ✅";
        if (level.minOrders > currentOrders) {
            return `Yana ${level.minOrders - currentOrders} ta buyurtma qoldi`;
        }
        return "Erishilgan daraja ✨";
    };

    return (
        <section className="loyalty-levels-section" id="loyalty">
            <div className="container">
                <div className="loyalty-header">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="loyalty-badge"
                    >
                        VIP PRIVILEGIYALAR
                    </motion.span>
                    <h2 className="section-title">SIZNING <span>DARAFANGIZNI</span> ANIQLANG</h2>
                    <p className="section-desc">Qancha ko'p buyurtma bersangiz, shuncha ko'p imtiyoz va keshbeklarga ega bo'lasiz. Bizning klubimizga qo'shiling!</p>
                </div>

                <div className="levels-grid">
                    {levels.map((level, idx) => {
                        const isActive = currentLevel === level.id;
                        const isLocked = level.minOrders > currentOrders;

                        return (
                            <motion.div
                                key={level.id}
                                className={`level-card ${level.id.toLowerCase()} ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                {isActive && (
                                    <div className="active-tag">HOZIRGI DARAJA</div>
                                )}

                                <div className="level-icon" style={{ color: level.color }}>
                                    {isLocked ? <FaLock className="lock-icon" /> : level.icon}
                                </div>

                                <h3 className="level-name">{level.name}</h3>

                                <div className="level-cashback">
                                    <span className="cb-value" style={{ color: level.color }}>{level.cashback}</span>
                                    <span className="cb-label">KESHBEK</span>
                                </div>

                                <div className="progress-info-line">
                                    {getProgressInfo(level)}
                                </div>

                                <p className="level-range">{level.range}</p>

                                <ul className="level-benefits">
                                    {level.benefits.map((benefit, bIdx) => (
                                        <li key={bIdx} className={isLocked ? 'locked-benefit' : ''}>
                                            <FaCheckCircle className="bullet" style={{ color: isLocked ? '#475569' : level.color }} />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    className="join-btn"
                                    style={{ '--level-color': level.color }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.scrollTo({ top: document.getElementById('menu')?.offsetTop - 100, behavior: 'smooth' })}
                                >
                                    {isActive ? 'DAVOM ETISH' : 'BUYURTMA BERISH'}
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="loyalty-bg-blob"></div>
        </section>
    );
};

export default LoyaltyLevels;
