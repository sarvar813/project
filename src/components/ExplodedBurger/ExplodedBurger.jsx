import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ExplodedBurger.css';

const ExplodedBurger = () => {
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transform values for each layer based on scroll
    const yBunTop = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, -250, 0]);
    const yLettuce = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, -150, 0]);
    const yTomato = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, -80, 0]);
    const yCheese = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, -20, 0]);
    const yMeat = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 80, 0]);
    const yBunBottom = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 200, 0]);

    const opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
    const labelX = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [-100, 0, 100]);

    const layers = [
        { id: 'bun-top', name: 'Premium Brioche Bulochkasi', img: 'data:image/jpeg;base64,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', y: yBunTop, desc: 'Yangi yopilgan, sariyog\'li briosh' },
        { id: 'lettuce', name: 'Tog\' Salat Bargi', img: 'https://yukber.uz/image/cache/catalog/product/YK0304/%20%D0%BB%D0%B8%D1%81%D1%82-700x700.jpg', y: yLettuce, desc: 'Karsildoq va vitaminlarga boy' },
        { id: 'tomato', name: 'Sershira Pomidor', img: 'https://purepng.com/public/uploads/large/purepng.com-tomato-slicevegetables-tomato-slice-9415246714570uajw.png', y: yTomato, desc: 'Eng sara qizil pomidorlar' },
        { id: 'cheese', name: 'Eritilgan Chedder', img: 'https://officialpsds.com/imageview/75/7b/757b32_large.png?1521316496', y: yCheese, desc: 'Haqiqiy ingliz cheddar pishlog\'i' },
        { id: 'meat', name: 'Angus Go\'shti', img: 'https://officialpsds.com/imageview/rv/6q/rv6q8m_large.png?1521316523', y: yMeat, desc: '100% tabiiy mol go\'shti' },
        { id: 'bun-bottom', name: 'Asos Qismi', img: 'https://www.pngkit.com/png/full/22-221800_burger-bun-top-png.png', y: yBunBottom, desc: 'Maxsus sous bilan qoplangan' },
    ];

    return (
        <section className="exploded-burger-section" ref={containerRef}>
            <div className="exploded-bg-text">QUALITY</div>

            <div className="exploded-container">
                <div className="exploded-content-left">
                    <motion.div style={{ opacity }} className="floating-info">
                        <h2>MAHSULOT <span>ANATOMIYASI</span></h2>
                        <p>Biz faqat eng sara va yangi mahsulotlardan foydalanamiz. Har bir qatlam - bu san'at asari.</p>
                        <ul className="ingredient-features">
                            <li>✨ 100% Tabiiy mahsulot</li>
                            <li>👨‍🍳 Professional shef-pazarlar</li>
                            <li>🔥 Oloving ustida pishirilgan</li>
                        </ul>
                    </motion.div>
                </div>

                <div className="burger-layers-wrapper">
                    {layers.map((layer, index) => (
                        <motion.div
                            key={layer.id}
                            className={`burger-layer ${layer.id}`}
                            style={{ y: layer.y }}
                        >
                            <img src={layer.img} alt={layer.name} />
                            <motion.div
                                className="layer-label"
                                style={{ opacity, x: labelX }}
                            >
                                <div className="label-dot"></div>
                                <div className="label-text">
                                    <h4>{layer.name}</h4>
                                    <p>{layer.desc}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <div className="exploded-content-right">
                    <motion.div style={{ opacity }} className="quality-badge">
                        <div className="badge-circle">
                            <span className="number">100%</span>
                            <span className="text">PURE BEEF</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ExplodedBurger;
