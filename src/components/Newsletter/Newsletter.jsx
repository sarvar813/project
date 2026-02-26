import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoSend } from 'react-icons/io5';
import { useToast } from '../../context/ToastContext';
import './Newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setStatus('success');
            toast.success("Muvaffaqiyatli a'zo bo'ldingiz! 🍔");
            setTimeout(() => setStatus(''), 3000);
            setEmail('');
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-glow-top"></div>
            <div className="newsletter-glow-bottom"></div>

            <motion.div
                className="newsletter-container"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="newsletter-content">
                    <h4 className="news-subtitle">Special Offers</h4>
                    <h2 className="news-title">JOIN THE <span>BURGER CLUB</span></h2>
                    <p className="news-desc">
                        Eng so'nggi yangiliklar va haftalik <span>30% chegirmalar</span> haqida birinchilardan bo'lib xabardor bo'ling!
                    </p>

                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email manzilingiz..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="neon-btn">
                                {status === 'success' ? 'Yuborildi!' : 'A\'ZO BO\'LISH +'}
                                <IoSend className="btn-icon" />
                            </button>
                        </div>
                    </form>

                    <div className="neon-burger-icon">🍔</div>
                </div>
            </motion.div>
        </section>
    );
};

export default Newsletter;
