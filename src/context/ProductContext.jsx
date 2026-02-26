import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const initialProducts = [
    {
        id: 1,
        name: 'Black Star Special',
        price: '$14.99',
        originalPrice: '$19.99',
        discountLabel: '-25% OFF',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=1000&auto=format&fit=crop',
        description: 'Haqiqiy 100% mol go\'shti, maxsus qora bulka va bizning sirlangan sousimiz bilan unutilmas shohona ta\'m.',
        ingredients: ['100% Halol Mol go\'shti', 'Yangi pishirilgan qora bulka', 'Premium Cheddar pishlog\'i', 'Maxsus siri-sous', 'Yangi salat bargi'],
        rating: 5.0,
        isPremium: true,
        tags: ['Popular'],
        reviews: [
            { id: 1, user: 'Ali', rating: 5, comment: 'Haqiqiy shohona ta\'m!' },
            { id: 2, user: 'Zuhra', rating: 5, comment: 'Juda shonli va mazali.' }
        ]
    },
    {
        id: 2,
        name: 'Cheese Burger',
        price: '$7.50',
        originalPrice: '$9.50',
        discountLabel: '-21% OFF',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
        description: 'Pishloqni xush ko\'ruvchilar uchun! Irim-irim erigan cheddar pishlog\'i va suvli go\'sht uyg\'unligi.',
        ingredients: ['Mol go\'shti', 'Cheddar pishlog\'i', 'Tuzlangan bodring', 'Xantal', 'Ketchup'],
        rating: 4.8,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 3,
        name: 'Bacon Burger',
        price: '$8.50',
        originalPrice: '$11.00',
        discountLabel: '-23% OFF',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800&auto=format&fit=crop',
        description: 'Qarsildoq bekon va dudlangan ta\'m. Bu burger sizga haqiqiy lazzat bag\'ishlaydi.',
        ingredients: ['Mol go\'shti', 'Qarsildoq bekon', 'Barbeque sous', 'Qizil piyoz', 'Pishloq'],
        rating: 4.7,
        tags: ['Spicy', 'Popular'],
        reviews: []
    },
    {
        id: 31,
        name: 'Mexican Spicy Burger',
        price: '$9.99',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=800&auto=format&fit=crop',
        description: 'Achchiqni xush ko\'ruvchilar uchun! Jalapeno va maxsus achchiq sous bilan.',
        ingredients: ['Mol go\'shti', 'Jalapeno', 'Achchiq Chili sous', 'Pishloq'],
        rating: 4.9,
        reviews: []
    },
    {
        id: 32,
        name: 'Crispy Chicken Burger',
        price: '$8.00',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        description: 'Qarsildoq tovuq go\'shti va yangi sabzavotlar.',
        ingredients: ['Tovuq go\'shti', 'Yangi bulka', 'Mayonez', 'Salat bargi'],
        rating: 4.6,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 4,
        name: 'French Fries',
        price: '$4.00',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
        description: 'Oltinrang va qarsildoq kartoshka fri. Tashqarisi qarsildoq, ichi esa yumshoqqina.',
        ingredients: ['Kartoshka', 'Dengiz tuzi', 'O\'simlik yog\'i'],
        rating: 4.2,
        reviews: []
    },
    {
        id: 5,
        name: 'Onion Rings',
        price: '$5.50',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop',
        description: 'Maxsus klyarda qovurilgan piyoz halqalari. Ishtahaochar va mazali gazak.',
        ingredients: ['Piyoz', 'Maxsus klyar', 'Ziravorlar'],
        rating: 4.4,
        reviews: []
    },
    {
        id: 6,
        name: 'Coca Cola',
        price: '$2.50',
        category: 'DRINKS',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        description: 'Muzdek salqin Coca-Cola. Har qanday ovqat uchun mukammal hamroh.',
        ingredients: ['Salqin ichimlik', 'Muz'],
        rating: 4.9,
        reviews: []
    },
    {
        id: 7,
        name: 'Milkshake',
        price: '$4.50',
        originalPrice: '$6.00',
        discountLabel: '-25% OFF',
        category: 'DRINKS',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop',
        description: 'Qaymoqli va shirin milkshake. Vanil, shokolad yoki qulupnay ta\'mi bilan.',
        ingredients: ['Sut', 'Muzqaymoq', 'Vanil ekstrakti', 'Ko\'pirtirilgan qaymoq'],
        rating: 4.6,
        reviews: []
    },
    {
        id: 8,
        name: 'Chicken Wings',
        price: '$9.00',
        originalPrice: '$12.00',
        discountLabel: '-25% OFF',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop',
        description: 'Achchiq va mazali tovuq qanotchalari. Maxsus sous bilan taqdim etiladi.',
        ingredients: ['Tovuq qanotlari', 'Achchiq sous', 'Kunjut'],
        rating: 4.5,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 9,
        name: 'Chili Hot Sauce',
        price: '$1.50',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1607330283713-1077755b62e4?q=80&w=800&auto=format&fit=crop',
        description: 'Maksimal achchiqlikni sevuvchilar uchun maxsus Chili sousi.',
        ingredients: ['Chili qalampiri', 'Ziravorlar', 'Tabiiy pomidor'],
        rating: 4.8,
        tags: ['Spicy'],
        reviews: []
    },
    {
        id: 10,
        name: 'Melted Cheddar',
        price: '$2.50',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800&auto=format&fit=crop',
        description: 'Eritilgan issiq Cheddar pishlog\'i.',
        ingredients: ['Cheddar pishlog\'i', 'Qaymoq'],
        rating: 4.9,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 101,
        name: 'Sweet & Thai Sauce',
        price: '$1.50',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1585325701166-38169ec3118a?q=80&w=800&auto=format&fit=crop',
        description: 'Nordon-shirin Thai uslubidagi sous.',
        ingredients: ['Shakar', 'Sarimsoq', 'Limon'],
        rating: 4.7,
        tags: ['Healthy'],
        reviews: []
    },
    {
        id: 102,
        name: 'White Garlic Sauce',
        price: '$1.50',
        category: 'SIDES',
        image: 'https://images.unsplash.com/photo-1549590143-fd300407a97b?q=80&w=800&auto=format&fit=crop',
        description: 'Mayin sarimsoqli oq sous.',
        ingredients: ['Sarimsoq', 'Qaymoq', 'Ko\'katlar'],
        rating: 4.8,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 103,
        name: 'Black Star Classic',
        price: '$10.99',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?q=80&w=800&auto=format&fit=crop',
        description: 'Bizning afsonaviy QORA nonda tayyorlangan klassik burgerimiz.',
        ingredients: ['Qora non', 'Marmar go\'sht', 'Cheddar', 'Maxsus sous'],
        rating: 5.0,
        tags: ['Popular'],
        reviews: []
    },
    {
        id: 104,
        name: 'Dragon Chile Red',
        price: '$11.50',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800&auto=format&fit=crop',
        description: 'QIZIL nonli, olovli achchiq Dragon burger.',
        ingredients: ['Qizil achchiq non', 'Marmar go\'sht', 'Xalapeno', 'Chili sous'],
        rating: 4.9,
        tags: ['Spicy'],
        reviews: []
    },
    {
        id: 105,
        name: 'Garden Fresh Green',
        price: '$9.50',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1514516348911-796622676af8?q=80&w=800&auto=format&fit=crop',
        description: 'YASHIL nonli, vitaminlarga boy parhez burger.',
        ingredients: ['Ismaloqli yashil non', 'Tovuq filesi', 'Avokado', 'Oq sous'],
        rating: 4.7,
        tags: ['Healthy', 'Vegan'],
        reviews: []
    },
    {
        id: 12,
        name: 'ULTIMATE MEGA COMBO',
        price: '$20.00',
        originalPrice: '$35.00',
        discountLabel: '-43% SALE',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
        description: 'Bizning eng yirik va eng mazali combo to\'plamimiz! 2ta Premium Burger, 2ta Fri, 2ta Ichimlik va bizning maxsus sousimiz.',
        ingredients: ['2x Premium Burger', '2x French Fries', '2x Coca-Cola', 'Signature Sauce', 'Melted Cheddar'],
        rating: 5.0,
        reviews: []
    },
    {
        id: 13,
        name: 'Mineral Suv',
        price: '$1.00',
        category: 'DRINKS',
        image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=800&auto=format&fit=crop',
        description: 'Toza tog\' suvi. Chanqoqni qondirish uchun eng yaxshi tanlov.',
        ingredients: ['Mineral suv', 'Gazlangan/Gazlanmagan turdagi'],
        rating: 4.8,
        reviews: []
    },
    {
        id: 14,
        name: 'Margarita Pizza',
        price: '$12.50',
        originalPrice: '$15.00',
        discountLabel: '-17% OFF',
        category: 'PIZZA',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop',
        description: 'Klassik italyancha pitsa. Pomidor sousi, mozzarella pishlog\'i va reyhan barglari bilan.',
        ingredients: ['Yupqa xamir', 'Pomidor sousi', 'Mozzarella', 'Reyhan', 'Zaytun yog\'i'],
        rating: 4.7,
        reviews: []
    },
    {
        id: 16,
        name: 'Yashil Salat',
        price: '$7.99',
        originalPrice: '$9.99',
        discountLabel: '-20% OFF',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
        description: 'Yangi yashil sabzavotlar, avokado, noxat, turli rangli qalampir va maxsus zaytun yog\'i bilan.',
        ingredients: ['Salat barglari', 'Avokado', 'Noxat', 'Pomidor', 'Bodring', 'Zaytun yog\'i'],
        rating: 4.7,
        tags: ['Vegan', 'Healthy'],
        reviews: []
    },
    {
        id: 17,
        name: 'Caesar Salat',
        price: '$8.50',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=1000&auto=format&fit=crop',
        description: 'Klassik Caesar salati qarsildoq salat, parmesan pishlog\'i va maxsus Caesar sousi bilan.',
        ingredients: ['Romaine salat', 'Parmesan pishlog\'i', 'Krutonlar', 'Caesar sousi', 'Limon sharbati'],
        rating: 4.8,
        tags: ['Popular', 'Healthy'],
        reviews: []
    },
    {
        id: 18,
        name: 'Yunon Salati',
        price: '$9.00',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop',
        description: 'O\'rteryar dengizi ta\'mi - feta pishlog\'i, zaytun va yangi sabzavotlar.',
        ingredients: ['Pomidor', 'Bodring', 'Qizil piyoz', 'Feta pishlog\'i', 'Zaytun', 'Zaytun yog\'i'],
        rating: 4.9,
        tags: ['Healthy', 'Vegan'],
        reviews: []
    },
    {
        id: 19,
        name: 'Tovuqli Salat',
        price: '$10.99',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?q=80&w=1000&auto=format&fit=crop',
        description: 'Panjara tovuq go\'shti, yangi sabzavotlar va aromatli sous bilan to\'yimli salat.',
        ingredients: ['Panjara tovuq', 'Salat barglari', 'Pomidor cheri', 'Bodring', 'Ranch sousi'],
        rating: 4.8,
        reviews: []
    },
    {
        id: 20,
        name: 'Avokado Salat',
        price: '$11.50',
        originalPrice: '$14.00',
        discountLabel: '-18% OFF',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop',
        description: 'Kremsi avokado, yangi sabzavotlar va limon-zaytun yog\'i dressingi bilan.',
        ingredients: ['Avokado', 'Arugula', 'Pomidor cheri', 'Qizil piyoz', 'Limon', 'Zaytun yog\'i'],
        rating: 4.9,
        isPremium: true,
        reviews: []
    },
    {
        id: 21,
        name: 'Baliqli Salat',
        price: '$12.99',
        category: 'SALADS',
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1000&auto=format&fit=crop',
        description: 'Dengiz mahsulotlari sevuvchilar uchun - qovurilgan losos bilan Premium salat.',
        ingredients: ['Losos baliq', 'Salat barglari', 'Avokado', 'Bodring', 'Limon', 'Dill'],
        rating: 5.0,
        isPremium: true,
        reviews: []
    },
    {
        id: 15,
        name: 'Premium Burger',
        price: '$12.00',
        originalPrice: '$16.00',
        discountLabel: '-25% OFF',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
        description: 'Haqiqiy mol go\'shti, yangi sabzavotlar va bizning maxsus sousimiz bilan tayyorlangan shohona lazzat.',
        ingredients: ['100% Halol Go\'sht', 'Yangi Pishirilgan Bulka', 'Maxsus Siri-Sous'],
        rating: 5.0,
        isPremium: true,
        reviews: []
    },
    {
        id: 40,
        name: 'Chocolate Lava Cake',
        price: '$6.50',
        category: 'DESSERTS',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop',
        description: 'Issiq va kremsi shokoladli lava keki. Muzqaymoq bilan ajoyib kombinatsiya.',
        ingredients: ['Belgiya shokoladi', 'Saryog\'', 'Tuxum', 'Shakar'],
        rating: 4.9,
        reviews: []
    },
    {
        id: 41,
        name: 'Strawberry Cheesecake',
        price: '$7.00',
        category: 'DESSERTS',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
        description: 'Yumshoq pishloqli kek va yangi qulupnayli qayla.',
        ingredients: ['Pishloq', 'Qulupnay', 'Pechenye asosi'],
        rating: 4.8,
        reviews: []
    },
    {
        id: 42,
        name: 'Tiramisu',
        price: '$6.00',
        category: 'DESSERTS',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop',
        description: 'Klassik italyancha desert. Kofe va maskarpone pishlog\'i bilan.',
        ingredients: ['Maskarpone', 'Espresso', 'Savoyardi pechenyesi'],
        rating: 4.7,
        reviews: []
    },
    {
        id: 43,
        name: 'Belgian Waffles',
        price: '$8.00',
        category: 'DESSERTS',
        image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop',
        description: 'Qarsildoq vafli, asal va mevalar bilan.',
        ingredients: ['Vafli', 'Asal', 'Mevalar', 'Qaymoq'],
        rating: 4.9,
        reviews: []
    }
];

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('bsb_products');
        if (saved) {
            try {
                const savedProducts = JSON.parse(saved);
                const savedIds = savedProducts.map(p => p.id);
                // Faqat yangi (kodga qo'shilgan) mahsulotlarni qo'shamiz, mavjudlarini o'zgartirmaymiz
                const newInitialProducts = initialProducts.filter(p => !savedIds.includes(p.id));
                return [...savedProducts, ...newInitialProducts];
            } catch (e) {
                console.error("Error loading products:", e);
                return initialProducts;
            }
        }
        return initialProducts;
    });

    useEffect(() => {
        localStorage.setItem('bsb_products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now(), reviews: [], rating: 5 }]);
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addReview = (productId, review) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const newReviews = [...(p.reviews || []), { ...review, id: Date.now() }];
                const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
                return { ...p, reviews: newReviews, rating: avgRating };
            }
            return p;
        }));
    };

    return (
        <ProductContext.Provider value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            addReview
        }}>
            {children}
        </ProductContext.Provider>
    );
};
