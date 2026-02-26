    import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "Is your meat 100% Halal?",
            answer: "Yes, all our meat is 100% certified Halal and sourced from premium local suppliers. We maintain the highest standards of quality and purity."
        },
        {
            question: "How long does delivery take?",
            answer: "We aim for 30 minutes. Delivery time can vary between 20-45 minutes depending on your location and traffic, but our legends are always fast!"
        },
        {
            question: "Can I customize my burger?",
            answer: "Absolutely! Use our 🍔 CONSTRUCTOR in the menu to build your own masterpiece from scratch with your favorite toppings and sauces."
        },
        {
            question: "Do you have vegetarian options?",
            answer: "Yes, we offer premium veggie patties and a range of fresh salads. Check our 'Green Legacy' section in the menu."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="faq-section">
            <div className="container">
                <div className="faq-grid">
                    <div className="faq-content">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="faq-tag"
                        >
                            GOT QUESTIONS?
                        </motion.span>
                        <h2 className="section-title">FREQUENTLY ASKED <span>LEGENDS</span></h2>
                        <p className="section-desc">Everything you need to know about Black Star Burger and our delivery service.</p>

                        <div className="faq-illustration">
                            <img src="https://cdn-icons-png.flaticon.com/512/3075/3075923.png" alt="FAQ" className="floating-img" />
                        </div>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`faq-item ${activeIndex === idx ? 'active' : ''}`}
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                            >
                                <div className="faq-question">
                                    <h4>{faq.question}</h4>
                                    <div className="faq-toggle">
                                        {activeIndex === idx ? <FaMinus /> : <FaPlus />}
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {activeIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="faq-answer"
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
