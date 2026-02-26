import React from 'react';
import { useCart } from '../../context/CartContext';
import './DessertGrid.css';

const DessertGrid = () => {
    const { addToCart, isStoreOpen } = useCart();

    const dessertItems = [
        {
            id: 'dg1',
            type: 'text',
            title: 'CHOCO LAVA',
            subtitle: 'Sweet Moment',
            price: '$6.50',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 'dg2',
            type: 'text',
            title: 'STRAWBERRY CAKE',
            subtitle: 'Sweet Moment',
            price: '$7.00',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 'dg3',
            type: 'text',
            title: 'BROWNIE DELIGHT',
            subtitle: 'Sweet Moment',
            price: '$6.00',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://www.shokoladki.ru/upload/resize_cache/iblock/2e6/860_496_1/2e65df7794a26f2ffea1705f3629d321.jpg'
        },
        {
            id: 'dg4',
            type: 'text',
            title: 'BELGIAN WAFFLES',
            subtitle: 'Sweet Moment',
            price: '$8.00',
            image: 'https://www.shokoladki.ru/upload/resize_cache/iblock/2e6/860_496_1/2e65df7794a26f2ffea1705f3629d321.jpg'
        },
    ];

    const handleAddToCart = (item) => {
        if (isStoreOpen) {
            addToCart({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image
            });
        }
    };

    return (
        <section className="dessert-grid-section">
            <div className="d-grid-container">
                {dessertItems.map((item, index) => (
                    <div key={index} className={`d-grid-item ${item.type}`}>
                        {item.type === 'text' ? (
                            <div className="d-text-content">
                                <h4 className="d-subtitle">{item.subtitle}</h4>
                                <h2 className="d-title">{item.title}</h2>
                                <button
                                    className="d-add-btn"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!isStoreOpen}
                                >
                                    {isStoreOpen ? 'BUY NOW +' : 'Yopiq'}
                                </button>
                            </div>
                        ) : (
                            <img src={item.url} alt="Dessert feature" className="d-image" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DessertGrid;
