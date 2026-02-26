import React from 'react';
import { motion } from 'framer-motion';
import './BurgerAnatomy.css';

const BurgerAnatomy = () => {
    const burgerLayers = [
        {
            id: 'top-bun',
            name: 'Artisan Brioche Bun',
            desc: 'Freshly baked every morning with a hint of honey and toasted sesame seeds.',
            image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', // Placeholder bun
            yOffset: -150
        },
        {
            id: 'top-sauce',
            name: 'Secret Signature Sauce',
            desc: 'A creamy, tangy blend of 12 herbs and spices that brings everything together.',
            image: 'https://cdn-icons-png.flaticon.com/512/2306/2306029.png',
            yOffset: -100
        },
        {
            id: 'veggies',
            name: 'Fresh Garden Greens',
            desc: 'Hand-picked crisp lettuce, vine-ripened tomatoes, and crunchy red onions.',
            image: 'https://cdn-icons-png.flaticon.com/512/1041/1041355.png',
            yOffset: -50
        },
        {
            id: 'cheese',
            name: 'Melted Aged Cheddar',
            desc: 'Double layer of premium cheddar melted to perfection over the hot patty.',
            image: 'https://cdn-icons-png.flaticon.com/512/819/819873.png',
            yOffset: 0
        },
        {
            id: 'patty',
            name: 'Dry-Aged Angus Beef',
            desc: '100% premium beef, coarsely ground and smashed for the ultimate crust.',
            image: 'https://cdn-icons-png.flaticon.com/512/2822/2822394.png',
            yOffset: 50
        },
        {
            id: 'bottom-bun',
            name: 'Toasted Base Bun',
            desc: 'The strong foundation, butter-toasted to prevent any sauce leakage.',
            image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
            yOffset: 120
        }
    ];

    return (
        <section className="burger-anatomy-section">
            <div className="container">
                <div className="anatomy-header">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                    >
                        The Masterpiece
                    </motion.h3>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="section-title"
                    >
                        ANATOMY OF A <span>LEGEND</span>
                    </motion.h2>
                </div>

                <div className="anatomy-visual-container">
                    <div className="layers-stack">
                        {burgerLayers.map((layer, index) => (
                            <motion.div
                                key={layer.id}
                                className={`anatomy-layer-item ${layer.id}`}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{
                                    opacity: 1,
                                    y: layer.yOffset,
                                    scale: 1
                                }}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                    delay: index * 0.1
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="layer-label left">
                                    {index % 2 === 0 && (
                                        <div className="label-content">
                                            <h4>{layer.name}</h4>
                                            <p>{layer.desc}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="layer-image-wrapper">
                                    <img src={layer.image} alt={layer.name} />
                                </div>
                                <div className="layer-label right">
                                    {index % 2 !== 0 && (
                                        <div className="label-content">
                                            <h4>{layer.name}</h4>
                                            <p>{layer.desc}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="anatomy-bg-text">CRAFTED</div>
                </div>
            </div>
        </section>
    );
};

export default BurgerAnatomy;
