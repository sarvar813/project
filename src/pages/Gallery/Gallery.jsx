import React, { useState } from 'react';
import { FaTimes, FaExpandAlt, FaCheckCircle } from 'react-icons/fa';
import './Gallery.css';

const images = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
        title: 'Special Burger',
        description: 'Bizning eng mashhur va eng sifatli burgerimiz. Maxsus retsept bo\'yicha tayyorlangan.',
        ingredients: [
            'Yumshoq klassik bulka (yuqori)',
            'Eritilgan Cheddar pishlog\'i',
            '100% suvli mol go\'shti kotleti',
            'Yangi pomidor bo\'laklari',
            'Tuzlangan bodring (pickles)',
            'Yangi va qarsildoq salat bargi',
            'Maxsus sirlangan bulka (pastki)'
        ]
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop',
        title: 'Delicious Combo',
        description: 'Tejamkor va juda mazali combo menyu. Burger, fri va ichimlik birgalikda.',
        ingredients: [
            'Klassik Burger',
            'Oltinrang fri kartoshkasi',
            'Salqin Coca-Cola 0.5L',
            'Maxsus ketchup'
        ]
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop',
        title: 'Crunchy Chicken',
        description: 'Qarsildoq tovuq go\'shtidan tayyorlangan maxsus taomimiz.',
        ingredients: [
            'Tovuq filesi',
            'Maxsus qarsildoq klyar',
            'Ziravorlar aralashmasi',
            'Achchiq sous'
        ]
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
        title: 'Juicy Meat',
        description: 'Haqiqiy go\'sht ishqibozlari uchun! Suvli va mazali mol go\'shti.',
        ingredients: [
            'Yangi mol go\'shti (Angus)',
            'Dengiz tuzi va murch',
            'Sariyog\' va rozmarin',
            'Dumlangan piyoz'
        ]
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
        title: 'Golden Fries',
        description: 'Oltinrang va juda qarsildoq frantsuzcha fri kartoshkasi.',
        ingredients: [
            'Tanlangan kartoshka',
            'O\'simlik yog\'i',
            'Maxsus tuzli aralashma'
        ]
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop',
        title: 'Our Restaurant',
        description: 'BLACK STAR BURGER restoranining zamonaviy va shinam dizayni.',
        ingredients: [
            'Zamonaviy interyer',
            'Shinam atmosfera',
            'Professional xizmat'
        ]
    },
];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (img) => {
        setSelectedImage(img);
        document.body.style.overflow = 'hidden';
    };

    const closeImage = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="gallery-page">
            <div className="gallery-hero">
                <h1>BIZNING GALEREYA</h1>
                <p>BLACK STAR BURGER atmosferasini his qiling</p>
            </div>

            <div className="container">
                <div className="gallery-grid">
                    {images.map(img => (
                        <div key={img.id} className="gallery-item" onClick={() => openImage(img)}>
                            <img src={img.url} alt={img.title} />
                            <div className="gallery-overlay">
                                <FaExpandAlt className="expand-icon" />
                                <h3>{img.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gallery Lightbox Modal */}
            {selectedImage && (
                <div className="gallery-modal-overlay" onClick={closeImage}>
                    <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="gallery-modal-close" onClick={closeImage}>
                            <FaTimes />
                        </button>

                        <div className="gallery-modal-body">
                            <div className="gallery-modal-image">
                                <img src={selectedImage.url} alt={selectedImage.title} />
                            </div>
                            <div className="gallery-modal-info">
                                <h2>{selectedImage.title}</h2>
                                <p className="gallery-description">{selectedImage.description}</p>

                                {selectedImage.ingredients && (
                                    <div className="gallery-modal-ingredients">
                                        <h4>Nimalar solingan?</h4>
                                        <ul>
                                            {selectedImage.ingredients.map((ing, i) => (
                                                <li key={i}>
                                                    <FaCheckCircle className="check-icon" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
