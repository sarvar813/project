import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import './LocationSection.css';

const LocationSection = () => {
    return (
        <section className="location-section">
            <div className="location-container">
                <div className="location-info">
                    <div className="location-header">
                        <span className="location-subtitle">BIZNING MANZIL</span>
                        <h2 className="location-title">Bizga Tashrif Buyuring</h2>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">
                                <FaMapMarkerAlt />
                            </div>
                            <div className="info-text">
                                <h4>Manzilimiz</h4>
                                <p>Toshkent shahar, Shayxontohur tumani, Qoratosh ko'chasi, 5A-uy (Samarqand Darvoza)</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FaPhoneAlt />
                            </div>
                            <div className="info-text">
                                <h4>Telefon</h4>
                                <p>+998 90 123 45 67</p>
                                <p>+998 71 200 11 22</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FaClock />
                            </div>
                            <div className="info-text">
                                <h4>Ish Vaqti</h4>
                                <p>Dushanba - Yakshanba</p>
                                <p>09:00 - 23:00</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">
                                <FaEnvelope />
                            </div>
                            <div className="info-text">
                                <h4>Email</h4>
                                <p>info@bsb-burger.uz</p>
                                <p>support@bsb-burger.uz</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="location-map">
                    <iframe
                        title="BSB Burger Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.641923236434!2d69.22827707587491!3d41.316652771308874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b9876bf90f1%3A0xa64aed927639ac38!2z0KLQpiAiU2FtYXJxYW5kIERhcnZvemEi!5e0!3m2!1sru!2s!4v1771321580547!5m2!1sru!2s"
                        width="100%"
                        height="500"
                        style={{ border: 0, borderRadius: "20px" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
