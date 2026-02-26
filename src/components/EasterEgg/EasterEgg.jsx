import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBurger } from 'react-icons/fa6';
import { launchConfetti } from '../../utils/confetti';
import './EasterEgg.css';

const EasterEgg = () => {
    const [clicks, setClicks] = useState(0);
    const [found, setFound] = useState(false);

    const handleClick = () => {
        if (found) return;
        const newClicks = clicks + 1;
        setClicks(newClicks);

        if (newClicks >= 5) {
            setFound(true);
            launchConfetti();
        }
    };

    return (
        <>
            <div
                className={`hidden-burger ${found ? 'found' : ''}`}
                onClick={handleClick}
                title={found ? "Siz topdingiz!" : "Bu nima ekan?"}
            >
                <FaBurger />
            </div>

            <AnimatePresence>
                {found && (
                    <motion.div
                        className="promo-popup"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="promo-content">
                            <h3>TABRIKLAYMIZ! 🎉</h3>
                            <p>Yashirin burgerni topganingiz uchun maxsus sovg'a:</p>
                            <div className="promo-code">SECRET15</div>
                            <span>-15% CHEGIRMA</span>
                            <button onClick={() => setFound(false)}>RAHMAT!</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EasterEgg;
