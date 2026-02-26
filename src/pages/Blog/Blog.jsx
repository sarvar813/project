import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import './Blog.css';

const blogPosts = [
    {
        id: 1,
        title: 'Qarsildoq va suvli: Eng zo\'r burgerni siri nimada?',
        date: '6 Fevral, 2026',
        author: 'Chef Ali',
        category: 'Recipes',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
        excerpt: 'Burgerni tishlaganda uning ta\'mi va qarsildoq bulkasi birgalikda mukammal uyg\'unlikni yaratishi kerak...',
        content: `Mukammal burger tayyorlash uchun eng avvalo go'sht sifatiga e'tibor berish lozim. Biz BLACK STAR BURGER'da faqat 100% yangi mol go'shtidan foydalanamiz. 
        
        Ikkinchi muhim sir - bu pishirish harorati. Go'sht ochiq olovda pishirilganda o'zining suvligini saqlab qoladi. 
        
        Va nihoyat, bizning maxsus sousimiz! Bu sous o'nlab ziravorlar aralashmasidan tayyorlanadi va burgerni butunlay boshqa darajaga olib chiqadi.`
    },
    {
        id: 2,
        title: 'Yangi ochilgan filialimizga tashrif buyuring',
        date: '4 Fevral, 2026',
        author: 'Admin',
        category: 'News',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop',
        excerpt: 'Toshkent shahrining markazida BLACK STAR BURGER restoranining yangi, zamonaviy filiali ish boshladi...',
        content: `Biz kengayishda davom etmoqdamiz! Toshkent shahrining muhtasham tumanlaridan birida yangi BLACK STAR BURGER filialimiz o'z eshiklarini ochdi. 
        
        Yangi restoran zamonaviy dizayn, keng zal va bolalar o'yingohiga ega. Bu yerda siz oilangiz va do'stlaringiz bilan mazali taomlardan bahramand bo'lishingiz mumkin. 
        
        Ochilish munosabati bilan barcha mijozlarimizga maxsus chegirmalar tayyorlaganmiz. Kutib qolamiz!`
    },
    {
        id: 3,
        title: 'Fast-food taomlari va salomatlik: Bizning yondashuv',
        date: '1 Fevral, 2026',
        author: 'Nutristionist',
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
        excerpt: 'Biz faqatgina eng yangi mahsulotlardan foydalanamiz, shuning uchun bizning taomlarimiz nafaqat mazali, balki sifatli ham...',
        content: `Ko'pchilik fast-food sog'liq uchun zararli deb hisoblaydi. Bizning vazifamiz esa bu fikrni o'zgartirish. 
        
        BLACK STAR BURGER'da biz har bir masalliqni sinchkovlik bilan tanlaymiz. Bizning sabzavotlarimiz har kuni ertalab daladan keltiriladi. Biz trans-yog'lardan foydalanmaymiz va barcha taomlarimizni gigenik qoidalarga to'liq amal qilgan holda tayyorlaymiz. 
        
        Sifatli masalliq - haqiqiy ta'm garovidir!`
    }
];

const Blog = () => {
    const [selectedPost, setSelectedPost] = useState(null);

    const openPost = (post) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden';
    };

    const closePost = () => {
        setSelectedPost(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="blog-page">
            <div className="blog-hero">
                <h1>BIZNING BLOG</h1>
                <p>Eng so'nggi yangiliklar va mazali sirlar</p>
            </div>

            <div className="container">
                <div className="blog-grid">
                    {blogPosts.map(post => (
                        <div key={post.id} className="blog-card">
                            <div className="post-image" onClick={() => openPost(post)}>
                                <img src={post.image} alt={post.title} />
                                <span className="post-category">{post.category}</span>
                            </div>
                            <div className="post-content">
                                <div className="post-meta">
                                    <span>{post.date}</span> • <span>{post.author}</span>
                                </div>
                                <h2 className="post-title" onClick={() => openPost(post)}>{post.title}</h2>
                                <p className="post-excerpt">{post.excerpt}</p>
                                <button className="read-more" onClick={() => openPost(post)}>Batafsil ma'lumot</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blog Modal */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={closePost}>
                    <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="blog-modal-close" onClick={closePost}>
                            <FaTimes />
                        </button>

                        <div className="blog-modal-image">
                            <img src={selectedPost.image} alt={selectedPost.title} />
                        </div>

                        <div className="blog-modal-body">
                            <div className="blog-modal-meta">
                                <span><FaCalendarAlt /> {selectedPost.date}</span>
                                <span><FaUser /> {selectedPost.author}</span>
                                <span><FaTag /> {selectedPost.category}</span>
                            </div>
                            <h2 className="blog-modal-title">{selectedPost.title}</h2>
                            <div className="blog-modal-text">
                                {selectedPost.content.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
