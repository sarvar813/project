import React, { createContext, useState, useContext, useEffect } from 'react';
import { launchConfetti } from '../utils/confetti';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const toast = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('bsb_orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });
    const [isStoreOpen, setIsStoreOpen] = useState(() => {
        const saved = localStorage.getItem('bsb_store_status');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [bonuses, setBonuses] = useState(() => {
        const saved = localStorage.getItem('bsb_bonuses');
        return saved ? parseFloat(saved) : 0;
    });

    const sounds = {
        cartAdd: 'https://assets.mixkit.co/active_storage/sfx/611/611-preview.mp3',
        success: 'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3',
        error: 'https://assets.mixkit.co/active_storage/sfx/2361/2361-preview.mp3',
        click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
        pop: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3'
    };

    const playUXSound = (soundType) => {
        const audio = new Audio(sounds[soundType] || sounds.click);
        audio.volume = 0.4;
        audio.play().catch(e => console.log('Audio blocked', e));
    };
    const [useBonuses, setUseBonuses] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(5);
    const [surgeMultiplier, setSurgeMultiplier] = useState(1);
    const [isSurgeActive, setIsSurgeActive] = useState(false);
    const [userStats, setUserStats] = useState(() => {
        const saved = localStorage.getItem('bsb_user_stats');
        return saved ? JSON.parse(saved) : { totalOrders: 0, level: 'BRONZE' };
    });

    const [auditLogs, setAuditLogs] = useState(() => {
        const saved = localStorage.getItem('bsb_audit_logs');
        return saved ? JSON.parse(saved) : [];
    });

    const [siteSettings, setSiteSettings] = useState(() => {
        const saved = localStorage.getItem('bsb_site_settings');
        return saved ? JSON.parse(saved) : {
            bannerText: "Bugun barcha burgerlarga 50% chegirma!",
            bannerImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
            primaryColor: "#e30034",
            isBannerActive: true
        };
    });

    const [careerApplications, setCareerApplications] = useState(() => {
        const saved = localStorage.getItem('bsb_career_apps');
        return saved ? JSON.parse(saved) : [];
    });

    const [staff, setStaff] = useState(() => {
        const saved = localStorage.getItem('bsb_staff');
        return saved ? JSON.parse(saved) : [
            { id: 101, name: "Dostonvok", role: "Chef", joined: "2024-01-15", status: "active" },
            { id: 102, name: "Madina", role: "Admin", joined: "2024-02-01", status: "active" },
            { id: 103, name: "Aziz", role: "Chef", joined: "2024-03-10", status: "vacation" }
        ];
    });

    const [coupons, setCoupons] = useState(() => {
        const saved = localStorage.getItem('bsb_coupons');
        return saved ? JSON.parse(saved) : [
            { code: 'NEW2026', discount: '20%', status: 'active' },
            { code: 'BSB50', discount: '50%', status: 'active' },
            { code: 'ALIBEK', discount: '10%', status: 'active' }
        ];
    });

    const [rewards, setRewards] = useState(() => {
        const saved = localStorage.getItem('bsb_rewards');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Tekin Coca-Cola', points: 500, status: 'active' },
            { id: 2, name: 'Tekin Fri', points: 800, status: 'active' },
            { id: 3, name: 'Black Burger', points: 1500, status: 'active' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('bsb_career_apps', JSON.stringify(careerApplications));
    }, [careerApplications]);

    useEffect(() => {
        localStorage.setItem('bsb_staff', JSON.stringify(staff));
    }, [staff]);

    useEffect(() => {
        localStorage.setItem('bsb_coupons', JSON.stringify(coupons));
    }, [coupons]);

    useEffect(() => {
        localStorage.setItem('bsb_rewards', JSON.stringify(rewards));
    }, [rewards]);

    const addStaff = (member) => {
        setStaff(prev => [...prev, { ...member, id: Date.now(), joined: new Date().toISOString().split('T')[0], status: 'active' }]);
        toast.success("Yangi xodim qo'shildi! 👨‍🍳");
    };

    const deleteStaff = (id) => {
        setStaff(prev => prev.filter(s => s.id !== id));
        toast.error("Xodim tizimdan o'chirildi.");
    };

    const updateStaff = (id, updatedData) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
        toast.info("Xodim ma'lumotlari yangilandi.");
    };

    const addCoupon = (coupon) => {
        setCoupons(prev => [...prev, { ...coupon, status: 'active' }]);
        toast.success("Yangi promokod yaratildi! 🎫");
    };

    const deleteCoupon = (code) => {
        setCoupons(prev => prev.filter(c => c.code !== code));
        toast.warning("Promokod o'chirildi.");
    };

    const addReward = (reward) => {
        setRewards(prev => [...prev, { ...reward, id: Date.now(), status: 'active' }]);
        toast.success("Yangi sovg'a qo'shildi! 🎁");
    };

    const deleteReward = (id) => {
        setRewards(prev => prev.filter(r => r.id !== id));
        toast.error("Sovg'a olib tashlandi.");
    };

    const submitCareerApplication = (appData) => {
        const newApp = { ...appData, id: Date.now(), status: 'pending', date: new Date().toLocaleString() };
        setCareerApplications(prev => [newApp, ...prev]);

        // Send Telegram Notification
        const { botToken, chatId } = telegramSettings;
        if (botToken && chatId) {
            const msg = `🧑‍🍳 <b>YANGI XODIM ARIZASI!</b>\n\n👤 Ism: ${appData.name}\n📞 Tel: ${appData.phone}\n💼 Lavozim: ${appData.jobTitle}\n📄 Tajriba: ${appData.resume}\n\n<i>Admin panelda ko'rib chiqishingiz mumkin.</i>`;
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
            });
        }
    };

    const handleCareerAction = (id, action) => {
        const app = careerApplications.find(a => a.id === id);

        if (action === 'delete') {
            setCareerApplications(prev => {
                const updated = prev.filter(a => String(a.id) !== String(id));
                localStorage.setItem('bsb_career_apps', JSON.stringify(updated));
                return updated;
            });
            return;
        }

        // Send Notification to Admin/User via Telegram
        const { botToken, chatId } = telegramSettings;
        if (botToken && chatId && app) {
            let msg = '';
            if (action === 'accepted') {
                msg = `✅ <b>TABRIKLAYMIZ!</b>\n\n👤 Nomzod: ${app.name}\n📞 Tel: ${app.phone}\n💼 Lavozim: ${app.jobTitle}\n\n📢 <b>Xabar:</b> Sizning arizangiz qabul qilindi! Yaqin orada ish boshlashingiz mumkin.`;
            } else if (action === 'rejected') {
                msg = `❌ <b>MA'LUMOT</b>\n\n👤 Nomzod: ${app.name}\n📞 Tel: ${app.phone}\n\n📢 <b>Xabar:</b> Afsuski, hozirgi vaqtda sizning nomzodingiz bizga ma'qul kelmadi. Kelajakda omad tilaymiz!`;
            }

            if (msg) {
                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' })
                });
            }
        }

        // Action bajarilgach ro'yxatdan o'chirish (Toza saqlash uchun)
        setCareerApplications(prev => {
            const updated = prev.filter(a => String(a.id) !== String(id));
            localStorage.setItem('bsb_career_apps', JSON.stringify(updated));
            return updated;
        });
    };

    const logAction = (admin, action, details) => {
        const newLog = {
            id: Date.now(),
            admin,
            action,
            details,
            time: new Date().toLocaleString()
        };
        setAuditLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
    };

    useEffect(() => {
        localStorage.setItem('bsb_audit_logs', JSON.stringify(auditLogs));
    }, [auditLogs]);

    useEffect(() => {
        localStorage.setItem('bsb_site_settings', JSON.stringify(siteSettings));
    }, [siteSettings]);

    const [lastAutoHour, setLastAutoHour] = useState(new Date().getHours());

    useEffect(() => {
        localStorage.setItem('bsb_bonuses', bonuses.toString());
    }, [bonuses]);

    useEffect(() => {
        localStorage.setItem('bsb_store_status', JSON.stringify(isStoreOpen));
    }, [isStoreOpen]);

    useEffect(() => {
        localStorage.setItem('bsb_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('bsb_user_stats', JSON.stringify(userStats));
    }, [userStats]);

    // Avtomatik va Manual yopish/ochish logikasi
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();

            // Faqat soat almashganda (Transition) avtomatik ishlaydi
            if (hour !== lastAutoHour) {
                if (hour === 23) {
                    setIsStoreOpen(false); // Soat 23:00 da yopiladi
                } else if (hour === 9) {
                    setIsStoreOpen(true); // Soat 09:00 da ochiladi
                }
                setLastAutoHour(hour);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 30000); // Har 30 soniyada tekshirish
        return () => clearInterval(interval);
    }, [lastAutoHour, isStoreOpen]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'bsb_orders') {
                setOrders(JSON.parse(e.newValue));
            }
            if (e.key === 'bsb_store_status') {
                setIsStoreOpen(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = (product) => {
        playUXSound('cartAdd');
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const [telegramSettings, setTelegramSettings] = useState(() => {
        const saved = localStorage.getItem('bsb_tg_settings');
        const defaults = {
            botToken: '', // Telegram bot token removed for security (use environment variables)
            chatId: '',
            botUsername: 'blackstar_burger_bot'
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });

    useEffect(() => {
        localStorage.setItem('bsb_tg_settings', JSON.stringify(telegramSettings));
    }, [telegramSettings]);

    const sendTelegramNotification = (orderData) => {
        const { botToken, chatId } = telegramSettings;
        if (!botToken || !chatId) return;

        const itemsList = orderData.items.map(item => `- ${item.name} x${item.quantity}`).join('\n');
        const message = `🔔 YANGI BUYURTMA!\n\n🆔 ID: #${orderData.orderId}\n👤 Mijoz: ${orderData.customer}\n📞 Tel: ${orderData.phone}\n📍 Manzil: ${orderData.address}\n\n📦 Mahsulotlar:\n${itemsList}\n\n💰 Jam: $${orderData.total.toFixed(2)}\n📅 Sana: ${orderData.date}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
        }).catch(err => console.error('Telegram notification failed:', err));
    };

    const sendVerificationCode = async (phone, code) => {
        const { botToken, chatId } = telegramSettings;
        const message = `🔐 Tasdiqlash kodingiz: ${code}`;
        const eskizSettings = JSON.parse(localStorage.getItem('bsb_eskiz_settings') || '{}');

        const sendToTelegramFallback = () => {
            const fallbackMessage = `🔐 <b>TASDIQLASH KODI</b>\n\n📱 Tel: ${phone}\n🔢 Kod: <code>${code}</code>\n\n<i>Mijozga: ${message}</i>`;
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: fallbackMessage, parse_mode: 'HTML' })
            }).catch(e => console.error('Telegram fallback failed:', e));

            toast.warning("SMS tizimida muammo! Kodni Telegram botimizdan olishingiz mumkin.", 6000);
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone,
                    code: code,
                    message: message,
                    bot_token: botToken,
                    chat_id: chatId,
                    email: eskizSettings.email,
                    password: eskizSettings.password
                })
            });

            const result = await response.json();
            if (result.sms !== 'sent') {
                console.warn('SMS failed, using Telegram fallback:', result.sms);
                sendToTelegramFallback();
            } else {
                toast.success("SMS muvaffaqiyatli yuborildi! ✅");
            }
        } catch (err) {
            console.error('Network error during verification, using Telegram fallback:', err);
            sendToTelegramFallback();
        }
    };

    const sendCustomerNotification = async (phone, text) => {
        const { botToken } = telegramSettings;
        try {
            await fetch('http://127.0.0.1:8000/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, text, bot_token: botToken })
            });
        } catch (err) {
            console.error('Customer notification failed:', err);
        }
    };

    const placeOrder = (orderData) => {
        setOrders(prevOrders => [orderData, ...prevOrders]);

        // If bonuses were used, subtract them
        if (useBonuses) {
            setBonuses(prev => Math.max(0, prev - bonusToUse));
            setUseBonuses(false);
        }

        // Celebrate!
        if (orderData.status !== 'cancelled') {
            playUXSound('success');
            launchConfetti();
        }
    };

    // Order status notifications effect
    useEffect(() => {
        if (orders.length === 0) return;

        const lastStatuses = JSON.parse(localStorage.getItem('bsb_last_notified') || '{}');
        const newNotified = { ...lastStatuses };
        let changed = false;

        orders.forEach(order => {
            const orderId = String(order.orderId);
            const currentStatus = order.status;

            if (lastStatuses[orderId] !== currentStatus) {
                let statusMsg = "";
                if (currentStatus === 'preparing') {
                    statusMsg = `🛒 <b>BUYURTMANGIZ QABUL QILINDI!</b>\n\n🆔 ID: #${orderId}\n💰 Jami: $${order.total.toFixed(2)}\n\n👨‍🍳 Taomingiz tayyorlanishni boshladi. Yoqimli ishtaha!`;
                }
                else if (currentStatus === 'shipping') statusMsg = `🛵 Buyurtmangiz #${orderId} yo'lga chiqdi! Kuryerni kuting.`;
                else if (currentStatus === 'completed') statusMsg = `BUYURTMANGIZ YETKAZIB BERILDI!\n\nXaridingiz uchun rahmat! Yoqimli ishtaha!`;
                else if (currentStatus === 'cancelled') statusMsg = `❌ Afsuski, buyurtmangiz #${orderId} bekor qilindi.`;

                if (statusMsg) {
                    sendCustomerNotification(order.phone, statusMsg);
                    changed = true;
                }
                newNotified[orderId] = currentStatus;
            }
        });

        if (changed) {
            localStorage.setItem('bsb_last_notified', JSON.stringify(newNotified));
        }
    }, [orders]);

    // Surge Pricing Logic
    useEffect(() => {
        const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
        if (activeOrders >= 10) {
            setSurgeMultiplier(1.5);
            setIsSurgeActive(true);
        } else if (activeOrders >= 5) {
            setSurgeMultiplier(1.2);
            setIsSurgeActive(true);
        } else {
            setSurgeMultiplier(1);
            setIsSurgeActive(false);
        }
    }, [orders]);

    const getRecommendedItems = (currentCart) => {
        // Logic to suggest items missing in cart
        const categories = currentCart.map(item => item.category);
        const recommendations = [];

        if (!categories.includes('DRINKS')) {
            recommendations.push({ id: 7, name: 'Milkshake', price: '$4.50', category: 'DRINKS', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop' });
        }
        if (!categories.includes('DESSERTS')) {
            recommendations.push({ id: 40, name: 'Chocolate Lava Cake', price: '$6.50', category: 'DESSERTS', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop' });
        }
        if (!categories.includes('SIDES')) {
            recommendations.push({ id: 5, name: 'Onion Rings', price: '$5.50', category: 'SIDES', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800&auto=format&fit=crop' });
        }

        return recommendations.slice(0, 2);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(o =>
            String(o.orderId) === String(orderId) ? { ...o, status: newStatus } : o
        ));

        // Bajarilganda bonus qo'shish va VIP level yangilash
        if (newStatus === 'completed') {
            setOrders(prevOrders => {
                const order = prevOrders.find(o => String(o.orderId) === String(orderId));
                if (order) {
                    // Count burgers for loyalty stamps
                    const burgerCount = order.items
                        .filter(item => item.category === 'BURGERS')
                        .reduce((acc, item) => acc + item.quantity, 0);

                    // Update User Stats
                    setUserStats(prev => {
                        const newTotal = prev.totalOrders + 1;
                        let newLevel = 'BRONZE';
                        if (newTotal >= 15) newLevel = 'GOLD';
                        else if (newTotal >= 5) newLevel = 'SILVER';

                        // Loyalty Stamps logic (MAX 5)
                        const currentStamps = prev.loyaltyStamps || 0;
                        const newStamps = Math.min(5, currentStamps + burgerCount);

                        return { ...prev, totalOrders: newTotal, level: newLevel, loyaltyStamps: newStamps };
                    });

                    // Calculate Cashback based on Level
                    let cashbackPercent = 0.05; // Bronze
                    if (userStats.level === 'SILVER') cashbackPercent = 0.07;
                    else if (userStats.level === 'GOLD') cashbackPercent = 0.10;

                    const cashback = order.total * cashbackPercent;
                    setBonuses(prev => prev + cashback);
                }
                return prevOrders;
            });
        }

        if (newStatus === 'preparing') {
            setTimeout(() => updateOrderStatus(orderId, 'shipping'), 15000); // 15s to ship
        } else if (newStatus === 'shipping') {
            setTimeout(() => updateOrderStatus(orderId, 'completed'), 30000); // 30s to deliver
        }
    };

    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const applyCoupon = (code) => {
        const coupons = { 'NEW2026': 20, 'BSB50': 100, 'ALIBEK': 10 };
        if (coupons[code]) {
            setAppliedCoupon(code);
            setDiscount(coupons[code]);
            return { success: true, percent: coupons[code] };
        }
        return { success: false, message: 'Noto\'g\'ri promokod!' };
    };

    const cartTotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + price * item.quantity;
    }, 0);

    const discountAmount = (cartTotal * discount) / 100;
    const bonusToUse = useBonuses ? Math.min(bonuses, cartTotal - discountAmount) : 0;
    const finalDeliveryFee = deliveryFee * surgeMultiplier;
    const finalTotal = cartTotal - discountAmount - bonusToUse;

    const claimLoyaltyReward = () => {
        if (userStats.loyaltyStamps >= 5) {
            setUserStats(prev => ({ ...prev, loyaltyStamps: 0 }));
            setBonuses(prev => prev + 10); // Give $10 bonus (price of a good burger)
            launchConfetti();
            alert("Tabriklaymiz! 5 ta burger uchun sovg'a tariqasida $10 bonus balansingizga qo'shildi! 🎉");
            return true;
        }
        return false;
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const updateOrderDetails = (orderId, updates) => {
        setOrders(prevOrders => prevOrders.map(o =>
            String(o.orderId) === String(orderId) ? { ...o, ...updates } : o
        ));
    };

    return (
        <CartContext.Provider value={{
            cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart,
            updateQuantity, clearCart, cartTotal, cartCount, orders,
            placeOrder, updateOrderStatus, updateOrderDetails, sendVerificationCode, discount,
            discountAmount, finalTotal, applyCoupon, appliedCoupon,
            isStoreOpen, setIsStoreOpen, telegramSettings, setTelegramSettings,
            sendTelegramNotification, bonuses, useBonuses, setUseBonuses, bonusToUse,
            userStats, deliveryFee, setDeliveryFee, surgeMultiplier, isSurgeActive,
            getRecommendedItems, finalDeliveryFee,
            auditLogs, setAuditLogs, logAction, siteSettings, setSiteSettings,
            claimLoyaltyReward, careerApplications, submitCareerApplication, handleCareerAction,
            staff, addStaff, deleteStaff, updateStaff, setStaff,
            coupons, addCoupon, deleteCoupon, setCoupons,
            rewards, addReward, deleteReward, setRewards, playUXSound
        }}>
            {children}
        </CartContext.Provider>
    );
};
