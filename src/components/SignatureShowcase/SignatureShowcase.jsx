import React from 'react';
import { motion } from 'framer-motion';
import './SignatureShowcase.css';

const layers = [
    { name: 'Yumshoq klassik bulka', icon: '🍔', desc: 'Sutli va mayin' },
    { name: 'Cheddar pishlog\'i', icon: '🧀', desc: 'Ishtahaochar erigan' },
    { name: 'Suvli mol go\'shti', icon: '🥩', desc: '100% Angus go\'shti' },
    { name: 'Yangi pomidor', icon: '🍅', desc: 'Daladan yangi uzilgan' },
    { name: 'Tuzlangan bodring', icon: '🥒', desc: 'Qarsildoq va nordon' },
    { name: 'Salat bargi', icon: '🥬', desc: 'Fresh va vitaminli' },
    { name: 'Maxsus bulka (pastki)', icon: '🍔', desc: 'Sirlangan va mustahkam' }
];

const SignatureShowcase = () => {
    return (
        <section className="signature-showcase">
            <div className="container">
                <motion.div
                    className="showcase-header"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="showcase-subtitle">Eng mashhur tanlov</h3>
                    <h2 className="showcase-title">BLACK STAR SIGNATURE</h2>
                    <p>Har bir qatlamda o'zgacha lazzat va sifat</p>
                </motion.div>

                <div className="showcase-content">
                    <div className="burger-explosion">
                        <div className="burger-layers">
                            {layers.map((layer, index) => (
                                <motion.div
                                    key={index}
                                    className={`burger-layer layer-${index}`}
                                    initial={{ opacity: 0, y: (index - 3) * 100 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-100px" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 10,
                                        delay: index * 0.1
                                    }}
                                    whileHover={{ scale: 1.1, x: 10 }}
                                >
                                    <div className="layer-info left">
                                        <h4>{layer.name}</h4>
                                        <p>{layer.desc}</p>
                                    </div>
                                    <div className="layer-visual">
                                        <span className="layer-icon">{layer.icon}</span>
                                        <div className="layer-disc"></div>
                                    </div >
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            className="main-burger-img"
                            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, type: "spring" }}
                        >
                            <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop" alt="Signature Burger" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignatureShowcase;
