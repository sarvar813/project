import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaTimes, FaHistory, FaHeart, FaTrash, FaUserCircle, FaSun, FaMoon, FaGlobe, FaShieldAlt, FaSignOutAlt, FaBolt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';
import { useProducts } from '../../context/ProductContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount, setIsCartOpen, orders, addToCart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { products } = useProducts();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOrdersHistoryOpen, setIsOrdersHistoryOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const searchSuggestions = searchQuery.trim()
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    const handleLogout = () => {
        if (window.confirm(t('navbar.logout_confirm', 'Haqiqatan ham chiqmoqchimisiz?'))) {
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn');
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <nav className="navbar">
            {isOrdersHistoryOpen && (
                <div className="orders-history-overlay" onClick={() => setIsOrdersHistoryOpen(false)}>
                    <div className="orders-history-content" onClick={(e) => e.stopPropagation()}>
                        <div className="history-header">
                            <h3>{t('navbar.my_orders', 'Mening buyurtmalarim')}</h3>
                            <button onClick={() => setIsOrdersHistoryOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="history-list">
                            {orders.length === 0 ? (
                                <p className="no-orders text-center py-4">{t('navbar.no_orders', 'Sizda hali buyurtmalar yo\'q')}</p>
                            ) : (
                                orders.slice(0, 5).map((order, idx) => (
                                    <div key={idx} className="history-item" onClick={() => {
                                        window.dispatchEvent(new CustomEvent('open-receipt', { detail: order }));
                                        setIsOrdersHistoryOpen(false);
                                    }}>
                                        <div className="h-info">
                                            <span className="h-id">#{order.orderId}</span>
                                            <span className="h-date">{order.date.split(',')[0]}</span>
                                        </div>
                                        <div className="h-status">
                                            <span className={`status-dot ${order.status}`}></span>
                                            {order.status === 'pending' ? t('navbar.statuses.pending', 'Kutilmoqda') :
                                                order.status === 'preparing' ? t('navbar.statuses.preparing', 'Tayyorlanmoqda') :
                                                    order.status === 'shipping' ? t('navbar.statuses.shipping', 'Yo\'lda') :
                                                        order.status === 'completed' ? t('navbar.statuses.completed', 'Bajarildi') : t('navbar.statuses.cancelled', 'Bekor qilindi')}
                                        </div>
                                        <div className="h-total">${order.total.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Wishlist Overlay */}
            {isWishlistOpen && (
                <div className="orders-history-overlay" onClick={() => setIsWishlistOpen(false)}>
                    <div className="orders-history-content wishlist-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="history-header">
                            <h3>{t('navbar.wishlist', 'Saralanganlar')} ({wishlistItems.length})</h3>
                            <button onClick={() => setIsWishlistOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="history-list">
                            {wishlistItems.length === 0 ? (
                                <div className="no-items">
                                    <FaHeart style={{ fontSize: '40px', color: '#eee', marginBottom: '15px' }} />
                                    <p>{t('navbar.wishlist_empty', 'Saralangan mahsulotlar hozircha yo\'q')}</p>
                                    <button className="empty-close-btn" onClick={() => setIsWishlistOpen(false)}>
                                        CHIQISH
                                    </button>
                                </div>
                            ) : (
                                wishlistItems.map((item) => (
                                    <div key={item.id} className="wishlist-overlay-item">
                                        <div className="wi-left">
                                            <img src={item.image} alt={item.name} />
                                            <div className="wi-details">
                                                <h4>{item.name}</h4>
                                                <span>{item.price}</span>
                                            </div>
                                        </div>
                                        <div className="wi-actions">
                                            <button className="wi-cart" onClick={() => {
                                                addToCart(item);
                                                // removeFromWishlist(item.id); // Option: keep in wishlist? Let's keep for now.
                                            }}>
                                                <FaShoppingCart />
                                            </button>
                                            <button className="wi-remove" onClick={() => removeFromWishlist(item.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            <div className={`search-overlay ${isSearchOpen ? 'open' : ''}`} onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
            }}>
                <div className="search-content" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                        }
                    }}>
                        <input
                            name="search"
                            type="text"
                            placeholder={t('navbar.search_placeholder', 'Mahsulotlarni qidirish...')}
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="button" className="close-search" onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                        }}>
                            <FaTimes />
                        </button>
                    </form>

                    {searchSuggestions.length > 0 && (
                        <div className="search-suggestions">
                            {searchSuggestions.map(item => (
                                <div
                                    key={item.id}
                                    className="suggestion-item"
                                    onClick={() => {
                                        navigate(`/menu?search=${encodeURIComponent(item.name)}`);
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <div className="s-info">
                                        <span className="s-name">{item.name}</span>
                                        <span className="s-price">{item.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="logo">
                        <h1 className="logo-text">BLACK STAR BURGER</h1>
                        <h1 className="logo-text secondary">BLACK STAR BURGER</h1>
                    </Link>

                    <div className={`nav-links-wrapper ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                        <ul className="nav-links" onClick={(e) => e.stopPropagation()}>
                            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.home')}</Link></li>
                            <li><Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.menu')}</Link></li>
                            <li><Link to="/#booking" onClick={() => setIsMobileMenuOpen(false)}>RESERVATION</Link></li>
                            <li><Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>BLOG</Link></li>
                            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link></li>
                            <li><Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.gallery')}</Link></li>
                            <li><Link to="/build-burger" className={location.pathname === '/build-burger' ? 'active' : ''} style={{ fontWeight: 800 }} onClick={() => setIsMobileMenuOpen(false)}>🍔 CONSTRUCTOR</Link></li>
                        </ul>
                    </div>

                    <div className="nav-actions">
                        <div className="nav-icons">
                            <Link to="/admin" className="admin-icon" title="Admin Panel" target="_blank" rel="noopener noreferrer">
                                <FaShieldAlt />
                            </Link>
                            <Link to="/profile" className="profile-icon" title="Mening profilim">
                                <FaUserCircle />
                            </Link>
                            <button className="theme-toggle-btn" onClick={toggleTheme} title="Mavzuni o'zgartirish">
                                {theme === 'light' ? <FaMoon /> : theme === 'dark' ? <FaSun /> : <FaBolt style={{ color: '#ff00ff' }} />}
                            </button>
                            <button className="wishlist-icon" onClick={() => setIsWishlistOpen(true)} title={t('navbar.wishlist_title', 'Saralanganlar')}>
                                <FaHeart />
                                {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
                            </button>
                            <button className="cart-icon" onClick={() => setIsCartOpen(true)}>
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </button>
                            <button className="search-icon" onClick={() => setIsSearchOpen(true)}>
                                <FaSearch />
                            </button>
                            <button className="exit-icon" onClick={handleLogout} title={t('navbar.logout', 'Chiqish')}>
                                <FaSignOutAlt />
                            </button>
                            <div className="language-selector">
                                <button className="lang-btn">
                                    <FaGlobe />
                                    <span>{i18n.language.toUpperCase()}</span>
                                </button>
                                <div className="lang-dropdown">
                                    <button onClick={() => i18n.changeLanguage('uz')}>UZ</button>
                                    <button onClick={() => i18n.changeLanguage('ru')}>RU</button>
                                    <button onClick={() => i18n.changeLanguage('en')}>EN</button>
                                </div>
                            </div>
                        </div>
                        <button className="quick-order-btn" onClick={() => setIsCartOpen(true)}>{t('navbar.shopping')}</button>

                        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <FaTimes /> : (
                                <div className="hamburger">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
