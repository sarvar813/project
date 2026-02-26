import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaFireAlt, FaFlask, FaMagic, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './SauceShowcase.css';

const SauceShowcase = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const sauces = [
        {
            id: 9,
            name: t('sauces.red.name', 'SIGNATURE RED'),
            subtitle: t('sauces.red.subtitle', 'Sirlangan maxfiy retsept'),
            image: 'https://media.istockphoto.com/id/1306565945/photo/arrabbiata-sauce-spicy-italian-tomato-sauce-in-a-wooden-bowl.jpg?s=612x612&w=0&k=20&c=eW9EC3MLMzWBuTSB2bdDBwpSJNP2_v95EZr_Rhqtnm0=',
            color: '#e30034',
            features: [
                t('sauces.red.f1', '12 xil ziravor'),
                t('sauces.red.f2', 'Tabiiy pomidor'),
                t('sauces.red.f3', 'Achchiq-chuchuk')
            ],
            icon: <FaFireAlt />
        },
        {
            id: 10,
            name: t('sauces.gold.name', 'GOLDEN CHEDDAR'),
            subtitle: t('sauces.gold.subtitle', 'Issiq va mayin lazzat'),
            image: 'https://media.istockphoto.com/id/1393780197/photo/cheese-sauce.jpg?s=612x612&w=0&k=20&c=bbEQKHlnPZVLrT1xbnOakX6qheTjeLsn6Rrs5HZZaHE=',
            color: '#ffc107',
            features: [
                t('sauces.gold.f1', 'Haqiqiy Cheddar'),
                t('sauces.gold.f2', 'Qaymoqli tekstura'),
                t('sauces.gold.f3', 'Eritilgan issiq')
            ],
            icon: <FaMagic />
        },
        {
            id: 101,
            name: t('sauces.thai.name', 'SWEET & THAI'),
            subtitle: t('sauces.thai.subtitle', 'Ekzotik nordon-shirin'),
            image: 'https://s.myspar.ru/upload/img/10/1014/101417745.jpg?1722265067',
            color: '#ff6b6b',
            features: [
                t('sauces.thai.f1', 'Tailand siri'),
                t('sauces.thai.f2', 'Nordon-shirin'),
                t('sauces.thai.f3', 'Tabiiy ingredientlar')
            ],
            icon: <FaLeaf />
        },
        {
            id: 102,
            name: t('sauces.garlic.name', 'WHITE GARLIC'),
            subtitle: t('sauces.garlic.subtitle', 'Mayin sarimsoqli'),
            image: 'https://i.pinimg.com/1200x/3c/7d/c1/3c7dc160f6db1e0b3256d4429a9d9094.jpg',
            color: '#f8f9fa',
            features: [
                t('sauces.garlic.f1', 'Yangi sarimsoq'),
                t('sauces.garlic.f2', 'Qaymoqli'),
                t('sauces.garlic.f3', 'Maxsus ziravorlar')
            ],
            icon: <FaFlask />
        }
    ];

    return (
        <section className="sauce-showcase">
            <div className="sauce-container">
                <div className="section-header">
                    <span className="section-badge"><FaFlask /> {t('sauces.badge', 'BIZNING SIRIMIZ')}</span>
                    <h2 className="section-title">{t('sauces.title', 'MAXSUS SOUSLAR')}</h2>
                    <p className="section-desc">
                        {t('sauces.desc', "Har bir burgerimizning kaliti - bu bizning sirlangan souslarimizda. Tabiiy ingredientlardan tayyorlangan takrorlanmas ta'mlar.")}
                    </p>
                </div>

                <div className="sauce-grid">
                    {sauces.map((sauce, idx) => (
                        <div
                            key={sauce.id}
                            className="sauce-card"
                            onClick={() => navigate(`/product/${sauce.id}`)}
                            style={{ '--accent-color': sauce.color }}
                        >
                            <div className="sauce-image-box">
                                <img
                                    src={sauce.image}
                                    alt={sauce.name}
                                />
                                <div className="sauce-icon-floating">{sauce.icon}</div>
                            </div>

                            <div className="sauce-info-box">
                                <h4 className="sauce-subtitle">{sauce.subtitle}</h4>
                                <h3 className="sauce-name">{sauce.name}</h3>

                                <ul className="sauce-features">
                                    {sauce.features.map((f, i) => (
                                        <li key={i}>
                                            <span></span> {f}
                                        </li>
                                    ))}
                                </ul>

                                <button className="explore-sauce-btn">
                                    {t('sauces.explore', "BATAFSIL KO'RISH")} +
                                </button>
                            </div>

                            <div className="card-bg-glow"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SauceShowcase;
