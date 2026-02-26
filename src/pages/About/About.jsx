import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <h1>BIZ HAQIMIZDA</h1>
                <p>BLACK STAR BURGER o'z tarixi va an'analariga ega</p>
            </div>

            <div className="container">
                <div className="about-content">
                    <div className="about-text">
                        <span className="about-subtitle">BIZNING TARIX</span>
                        <h2>Sifat va An'ana Uyg'unligi</h2>
                        <p>Bizning restoranlar tarmog'imiz 2010-yildan beri mijozlarga eng mazali burgarlar va fast-food mahsulotlarini yetkazib bermoqda. Biz faqatgina yangi va tabiiy mahsulotlardan foydalanamiz.</p>
                        <p>Har bir kotletimiz maxsus retsept asosida tayyorlanadi va ochiq olovda pishiriladi. Bizning sirlangan bulkalarimiz esa har kuni ertalab pishiriqxona xodimlari tomonidan yangi yopiladi.</p>

                        <div className="stats-grid">
                            <div className="stat-item">
                                <h3>15+</h3>
                                <p>Yillik tajriba</p>
                            </div>
                            <div className="stat-item">
                                <h3>50+</h3>
                                <p>Restoranlar</p>
                            </div>
                            <div className="stat-item">
                                <h3>1M+</h3>
                                <p>Baxtli mijozlar</p>
                            </div>
                        </div>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" alt="Restoran fon" />
                        <div className="experience-badge">
                            <span>15</span>
                            <p>Yillik Sifat</p>
                        </div>
                    </div>
                </div>

                <div className="mission-vision-section">
                    <div className="mission-card">
                        <div className="m-icon">🎯</div>
                        <h3>Bizning Missiyamiz</h3>
                        <p>Har bir mijozga nafaqat taom, balki unutilmas hissiyotlar va yuqori darajadagi xizmat ko'rsatish orqali quvonch ulashish.</p>
                    </div>
                    <div className="mission-card">
                        <div className="m-icon">🌟</div>
                        <h3>Bizning Maqsadimiz</h3>
                        <p>O'zbekistonda fast-food madaniyatini yangi bosqichga olib chiqish va sifat bo'yicha etakchi bo'lish.</p>
                    </div>
                </div>

                <div className="quality-showcase">
                    <div className="quality-image">
                        <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2070&auto=format&fit=crop" alt="Quality Burger" />
                    </div>
                    <div className="quality-text">
                        <h2>Nima uchun aynan BSB?</h2>
                        <div className="q-list">
                            <div className="q-item">
                                <h4>✅ %100 Halol go'sht</h4>
                                <p>Biz faqat sertifikatlangan va eng yuqori sifatli halol go'sht mahsulotlarini tanlaymiz.</p>
                            </div>
                            <div className="q-item">
                                <h4>✅ Daily Fresh Buns</h4>
                                <p>Bulkalarimiz har kuni o'zimizning pishiriqxonamizda hech qanday konservantlarsiz tayyorlanadi.</p>
                            </div>
                            <div className="q-item">
                                <h4>✅ Maxsus Souslar</h4>
                                <p>Bizning oshpazlarimiz tomonidan yaratilgan 10 dan ortiq mualliflik souslari.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
