import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { launchConfetti } from '../../utils/confetti';
import { FaGift, FaTimes, FaRedo } from 'react-icons/fa';
import './WheelOfFortune.css';

const WheelOfFortune = ({ isStatic = false }) => {
    const { setBonuses } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [canSpin, setCanSpin] = useState(true);

    const segments = [
        { label: '5 BONUS', color: '#e30034', type: 'bonus', value: 5 },
        { label: 'YANA BIR BOR', color: '#111', type: 'empty', value: 0 },
        { label: '10% OFF', color: '#f1b417', type: 'coupon', value: 'LUCKY10' },
        { label: '10 BONUS', color: '#e30034', type: 'bonus', value: 10 },
        { label: 'AFSUS...', color: '#111', type: 'empty', value: 0 },
        { label: '20% OFF', color: '#f1b417', type: 'coupon', value: 'LUCKY20' },
        { label: 'FREE FRIES', color: '#e30034', type: 'bonus', value: 4 },
        { label: 'ERTAGA...', color: '#111', type: 'empty', value: 0 },
    ];

    useEffect(() => {
        const checkCooldown = () => {
            const lastSpin = localStorage.getItem('bsb_last_spin');
            if (lastSpin) {
                const lastTime = new Date(lastSpin).getTime();
                const now = new Date().getTime();
                if (now - lastTime < 10 * 1000) { // 10 seconds cooldown
                    setCanSpin(false);
                } else {
                    setCanSpin(true);
                }
            } else {
                setCanSpin(true);
            }
        };

        checkCooldown();
        const interval = setInterval(checkCooldown, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSpin = () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);
        const newRotation = rotation + 1800 + Math.random() * 360; // Min 5 full spins
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const actualRotation = newRotation % 360;
            const segmentAngle = 360 / segments.length;
            const winningIndex = Math.floor((360 - actualRotation) / segmentAngle);
            const prize = segments[winningIndex];

            setResult(prize);
            localStorage.setItem('bsb_last_spin', new Date().toISOString());
            setCanSpin(false);

            if (prize.type !== 'empty') {
                launchConfetti();
                if (prize.type === 'bonus') {
                    // This setBonuses should be additive - handled in context or via state
                    setBonuses(prev => prev + prize.value);
                }
                // If it's a coupon, it can be added to user's coupon list or shown
            }
        }, 4000);
    };

    if (isStatic) {
        return (
            <div className="wheel-static-container">
                <div className="wheel-header">
                    <h4>OMADINGIZNI SINAB KO'RING</h4>
                </div>
                <div className="wheel-container mini">
                    <div className="wheel-pointer"></div>
                    <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                        {segments.map((segment, i) => (
                            <div key={i} className="wheel-segment" style={{ backgroundColor: segment.color, transform: `rotate(${i * (360 / segments.length)}deg) skewY(-50deg)` }}>
                                <span style={{ transform: `skewY(50deg) rotate(22.5deg)` }}>{segment.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="spin-btn mini" onClick={handleSpin} disabled={!canSpin || isSpinning}>
                    {isSpinning ? '...' : canSpin ? 'AYLANTIR' : '10s KUTING'}
                </button>
                {result && (
                    <div className="static-result">
                        <p>{result.type === 'empty' ? 'Afsus...' : `YUTUQ: ${result.label}!`}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <button className="wheel-trigger" onClick={() => setIsOpen(true)}>
                <FaGift className="gift-icon" />
                <span>BONUS!</span>
            </button>

            {isOpen && (
                <div className="wheel-overlay" onClick={() => !isSpinning && setIsOpen(false)}>
                    <div className="wheel-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-wheel" onClick={() => setIsOpen(false)} disabled={isSpinning}>
                            <FaTimes />
                        </button>

                        <div className="wheel-header">
                            <h2>BAXT G'ILDIRAGI</h2>
                            <p>Har 10 sekundda bir marta aylantiring va sovg'alarga ega bo'ling!</p>
                        </div>

                        <div className="wheel-container">
                            <div className="wheel-pointer"></div>
                            <div
                                className="wheel"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            >
                                {segments.map((segment, i) => (
                                    <div
                                        key={i}
                                        className="wheel-segment"
                                        style={{
                                            backgroundColor: segment.color,
                                            transform: `rotate(${i * (360 / segments.length)}deg) skewY(-50deg)`
                                        }}
                                    >
                                        <span style={{ transform: `skewY(50deg) rotate(22.5deg)` }}>
                                            {segment.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="wheel-actions">
                            {!result ? (
                                <button
                                    className="spin-btn"
                                    onClick={handleSpin}
                                    disabled={!canSpin || isSpinning}
                                >
                                    {isSpinning ? 'AYLANYAPTI...' : canSpin ? 'AYLANTIRISH' : 'BUGUNLIK TUGADI'}
                                </button>
                            ) : (
                                <div className="wheel-result">
                                    <h3>{result.type === 'empty' ? 'Afsus...' : 'TABRIKLAYMIZ!'}</h3>
                                    <p>{result.type === 'empty' ? 'Omadingizni ertaga sinab ko\'ring.' : `Siz ${result.label} yutib oldingiz!`}</p>
                                    <button className="close-res-btn" onClick={() => setIsOpen(false)}>DAVOM ETISH</button>
                                </div>
                            )}
                        </div>

                        {!canSpin && !result && (
                            <p className="spin-limit-msg">Muzlatildi. Keyingi aylantirish uchun 10 sekund kuting.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default WheelOfFortune;
