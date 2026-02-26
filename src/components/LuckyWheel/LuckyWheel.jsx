import React, { useState, useEffect } from 'react';
import { FaCrown, FaGift } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './LuckyWheel.css';

const LuckyWheel = () => {
    const { setBonuses } = useCart();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [lastSpinDate, setLastSpinDate] = useState(localStorage.getItem('bsb_last_spin'));
    const [showPrize, setShowPrize] = useState(null);

    const prizes = [
        { label: '$0.50 BONUS', value: 0.5, color: '#f1c40f' },
        { label: 'YANA BIR BOR', value: 0, color: '#e30034' },
        { label: '$1.00 BONUS', value: 1.0, color: '#2ecc71' },
        { label: 'YUTUQ YO\'Q', value: 0, color: '#3498db' },
        { label: '$2.00 BONUS', value: 2.0, color: '#9b59b6' },
        { label: '$0.25 BONUS', value: 0.25, color: '#e67e22' }
    ];

    const canSpin = !lastSpinDate || new Date().toLocaleDateString() !== lastSpinDate;

    const spin = () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);
        const spinRounds = 5 + Math.floor(Math.random() * 5);
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const extraDegrees = (360 / prizes.length) * prizeIndex;
        const totalDegrees = rotation + (spinRounds * 360) + extraDegrees;

        setRotation(totalDegrees);

        setTimeout(() => {
            const wonPrize = prizes[(prizes.length - (Math.floor(extraDegrees / (360 / prizes.length)) % prizes.length)) % prizes.length];
            if (wonPrize.value > 0) {
                setBonuses(prev => prev + wonPrize.value);
            }
            setShowPrize(wonPrize);
            setIsSpinning(false);
            const today = new Date().toLocaleDateString();
            localStorage.setItem('bsb_last_spin', today);
            setLastSpinDate(today);
        }, 5000);
    };

    return (
        <div className="lucky-wheel-container">
            <div className="wheel-header">
                <FaCrown />
                <h3>OMAD G'ILDIRAGI</h3>
                <p>Har kuni bir marta aylantiring va bonuslar yutib oling!</p>
            </div>

            <div className={`wheel-box ${isSpinning ? 'spinning' : ''}`}>
                <div className="wheel-pointer"></div>
                <div
                    className="wheel"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {prizes.map((p, i) => (
                        <div
                            key={i}
                            className="wheel-sector"
                            style={{
                                '--i': i,
                                '--color': p.color,
                                transform: `rotate(${(360 / prizes.length) * i}deg) skewY(${(360 / prizes.length) - 90}deg)`
                            }}
                        >
                            <span className="sector-text">{p.label}</span>
                        </div>
                    ))}
                </div>
                <button
                    className="spin-btn"
                    onClick={spin}
                    disabled={!canSpin || isSpinning}
                >
                    {isSpinning ? '...' : (canSpin ? 'SPIN' : 'ERTAGA')}
                </button>
            </div>

            {showPrize && (
                <div className="prize-modal-overlay" onClick={() => setShowPrize(null)}>
                    <div className="prize-modal" onClick={e => e.stopPropagation()}>
                        <FaGift className="gift-icon" />
                        <h2>TABRIKLAYMIZ!</h2>
                        <p>{showPrize.label} yutib oldingiz!</p>
                        <button onClick={() => setShowPrize(null)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LuckyWheel;
