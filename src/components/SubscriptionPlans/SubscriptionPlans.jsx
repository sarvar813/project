import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaCrown, FaBolt, FaStar, FaFire, FaTimes, FaPhoneAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './SubscriptionPlans.css';

const SubscriptionModal = ({ plan, onClose, onSubmit }) => {
    const { telegramSettings } = useCart();
    const [phone, setPhone] = React.useState('+998');
    const [loading, setLoading] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [step, setStep] = React.useState('phone'); // 'phone' or 'code'
    const [generatedCode, setGeneratedCode] = React.useState('');
    const [userCode, setUserCode] = React.useState('');
    const [info, setInfo] = React.useState('');

    const sendVerification = async () => {
        if (phone.length < 13) return;
        setLoading(true);
        setInfo("Kutilmoqda...");
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);

        const backendUrls = ['http://127.0.0.1:8000', 'http://localhost:8000'];
        let success = false;

        for (const baseUrl of backendUrls) {
            try {
                const res = await fetch(`${baseUrl}/send-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: phone,
                        code: code,
                        bot_token: telegramSettings.botToken
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.telegram_user === 'sent') {
                        setInfo("Tasdiqlash kodi Telegram botingizga yuborildi! 📲");
                    } else if (data.telegram_user === 'error') {
                        setInfo("Telegram API bilan bog'lanishda xatolik yuz berdi. ❌");
                    } else {
                        setInfo(
                            <div className="v-error-info">
                                <p>Raqamingiz botda topilmadi. Kodni olish uchun:</p>
                                <ol>
                                    <li><a href={`https://t.me/${telegramSettings.botUsername}?start=verify`} target="_blank" rel="noreferrer">@{(telegramSettings.botUsername || 'blackstar_burger_bot')}</a> botiga kiring.</li>
                                    <li><b>"📞 Raqamni yuborish"</b> tugmasini bosing.</li>
                                    <li>Bot sizga kodni beradi, keyin esa shu yerga kiriting.</li>
                                </ol>
                            </div>
                        );
                    }
                    setStep('code');
                    success = true;
                    break;
                }
            } catch (e) {
                console.warn(`Failed to connect to ${baseUrl}, trying next...`);
            }
        }

        if (!success) {
            alert("Backend serverga bog'lanib bo'lmadi! Iltimos, backend ishlayotganini tekshiring.");
        }
        setLoading(false);
    };

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        if (userCode !== generatedCode) {
            alert("Noto'g'ri kod! Iltimos qaytadan tekshiring.");
            return;
        }

        setLoading(true);
        await onSubmit(phone);
        setLoading(false);
        setSubmitted(true);
        setTimeout(onClose, 4000);
    };

    return (
        <motion.div
            className="sub-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="sub-modal-content"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                onClick={e => e.stopPropagation()}
            >
                <button className="close-modal" onClick={onClose}><FaTimes /></button>

                {!submitted ? (
                    <>
                        <div className="modal-icon" style={{ color: 'var(--secondary-color)' }}>
                            {plan.icon}
                        </div>
                        <h3>Get {plan.name}</h3>
                        <p className="modal-desc">Reja: <strong>{plan.duration}</strong> - <strong>${plan.price}</strong></p>

                        {step === 'phone' ? (
                            <div className="sub-v-form">
                                <div className="input-group">
                                    <FaPhoneAlt className="input-icon" />
                                    <input
                                        type="tel"
                                        placeholder="Telefon raqamingiz"
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.startsWith('+998')) {
                                                const digitsOnly = val.substring(4).replace(/\D/g, '');
                                                if (digitsOnly.length <= 9) {
                                                    setPhone('+998' + digitsOnly);
                                                }
                                            } else if (val.length < 4) {
                                                setPhone('+998');
                                            }
                                        }}
                                    />
                                </div>
                                <button onClick={sendVerification} className="modal-submit-btn" disabled={loading || phone.length < 13}>
                                    {loading ? 'Yuborilmoqda...' : 'TASDIQLASH KODINI OLISH'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleVerifyAndSubmit} className="sub-v-form">
                                <p className="step-info">{info}</p>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="4 xonali kod"
                                        maxLength="4"
                                        className="code-input-center"
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                                <button type="submit" className="modal-submit-btn" disabled={loading || userCode.length < 4}>
                                    {loading ? 'Tekshirilmoqda...' : 'TASDIQLASH VA SOTIB OLISH'}
                                </button>
                                <button type="button" className="back-btn-link" onClick={() => setStep('phone')}>Raqamni o'zgartirish</button>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="success-message">
                        <div className="success-icon">✅</div>
                        <h3>Muvaffaqiyatli!</h3>
                        <p>Sizning <b>{plan.name}</b> uchun so'rovingiz qabul qilindi.</p>
                        <p className="hint-text">Tez orada kuryer siz bilan bog'lanib to'lovni tasdiqlaydi.</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const SubscriptionPlans = () => {
    const { telegramSettings } = useCart();
    const [selectedPlan, setSelectedPlan] = React.useState(null);

    const handlePurchase = async (phone) => {
        const { botToken, chatId } = telegramSettings;
        console.log('Sending subscription request for:', phone);

        const message = `💎 <b>YANGI ABONEMENT SO'ROVI!</b>\n\n👤 <b>Mijoz:</b> ${phone}\n💳 <b>Plan:</b> ${selectedPlan.name}\n⏳ <b>Muddati:</b> ${selectedPlan.duration}\n💰 <b>Narxi:</b> $${selectedPlan.price}\n🎁 <b>Sovg'a:</b> ${selectedPlan.gift}\n\n<i></i>`;

        // 1. Save to backend for Admin Panel (Primary)
        try {
            const res = await fetch('http://127.0.0.1:8000/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    plan_name: selectedPlan.name,
                    duration: selectedPlan.duration,
                    price: selectedPlan.price,
                    gift: selectedPlan.gift
                })
            });
            if (res.ok) console.log('Successfully saved to backend');
            else console.error('Backend save failed:', res.status);
        } catch (err) {
            console.error('Failed to connect to backend:', err);
        }

        // 2. Send to Telegram directly (Secondary)
        if (botToken && chatId) {
            try {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
                });
                console.log('Telegram notification sent');
            } catch (err) {
                console.error('Telegram send failed:', err);
            }
        } else {
            console.warn('Telegram settings not configured, skipping TG notification');
        }
    };

    const plans = [
        {
            id: 1,
            name: 'Lite Pass',
            duration: '1 OY',
            price: '9.99',
            gift: 'Free Drink always, 10% Discount, Standard Delivery',
            icon: <FaBolt />,
            features: ['Free Drink always', '10% Discount', 'Standard Delivery'],
            popular: false
        },
        {
            id: 2,
            name: 'Standard Pass',
            duration: '3 OY',
            price: '24.99',
            gift: 'Free Fries & Drink, 15% Discount, Priority Support, No Service Fee',
            icon: <FaStar />,
            features: ['Free Fries & Drink', '15% Discount', 'Priority Support', 'No Service Fee'],
            popular: true
        },
        {
            id: 3,
            name: 'Premium Pass',
            duration: '6 OY',
            price: '45.99',
            gift: 'HAR BUYURTMADA TEKIN ICHIMLIK + OYIGA 1 TA BURGER',
            icon: <FaFire />,
            features: ['Free Drink always', '1 Free Burger Monthly', '20% Discount', 'Always Free Delivery'],
            popular: false
        },
        {
            id: 4,
            name: 'Legendary Pass',
            duration: '12 OY',
            price: '79.99',
            gift: 'Free Fries & Drink always, 1 Free Combo Monthly, 25% Discount, VIP Support',
            icon: <FaCrown />,
            features: ['Free Fries & Drink always', '1 Free Combo Monthly', '25% Discount', 'VIP Support'],
            popular: false
        }
    ];

    return (
        <section className="subscription-plans-section">
            <div className="container">
                <div className="plans-header">
                    <motion.h3
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-badge"
                    >
                        EXCLUSIVE MEMBERSHIP
                    </motion.h3>
                    <h2 className="section-title">CHOOSE YOUR <span>SUBSCRIPTION</span></h2>
                    <p className="section-desc">Join the Black Star Legends and get exclusive gifts with every single order.</p>
                </div>

                <div className="plans-grid">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            className={`plan-card ${plan.popular ? 'popular' : ''}`}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            {plan.popular && <div className="popular-tag">MOST POPULAR</div>}
                            <div className="plan-icon">{plan.icon}</div>
                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="plan-duration">{plan.duration}</div>

                            <div className="plan-price">
                                <span className="currency">$</span>
                                <span className="amount">{plan.price}</span>
                            </div>

                            <div className="plan-gift">
                                <span className="gift-label">GIFT:</span>
                                <p>{plan.gift}</p>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx}><FaCheck className="check-icon" /> {feature}</li>
                                ))}
                            </ul>

                            <button
                                className="select-plan-btn"
                                onClick={() => setSelectedPlan(plan)}
                            >
                                CHOOSE PLAN +
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedPlan && (
                <SubscriptionModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                    onSubmit={handlePurchase}
                />
            )}
        </section>
    );
};

export default SubscriptionPlans;
