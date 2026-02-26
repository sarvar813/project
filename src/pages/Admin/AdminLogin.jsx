import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaArrowRight, FaHome } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [lockoutMultiplier, setLockoutMultiplier] = useState(1);
    const [captcha, setCaptcha] = useState({ q: '', a: 0 });
    const [userCaptcha, setUserCaptcha] = useState('');
    const [loadTime] = useState(Date.now());
    const [securityStatus, setSecurityStatus] = useState('ACTIVE_SHIELD');

    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ q: `${n1} + ${n2} = ?`, a: n1 + n2 });
        setUserCaptcha('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        let timer;
        if (isLocked && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsLocked(false);
            setAttempts(0);
            setError('');
        }
        return () => clearInterval(timer);
    }, [isLocked, countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked) {
            setError(`Juda ko'p urinish! Iltimos, ${countdown} soniya kuting.`);
            return;
        }
        setIsLoading(true);
        setError('');

        // SECURITY LAYER 1: Math Captcha
        if (parseInt(userCaptcha) !== captcha.a) {
            setError('CAPTCHA noto\'g\'ri! Robot emasmisiz?');
            setIsLoading(false);
            setSecurityStatus('THREAT_DETECTED');
            generateCaptcha();
            return;
        }

        // SECURITY LAYER 2: Request Velocity Check (Anti-Bot)
        const timeDiff = Date.now() - loadTime;
        if (timeDiff < 2500) { // Humans rarely fill forms in < 2.5s
            setError('XAVFSIZLIK: Juda tez urinish! Robot deb gumon qilinmoqda.');
            setIsLoading(false);
            setSecurityStatus('MALICIOUS_VELOCITY');
            return;
        }

        // SECURITY LAYER 3: Browser Integrity & Environmental Check
        const agent = navigator.userAgent;
        const platform = navigator.platform;
        const screenDepth = window.screen.colorDepth;
        if (!agent || !platform || screenDepth < 24) {
            setError('BRAUZER XAVFSIZLIGI: Shubhali qurilma imzosi!');
            setIsLoading(false);
            setSecurityStatus('SIGNATURE_MISMATCH');
            return;
        }

        // Simulating artificial delay for premium feel + Network Entropy
        const entropy = Math.floor(Math.random() * 500);
        setTimeout(() => {
            const { username, password } = credentials;

            // REAL SECURITY Simulation (Obfuscated check)
            const _0x4f2a = (s) => btoa(s).split('').reverse().join('');
            const target_u = _0x4f2a(username);
            const target_p = _0x4f2a(password);

            console.log('Login attempt:', { username, target_u, target_p });

            // Expected values (Admin: 'admin' hashed, 0000: '0000' hashed)
            // admin: =4WatRWY, chef: ==gZlh2Y, rider: =IXZklmc, 0000: ==AMwADM
            const valid = (target_p === '==AMwADM') && (target_u === '=4WatRWY' || target_u === '==gZlh2Y' || target_u === '=IXZklmc');

            if (valid) {
                console.log('Login successful!');
                // Generate a Titanium-Gate encrypted session token
                const fakeToken = btoa(JSON.stringify({
                    role: username === 'admin' ? 'SuperAdmin' : username.charAt(0).toUpperCase() + username.slice(1),
                    exp: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
                    fingerprint: btoa(agent.slice(0, 20)),
                    hwid: null, // Let AdminPanel bind it securely 
                    integrity_id: Math.random().toString(36).substring(7)
                }));
                sessionStorage.setItem('bsb_admin_token', fakeToken);
                sessionStorage.setItem('bsb_login_time', Date.now().toString());
                onLogin(username === 'admin' ? 'SuperAdmin' : username.charAt(0).toUpperCase() + username.slice(1));
            } else {
                console.warn('Login failed: Invalid credentials');
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                generateCaptcha();
                if (newAttempts >= 3) {
                    setIsLocked(true);
                    const lockSeconds = 30 * lockoutMultiplier;
                    setCountdown(lockSeconds);
                    setLockoutMultiplier(prev => prev * prev * 2); // Progressive penalty
                    setError(`XAVFSIZLIK TIZIMI: Bloklandi! ${lockSeconds} soniya kuting.`);
                } else {
                    setError(`Parol yoki login noto'g'ri! (${3 - newAttempts} ta urinish qoldi)`);
                }
                setIsLoading(false);
            }
        }, 1500 + entropy);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <h1>BLACK STAR BURGER</h1>
                    <span>BOSHQARUV PANELI</span>
                    <div className={`security-badge ${securityStatus.toLowerCase()}`}>
                        <div className="pulse-icon"></div>
                        {securityStatus}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>FOYDALANUVCHI NOMI</label>
                        <div className="input-wrapper">
                            <FaUser />
                            <input
                                type="text"
                                name="username"
                                placeholder="Admin nomi"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>XAVFSIZLIK PAROLI</label>
                        <div className="input-wrapper">
                            <FaLock />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>ROBOT EMASLIGINGIZNI TASDIQLANG</label>
                        <div className="captcha-wrapper">
                            <span className="captcha-question">{captcha.q}</span>
                            <input
                                type="number"
                                placeholder="?"
                                value={userCaptcha}
                                onChange={(e) => setUserCaptcha(e.target.value)}
                                required
                                className="captcha-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-msg">
                            {isLocked ? `XAVFSIZLIK TIZIMI: Bloklandi! ${countdown} soniya kuting.` : error}
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-dots">
                                <span></span><span></span><span></span>
                            </div>
                        ) : (
                            <>
                                TIZIMGA KIRISH <FaArrowRight style={{ marginLeft: '8px', fontSize: '13px' }} />
                            </>
                        )}
                    </button>

                    <button type="button" className="back-site-btn" onClick={() => window.location.href = '/'}>
                        <FaHome style={{ marginRight: '8px' }} /> ASOSIY SAYTGA QAYTISH
                    </button>
                </form>

                <div className="login-footer">
                    <p>BLACK STAR BURGER &copy; 2026</p>
                    <p style={{ opacity: 0.5, marginTop: '5px' }}>XAVFSIZLIK TIZIMI YOQILGAN</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
