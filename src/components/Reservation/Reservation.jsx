import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUsers, FaUser, FaPhoneAlt, FaCommentAlt, FaCheckCircle } from 'react-icons/fa';
import './Reservation.css';

const Reservation = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '+998',
        guests: 2,
        date: '',
        time: '',
        comment: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('http://127.0.0.1:8000/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', phone: '+998', guests: 2, date: '', time: '', comment: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            setStatus('error');
        }
    };

    return (
        <section className="reservation-section" id="booking">
            <div className="reservation-container">
                <motion.div
                    className="reservation-info-box"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="res-subtitle">STOL BAND QILISH</span>
                    <h2 className="res-title">Maxsus oqshomingizni biz bilan rejalashtiring</h2>
                    <p className="res-description">
                        Oila a'zolaringiz yoki do'stlaringiz bilan shinam muhitda Black Star Burger lazzatidan bahramand bo'ling.
                        Oldindan stol band qiling va navbat kutishni unuting.
                    </p>

                    <div className="res-features">
                        <div className="res-feature">
                            <div className="res-icon"><FaCheckCircle /></div>
                            <span>Bepul band qilish</span>
                        </div>
                        <div className="res-feature">
                            <div className="res-icon"><FaCheckCircle /></div>
                            <span>VIP zonalar mavjud</span>
                        </div>
                        <div className="res-feature">
                            <div className="res-icon"><FaCheckCircle /></div>
                            <span>Bayramlar uchun maxsus bezaklar</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="reservation-form-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {status === 'success' ? (
                        <div className="res-success-msg">
                            <div className="success-icon">✨</div>
                            <h3>Rahmat!</h3>
                            <p>Sizning so'rovingiz qabul qilindi. Tez orada adminlarimiz siz bilan bog'lanishadi.</p>
                            <button onClick={() => setStatus('idle')} className="res-back-btn">YANGI BAND QILISH</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="res-form-grid">
                                <div className="res-input-group">
                                    <label><FaUser /> Ismingiz</label>
                                    <input
                                        type="text"
                                        placeholder="Ismingizni kiriting"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="res-input-group">
                                    <label><FaPhoneAlt /> Telefon raqam</label>
                                    <input
                                        type="tel"
                                        placeholder="+998 -- --- -- --"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="res-input-group">
                                    <label><FaUsers /> Mehmonlar soni</label>
                                    <select
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(num => (
                                            <option key={num} value={num}>{num} kishi</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="res-input-group">
                                    <label><FaCalendarAlt /> Sana</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="res-input-group">
                                    <label><FaClock /> Vaqt</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                                <div className="res-input-group full">
                                    <label><FaCommentAlt /> Qo'shimcha izoh</label>
                                    <textarea
                                        placeholder="Maxsus talablaringiz bo'lsa kiriting..."
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="reservation-btn" disabled={status === 'loading'}>
                                {status === 'loading' ? 'YUBORILMOQDA...' : 'BAND QILISHNI TASDIQLASH'}
                            </button>
                            {status === 'error' && <p className="res-error-text">Xatolik yuz berdi. Qayta urinib ko'ring.</p>}
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Reservation;
