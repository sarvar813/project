import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './NewsParallax.css';

const NewsParallax = () => {
    return (
        <section className="news-parallax">
            <div className="parallax-content">
                <h3 className="p-subtitle">Every Friday</h3>
                <h2 className="p-title">Family Day</h2>
                <h4 className="p-hashtag">#BLACKBURGER</h4>

                <div className="p-social">
                    {[
                        <FaFacebookF />,
                        <FaTwitter />,
                        <FaInstagram />,
                        <FaYoutube />
                    ].map((icon, i) => (
                        <a key={i} href="#">
                            {icon}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsParallax;
