import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTie, FaMotorcycle, FaUtensils, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Careers.css';

const Careers = () => {
    const { submitCareerApplication } = useCart();
    const [selectedJob, setSelectedJob] = useState(null);
    const [formSent, setFormSent] = useState(false);

    const jobs = [
        { id: 1, title: 'Shef-povar', icon: <FaUtensils />, salary: '$800 - $1200', desc: 'Yevropa va Milliy taomlarni tayyorlash tajribasiga ega bo\'lishingiz lozim.' },
        { id: 2, title: 'Kuryer', icon: <FaMotorcycle />, salary: '$400 - $700', desc: 'Shaxsiy transport (skuter/mashina) va xushmuomalalik talab etiladi.' },
        { id: 3, title: 'Menejer', icon: <FaUserTie />, salary: '$1000+', desc: 'Jamoani boshqarish va mijozlar bilan ishlash tajribasi kerak.' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = {
            name: formData.get('userName'),
            phone: formData.get('userPhone'),
            resume: formData.get('userResume'),
            jobTitle: selectedJob.title
        };

        submitCareerApplication(appData);
        setFormSent(true);
        setTimeout(() => {
            setFormSent(false);
            setSelectedJob(null);
        }, 3000);
    };

    return (
        <section className="careers-section" id="careers">
            <div className="careers-overlay"></div>
            <div className="careers-container">
                <div className="careers-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        BIZNING <span>JAMOA</span>GA QO'SHILING!
                    </motion.h2>
                    <p>O'z ustingizda ishlashni xohlaysizmi? Black Star Burger jamoasi sizni kutmoqda!</p>
                </div>

                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
                            whileHover={{ y: -10 }}
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className="job-icon">{job.icon}</div>
                            <h3>{job.title}</h3>
                            <span className="salary">{job.salary}</span>
                            <p>{job.desc}</p>
                            <button className="apply-btn">ANKETA TO'LDIRISH +</button>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedJob && (
                        <motion.div
                            className="career-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedJob(null)}
                        >
                            <motion.div
                                className="career-modal"
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 50 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button className="close-modal" onClick={() => setSelectedJob(null)}>&times;</button>

                                {formSent ? (
                                    <div className="success-message">
                                        <FaCheckCircle />
                                        <h3>Anketangiz qabul qilindi!</h3>
                                        <p>Tez orada menejerlarimiz siz bilan bog'lanishadi.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h3><span>{selectedJob.title}</span> uchun ariza</h3>
                                        <form className="career-form" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>To'liq ismingiz</label>
                                                <input name="userName" type="text" placeholder="Masalan: Aziz Aliev" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Telefon raqamingiz</label>
                                                <input name="userPhone" type="tel" placeholder="+998" defaultValue="+998" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Tajribangiz (Resume)</label>
                                                <textarea name="userResume" placeholder="O'zingiz haqingizda qisqacha ma'lumot bering..." required></textarea>
                                            </div>
                                            <button type="submit" className="submit-career-btn">
                                                <FaPaperPlane /> YUBORISH +
                                            </button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="careers-benefits">
                    <div className="benefit">
                        <div className="b-icon">🍔</div>
                        <h4>Bepul tushlik</h4>
                    </div>
                    <div className="benefit">
                        <div className="b-icon">💸</div>
                        <h4>Haftalik maosh</h4>
                    </div>
                    <div className="benefit">
                        <div className="b-icon">📈</div>
                        <h4>Karyera o'sishi</h4>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Careers;
