import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import './Stories.css';

const storiesData = [
    {
        id: 1,
        title: 'Yangi Burger!',
        productId: 32, // Crispy Chicken Burger
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        preview: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop',
        video: false
    },
    {
        id: 2,
        title: 'Combo Aksiya',
        productId: 12, // ULTIMATE MEGA COMBO
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
        preview: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop',
        video: false
    },
    {
        id: 3,
        title: 'Muzqaymoqlar',
        productId: 7, // Milkshake
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop',
        preview: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200&auto=format&fit=crop',
        video: false
    },
    {
        id: 4,
        title: 'Yashil Salat',
        productId: 16, // Yashil Salat
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
        preview: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop',
        video: false
    }
];

const Stories = () => {
    const [activeStory, setActiveStory] = useState(null);
    const [viewedStories, setViewedStories] = useState([]);
    const { addToCart, setIsCartOpen, isStoreOpen } = useCart();
    const { products } = useProducts();

    const openStory = (story) => {
        setActiveStory(story);
        if (!viewedStories.includes(story.id)) {
            setViewedStories([...viewedStories, story.id]);
        }
    };

    const closeStory = () => setActiveStory(null);

    const handleOrderClick = () => {
        if (!isStoreOpen || !activeStory) return;

        const product = products.find(p => p.id === activeStory.productId);
        if (product && product.isAvailable !== false) {
            addToCart(product);
            setIsCartOpen(true);
            closeStory();
        }
    };

    return (
        <div className="stories-container">
            <div className="stories-list">
                {storiesData.map(story => (
                    <div
                        key={story.id}
                        className={`story-item ${viewedStories.includes(story.id) ? 'viewed' : ''}`}
                        onClick={() => openStory(story)}
                    >
                        <div className="story-ring">
                            <img src={story.preview} alt={story.title} />
                        </div>
                        <span className="story-title">{story.title}</span>
                    </div>
                ))}
            </div>

            {activeStory && (
                <div className="story-overlay" onClick={closeStory}>
                    <div className="story-modal" onClick={e => e.stopPropagation()}>
                        <div className="story-progress">
                            <div className="progress-bar"></div>
                        </div>
                        <button className="story-close" onClick={closeStory}><FaTimes /></button>
                        <div className="story-header">
                            <img src={activeStory.preview} alt="" />
                            <span>Black Star Burger</span>
                        </div>
                        <div className="story-content">
                            <img src={activeStory.image} alt={activeStory.title} />
                            <div className="story-footer">
                                <h3>{activeStory.title}</h3>
                                <button
                                    className="order-now-btn"
                                    onClick={handleOrderClick}
                                    disabled={!isStoreOpen}
                                >
                                    {isStoreOpen ? 'BUYURTMA BERISH' : 'DO\'KON YOPIQ'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stories;
