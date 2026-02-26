import React from 'react';
import { motion } from 'framer-motion';
import { FaHamburger, FaGift, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './LoyaltyStampCard.css';

const LoyaltyStampCard = () => {
    const { userStats, claimLoyaltyReward } = useCart();
    const stamps = userStats.loyaltyStamps || 0;
    const totalSlots = 5;

    return (
        <div className="loyalty-stamp-card">
            <div className="loyalty-stamp-header">
                <h3>DIGITAL <span>LOYALTY</span> CARD</h3>
                <p>Har 5-chi burger mutlaqo tekin!</p>
            </div>

            <div className="stamps-grid">
                {[...Array(totalSlots)].map((_, index) => (
                    <div key={index} className={`stamp-slot ${index < stamps ? 'filled' : ''}`}>
                        {index < stamps ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="stamp-icon"
                            >
                                <FaCheck className="check-badge" />
                                <FaHamburger />
                            </motion.div>
                        ) : (
                            <div className="stamp-placeholder">
                                {index + 1}
                            </div>
                        )}
                    </div>
                ))}
                <div className={`stamp-slot reward-slot ${stamps >= 5 ? 'ready' : ''}`}>
                    <FaGift className="gift-icon" />
                    {stamps >= 5 && <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="reward-glitter"
                    />}
                </div>
            </div>

            <div className="loyalty-stamp-footer">
                {stamps >= 5 ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="claim-reward-btn"
                        onClick={claimLoyaltyReward}
                    >
                        SOVG'ANI OLISH
                    </motion.button>
                ) : (
                    <div className="loyalty-hint">
                        Yana <span>{totalSlots - stamps} ta</span> burger xarid qiling
                    </div>
                )}
                <div className="loyalty-progress-mini">
                    <div className="progress-track">
                        <motion.div
                            className="progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${(stamps / totalSlots) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoyaltyStampCard;
