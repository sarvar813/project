import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaPinterestP, FaTwitter, FaYoutube, FaVimeoV, FaRegClock, FaPhoneAlt, FaCalendarCheck, FaGlobe, FaChevronDown } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const { i18n } = useTranslation();
    const [isLangOpen, setIsLangOpen] = React.useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangOpen(false);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return { text: "XAYRLI TONG 👋", icon: "☀️", color: "#f1c40f" };
        if (hour >= 12 && hour < 18) return { text: "XAYRLI KUN 👋", icon: "🍔", color: "#e67e22" };
        if (hour >= 18 && hour < 22) return { text: "XAYRLI KECH 👋", icon: "🌙", color: "#34495e" };
        return { text: "XAYRLI TUN 👋", icon: "✨", color: "#9b59b6" };
    };

    const greeting = getGreeting();

    return (
        <div className="top-header">
            <div className="container">
                <div className="header-content">
                    <div className="social-links">
                        <div className="lang-switcher-wrapper">
                            <div className="lang-switcher" onClick={() => setIsLangOpen(!isLangOpen)}>
                                <FaGlobe className="globe-icon" />
                                <span className="current-lang">{i18n.language.toUpperCase()}</span>
                                <FaChevronDown className={`arrow-icon ${isLangOpen ? 'open' : ''}`} />
                            </div>

                            {isLangOpen && (
                                <div className="lang-dropdown">
                                    <div className="lang-option" onClick={() => changeLanguage('uz')}>UZBEK</div>
                                    <div className="lang-option" onClick={() => changeLanguage('ru')}>RUSSIAN</div>
                                    <div className="lang-option" onClick={() => changeLanguage('en')}>ENGLISH</div>
                                </div>
                            )}
                        </div>
                        <div className="divider"></div>
                        <span>FOLLOW U</span>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaPinterestP /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaYoutube /></a>
                        <a href="#"><FaVimeoV /></a>
                    </div>
                    <div className="header-info">
                        <div className="info-item greeting-item" style={{ borderLeft: `3px solid ${greeting.color}` }}>
                            <span className="greeting-icon">{greeting.icon}</span>
                            <span className="greeting-text">{greeting.text}</span>
                        </div>
                        <div className="info-item">
                            <FaRegClock className="icon" />
                            <span>OPEN NOW</span>
                        </div>
                        <div className="info-item">
                            <FaPhoneAlt className="icon" />
                            <span>CALL +(100) 333-4578</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
