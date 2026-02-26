import React from 'react';
import { useCart } from '../../context/CartContext';
import './FeatureGrid.css';

const FeatureGrid = () => {
    const { addToCart, isStoreOpen } = useCart();
    const [selectedRecipe, setSelectedRecipe] = React.useState(null);

    const gridItems = [
        {
            id: 'fg1',
            type: 'text',
            title: 'BUTTERBURGER',
            subtitle: 'Welcome',
            price: '$12.00',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
            recipe: {
                title: 'BUTTERBURGER RETSEPT',
                ingredients: ["Premium mol go'shti", "Sariyog' (Butter)", "Cheddar pishlog'i", "Tosterda qizartirilgan bulka"],
                steps: ["Go'shtni pishirish jarayonida ustiga sariyog' qo'shiladi", "Pishloqni go'sht ustida eritiladi", "Qarsildoq bulka bilan birlashtiriladi"]
            }
        },
        {
            id: 'fg2',
            type: 'text',
            title: 'CHEESE AND BACON',
            subtitle: 'Welcome',
            price: '$14.50',
            image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop',
            recipe: {
                title: 'CHEESE AND BACON RETSEPT',
                ingredients: ["Mol go'shti", "Dudlangan bekon", "Ikki karra pishloq", "Maxsus BBQ sous"],
                steps: ["Bekonni qarsildoq holatga kelguncha qovuriladi", "Go'shtni pishloq bilan birga pishiriladi", "BBQ sousi bilan boyitiladi"]
            }
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop',
            recipe: {
                title: 'CLASSIC BURGER RETSEPT',
                ingredients: ["Klassik kotlet", "Yangi pomidor va bodring", "Salat bargi", "Klassik burger sousi"],
                steps: ["Sabzavotlarni yupqa qilib to'g'raladi", "Kotletni o'rtacha olovda pishiriladi", "Barcha qatlamlarni ketma-ket joylashtiriladi"]
            }
        },
        {
            id: 'fg3',
            type: 'text',
            title: 'BLACK BURGERS',
            subtitle: 'Welcome',
            price: '$13.00',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
        },
        {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
            recipe: {
                title: 'BLACK BURGER RETSEPT',
                ingredients: ["Qora bulka", "Tovuq yoki mol go'shti", "Piyoz chipsi", "Oq sous"],
                steps: ["Bulkani bug'da yumshatiladi", "Go'shtni maxsus sousda marinovka qilinadi", "Piyoz chiplari bilan qarsildoq ta'm beriladi"]
            }
        },
        {
            id: 'fg4',
            type: 'text',
            title: 'CLASSIC BURGER',
            subtitle: 'Welcome',
            price: '$10.00',
            image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop'
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

    const openRecipe = (recipe) => {
        if (recipe) setSelectedRecipe(recipe);
    };

    const closeRecipe = () => setSelectedRecipe(null);

    return (
        <section className="feature-grid-section">
            <div className="f-grid-container">
                {gridItems.map((item, index) => (
                    <div key={index} className={`f-grid-item ${item.type}`}>
                        {item.type === 'text' ? (
                            <div className="f-text-content">
                                <h4 className="f-subtitle">{item.subtitle}</h4>
                                <h2 className="f-title">{item.title}</h2>
                                <button
                                    className="f-link-btn"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!isStoreOpen}
                                >
                                    {isStoreOpen ? 'BUY NOW +' : 'Yopiq'}
                                </button>
                            </div>
                        ) : (
                            <div className="f-image-clickable" onClick={() => openRecipe(item.recipe)}>
                                <img src={item.url} alt="Food feature" className="f-image" />
                                <div className="f-image-overlay">
                                    <span>RETSEPTNI KO'RISH</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedRecipe && (
                <div className="recipe-modal-overlay" onClick={closeRecipe}>
                    <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="recipe-modal-close" onClick={closeRecipe}>&times;</button>
                        <div className="recipe-modal-header">
                            <h2>{selectedRecipe.title}</h2>
                        </div>
                        <div className="recipe-modal-body">
                            <div className="recipe-section">
                                <h3>Masalliqlar:</h3>
                                <ul>
                                    {selectedRecipe.ingredients.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="recipe-section">
                                <h3>Tayyorlash bosqichlari:</h3>
                                <ol>
                                    {selectedRecipe.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FeatureGrid;
