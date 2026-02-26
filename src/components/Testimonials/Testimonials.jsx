import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const reviews = [
    {
        id: 1,
        name: 'MR. JOHNATAN MAYER',
        role: 'RESTAURANT OWNER',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
        text: 'Etiam facilisis, purus vitae aliquam placerat, lectus quam feugiat ligula, vitae dictum mi mauris sit amet odio. Mauris sagittis pretium mi, ut tempor justo laoreet vel. In facilisis velit ligula, vel sodales diam hendrerit.'
    },
    {
        id: 2,
        name: 'SARAH CONNOR',
        role: 'FOOD CRITIC',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        text: 'Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam.'
    },
    {
        id: 3,
        name: 'ALEX RIVERA',
        role: 'TOP CUSTOMER',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
        text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque.'
    }
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === reviews.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? reviews.length - 1 : current - 1);
    };

    return (
        <section className="testimonials-section">
            <div className="t-overlay"></div>
            <div className="t-container">
                <div className="t-header">
                    <h3 className="t-subtitle">Woooow</h3>
                    <h2 className="t-title">THEY SAID!</h2>
                </div>

                <div className="slider-wrapper">
                    <button className="slider-btn prev" onClick={prevSlide}>
                        <FaChevronLeft />
                    </button>

                    <div className="testimonial-card">
                        <div className="t-image">
                            <img src={reviews[current].image} alt={reviews[current].name} />
                        </div>
                        <p className="t-text">"{reviews[current].text}"</p>
                        <h4 className="t-author">— {reviews[current].name}</h4>
                        <span className="t-role">{reviews[current].role}</span>
                    </div>

                    <button className="slider-btn next" onClick={nextSlide}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
