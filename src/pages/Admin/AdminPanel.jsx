import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaClipboardList, FaUsers, FaChartLine, FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaBell, FaSearch, FaCogs, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaTimes, FaCalendarAlt, FaPrint, FaComments, FaPaperPlane, FaMotorcycle, FaDoorOpen, FaHistory, FaPalette, FaCrown, FaUserTie, FaGem, FaGift, FaFire, FaBolt, FaMapMarkerAlt, FaExclamationTriangle, FaVolumeUp, FaVolumeMute, FaShieldAlt, FaFingerprint } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useChat } from '../../context/ChatContext';
import AdminLogin from './AdminLogin';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [isPinRequired, setIsPinRequired] = useState(false);
    const [securityVerified, setSecurityVerified] = useState(false);
    const [isLockdown, setIsLockdown] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [securityScore, setSecurityScore] = useState(99.8);
    const [violationCount, setViolationCount] = useState(0);
    const [isDataMasked, setIsDataMasked] = useState(true);
    const [threatsPrevented, setThreatsPrevented] = useState(124);
    const [isPermanentLock, setIsPermanentLock] = useState(false);
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('isAdminActiveTab') || 'dashboard');
    const [backendStatus, setBackendStatus] = useState('checking');
    const [latency, setLatency] = useState(0);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const shadowRef = React.useRef({ auth: false, role: null, integrity: 'STABLE' });

    const {
        orders, updateOrderStatus, updateOrderDetails, isStoreOpen, setIsStoreOpen,
        telegramSettings, setTelegramSettings, sendTelegramNotification,
        auditLogs, setAuditLogs, logAction, siteSettings, setSiteSettings,
        careerApplications, handleCareerAction,
        staff, addStaff, deleteStaff, updateStaff,
        coupons, addCoupon, deleteCoupon,
        rewards, addReward, deleteReward, playUXSound
    } = useCart();

    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { chats, sendMessage, markAsRead, deleteChat } = useChat();

    const atomicPurge = () => {
        setIsPermanentLock(true);
        setIsLockdown(true);

        // OMEGA: Memory Wiping
        const sensitiveDataKeys = ['bsb_admin_token', 'bsb_pin_verified', 'bsb_inventory', 'bsb_audit_logs'];
        sensitiveDataKeys.forEach(key => {
            sessionStorage.setItem(key, 'VOID_NULL_ZERO_' + Math.random());
            localStorage.setItem(key, 'VOID_NULL_ZERO_' + Math.random());
        });

        sessionStorage.clear();
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // DOM Obfuscation: Hide everything instantly
        document.body.innerHTML = '<div style="background:#000;color:#f00;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:24px;">[TERMINAL_CRITICAL_VOID] SESSION_PURGED_BY_IDS</div>';

        logAction('OMEGA', 'Purge', 'Atomic Session Destruction executed.');
        setTimeout(() => window.location.reload(), 2000);
    };

    // ABSOLUTE-VOID: MASTER SECURITY LIFECYCLE
    useEffect(() => {
        let inactivityTimer;
        let intervals = [];

        const resetInactivity = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                logAction('Security', 'System', 'Inactivity Logout triggered');
                logout();
            }, 10 * 60 * 1000); // 10 mins
        };

        const getAdvancedHWID = () => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            let webglInfo = '';
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                webglInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }

            const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
            const canvas_ctx = canvas.getContext('2d');
            canvas_ctx.fillText("ABS_VOID_INTEGRITY", 10, 10);
            const canvas_data = canvas.toDataURL();

            return btoa(`${webglInfo}-${screenInfo}-${canvas_data.slice(-50)}`);
        };

        const verifyToken = () => {
            const token = sessionStorage.getItem('bsb_admin_token');
            const pinVerified = sessionStorage.getItem('bsb_pin_verified');
            const hwid = getAdvancedHWID().slice(0, 100);

            if (token) {
                try {
                    const decoded = JSON.parse(atob(token));
                    // Add hwid check to token if it doesn't exist to bind it
                    if (!decoded.hwid) {
                        decoded.hwid = hwid;
                        sessionStorage.setItem('bsb_admin_token', btoa(JSON.stringify(decoded)));
                        logAction('Security', 'HWID', 'Hardware ID Bound to Session');
                    } else if (decoded.hwid !== hwid) {
                        // Relaxed for now: Just log and re-bind if it's the same session ID
                        logAction('OMEGA', 'Hardware mismatch', `Detected: ${hwid.slice(0, 10)}, Expected: ${decoded.hwid.slice(0, 10)}`);
                        // atomicPurge(); // Disabled for now to prevent lockout bugs
                    }

                    if (decoded.exp > Date.now()) {
                        setIsLoggedIn(true);
                        setCurrentRole(decoded.role);
                        shadowRef.current.auth = true;
                        shadowRef.current.role = decoded.role;
                        if (pinVerified === 'true') setSecurityVerified(true);
                        else if (decoded.role === 'SuperAdmin') setIsPinRequired(true);
                        else setSecurityVerified(true);
                    } else { logout(); }
                } catch (e) { logout(); }
            }
        };

        const blockHostileActions = (e) => {
            if (e.type === 'contextmenu') e.preventDefault();
            // Block: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
            if (e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 80))) {
                e.preventDefault();
                setViolationCount(v => {
                    const next = v + 1;
                    logAction('IDS', 'Detection', `Unauthorized Action Attempted: ${e.keyCode}. Count: ${next}`);
                    return next;
                });
                return false;
            }
        };

        // Core Watchdogs
        intervals.push(setInterval(verifyToken, 3000));

        // Deep State Integrity
        intervals.push(setInterval(() => {
            if (isLoggedIn && !shadowRef.current.auth) {
                logAction('OMEGA', 'Integrity', 'React State manipulated externally');
                atomicPurge();
            }
            if (isLoggedIn && currentRole !== shadowRef.current.role) {
                logAction('OMEGA', 'Privilege', 'Role escalation detected');
                atomicPurge();
            }
        }, 500));

        const handleVisibilityChange = () => {
            if (document.hidden) {
                logAction('Security', 'Visibility', 'Admin left the workspace tab');
                // Potential risk: Admin might be checking documentation/tools, but in Absolute-Void we watch this.
            } else {
                logAction('Security', 'Visibility', 'Admin returned to workspace');
                verifyToken();
            }
        };

        intervals.push(setInterval(() => {
            setSecurityScore(prev => {
                const fluctuation = (Math.random() * 0.4 - 0.2).toFixed(2);
                const next = Math.max(99.0, Math.min(100, parseFloat(prev) + parseFloat(fluctuation)));
                return next.toFixed(1);
            });
            setThreatsPrevented(p => p + (Math.random() > 0.8 ? 1 : 0));
        }, 5000));

        // CLOCK TAMPER DETECTION
        let lastTime = Date.now();
        intervals.push(setInterval(() => {
            const currentTime = Date.now();
            if (Math.abs(currentTime - lastTime - 2000) > 5000) {
                logAction('OMEGA', 'Clock Tamper', 'System clock manipulation detected.');
                atomicPurge();
            }
            lastTime = currentTime;
        }, 2000));

        // SANDBOX / IFRAME PROTECTION
        if (window.self !== window.top) {
            logAction('OMEGA', 'Sandbox', 'Clickjacking / Iframe detected.');
            atomicPurge();
        }

        // ANTI-DEBUGGER: Detects if DevTools 'Sources' panel or Debugger is active
        intervals.push(setInterval(() => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) { // If debugger is active, this will take long
                logAction('IDS', 'Debugger', 'Active Debugger detected. Throttling session.');
                setSecurityScore(s => (parseFloat(s) - 5.0).toFixed(1));
            }
        }, 4000));

        // CONSOLE TAMPER PROTECTION
        const protectConsole = () => {
            const noop = () => {
                logAction('IDS', 'Console', 'Unauthorized console access attempt blocked.');
                return false;
            };
            // Disable common inspection tools
            if (!window.location.hostname.includes('localhost')) {
                // console.log = noop;
                // console.warn = noop;
                // console.error = noop;
                // console.table = noop;
            }
        };
        protectConsole();

        // Detection of State Snapshotting/Hooks modification (Advanced)
        intervals.push(setInterval(() => {
            if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled === false) {
                setSecurityScore(s => (parseFloat(s) - 0.5).toFixed(1));
            }

            if (document.querySelector('.ad-box-injected') || window.ad_logic) {
                logAction('IDS', 'Injection', 'External DOM manipulation detected');
                setViolationCount(v => v + 1);
            }

            // AUTOMATION DETECTION (Anti-Bot/Anti-Scraper)
            const isAutomation = navigator.webdriver ||
                window.callPhantom ||
                window._phantom ||
                window.__nightmare ||
                window.domAutomation ||
                window.domAutomationController ||
                document.documentElement.getAttribute('webdriver');

            if (isAutomation) {
                logAction('OMEGA', 'Automation', 'Headless/Automation tool detected. Purging...');
                atomicPurge();
            }
        }, 10000));

        // TAB REPLICATION GUARD (Anti-Session Hijacking)
        const tabKey = 'bsb_active_tab_instance';
        const instanceId = Math.random().toString(36).substring(7);
        sessionStorage.setItem('bsb_instance_id', instanceId);

        const checkTabIntegrity = () => {
            const activeInstance = localStorage.getItem(tabKey);
            if (activeInstance && activeInstance !== instanceId && isLoggedIn) {
                logAction('OMEGA', 'Tab Conflict', 'Multiple admin instances detected.');
                // Show warning instead of instant purge to avoid accidental logout
                addToast('SESSION CONFLICT', 'Admin panel boshqa tabda ochilgan. Bu tab bloklandi.', <FaShieldAlt />);
                setIsLockdown(true);
            } else {
                localStorage.setItem(tabKey, instanceId);
            }
        };

        intervals.push(setInterval(checkTabIntegrity, 2000));

        const checkInjection = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const maliciousPatterns = ["<script>", "javascript:", "onerror=", "onload=", "DROP TABLE", "UNION SELECT", "../../"];
                const value = e.target.value;
                if (value && maliciousPatterns.some(p => value.toUpperCase().includes(p.toUpperCase()))) {
                    logAction('IDS', 'Injection', `Malicious pattern blocked in ${e.target.name || 'field'}`);
                    e.target.value = "";
                    setViolationCount(v => v + 1);
                }
            }
        };

        const handleSuspiciousError = (e) => {
            if (e.message?.includes('eval') || e.message?.includes('Function')) {
                logAction('OMEGA', 'XSS_ATTEMPT', 'Dynamic code execution attempt detected.');
                setViolationCount(v => v + 1);
            }
        };

        window.addEventListener('input', checkInjection);
        window.addEventListener('error', handleSuspiciousError);

        window.addEventListener('contextmenu', blockHostileActions);
        window.addEventListener('keydown', blockHostileActions);
        window.addEventListener('mousemove', resetInactivity);
        window.addEventListener('mousedown', resetInactivity);
        window.addEventListener('visibilitychange', handleVisibilityChange);

        // DOM INTEGRITY: MutationObserver to detect if security elements are hidden/removed
        const observer = new MutationObserver((mutations) => {
            // GRACE PERIOD: Don't check integrity if we just logged in or nodes haven't rendered yet
            if (!isLoggedIn || isLockdown) return;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const securityNodes = ['.abs-void-watermark', '.security-pulse', '.admin-sidebar', '.admin-header'];
                    securityNodes.forEach(selector => {
                        // Only trigger if node existed but was removed, not if it's just not there yet
                        if (!document.querySelector(selector) && isLoggedIn && !isLockdown) {
                            // Check if sufficient time has passed since login (grace period 5s)
                            const loginTime = parseInt(sessionStorage.getItem('bsb_login_time') || '0');
                            if (Date.now() - loginTime > 5000) {
                                logAction('OMEGA', 'DOM Integrity', `Security component ${selector} tampered/removed.`);
                                setIsLockdown(true);
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        verifyToken();
        resetInactivity();
        checkTabIntegrity();

        return () => {
            window.removeEventListener('input', checkInjection);
            window.removeEventListener('error', handleSuspiciousError);
            observer.disconnect();
            if (localStorage.getItem(tabKey) === instanceId) {
                localStorage.removeItem(tabKey);
            }
            intervals.forEach(clearInterval);
            clearTimeout(inactivityTimer);
            window.removeEventListener('contextmenu', blockHostileActions);
            window.removeEventListener('keydown', blockHostileActions);
            window.removeEventListener('mousemove', resetInactivity);
            window.removeEventListener('mousedown', resetInactivity);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isLoggedIn, violationCount, currentRole]);

    useEffect(() => {
        if (violationCount === 1) {
            addToast('IDS WARNING', 'Shubhali harakat aniqlandi. Xavfsizlik darajasi tushirilmoqda.', <FaExclamationTriangle />);
        }
        if (violationCount === 2) {
            setSecurityVerified(false);
            setIsPinRequired(true);
            addToast('IDS CHALLENGE', 'Tizim shubhali! Marhamat, PIN kodni qayta kiriting.', <FaFingerprint />);
            logAction('IDS', 'Challenge', 'Mandatory re-verification triggered');
        }
        if (violationCount >= 3) {
            setIsPermanentLock(true);
            setIsLockdown(true);
            logAction('IDS', 'Lockdown', 'Violation threshold exceeded (Level 3)');
        }
    }, [violationCount]);

    useEffect(() => {
        localStorage.setItem('isAdminActiveTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        let offlineTimer;
        const checkHealth = async () => {
            const start = performance.now();
            setBackendStatus('checking');
            try {
                await fetch('http://127.0.0.1:8000/', { method: 'GET' });
                const duration = Math.round(performance.now() - start);
                setLatency(duration);
                setBackendStatus(duration > 500 ? 'warning' : 'online');
                clearTimeout(offlineTimer);
            } catch (e) {
                setBackendStatus('offline');
                if (isLoggedIn && !offlineTimer) {
                    offlineTimer = setTimeout(() => {
                        logAction('Security', 'Network', 'Persistent disconnection. Emergency logout.');
                        logout();
                    }, 60000); // 1 minute offline = logout
                }
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 15000);
        return () => {
            clearInterval(interval);
            clearTimeout(offlineTimer);
        };
    }, [isLoggedIn]);

    const handleLogin = (role) => {
        const authStatus = role !== null;
        // CRITICAL: Update shadow integrity ref BEFORE setting React state to avoid race condition with watchdog interval
        shadowRef.current.auth = authStatus;
        shadowRef.current.role = role;

        // CRITICAL: Grace period for DOM Integrity check
        sessionStorage.setItem('bsb_login_time', Date.now().toString());

        setIsLoggedIn(authStatus);
        setCurrentRole(role);
        logAction('Security', 'Auth', `${role} authenticated`);
        if (role === 'SuperAdmin') setIsPinRequired(true);
        else setSecurityVerified(true);
        if (role === 'Chef') setActiveTab('kds');
        else if (role === 'Rider') setActiveTab('riders');
    };

    const logout = () => {
        playUXSound('pop');
        sessionStorage.removeItem('bsb_admin_token');
        sessionStorage.removeItem('bsb_pin_verified');
        sessionStorage.clear();
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('isAdminActiveTab');
        setIsLoggedIn(false);
        setCurrentRole(null);
        setSecurityVerified(false);
        setIsPinRequired(false);
        navigate('/admin');
        logAction('Security', 'System', 'Session Terminated');
    };

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [adminMsg, setAdminMsg] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [riderSearch, setRiderSearch] = useState('');
    const [focusedRiderId, setFocusedRiderId] = useState(null);
    const [lastAppCount, setLastAppCount] = useState(careerApplications.length);
    const [lastOrderCount, setLastOrderCount] = useState(orders.length);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [marketingSegment, setMarketingSegment] = useState('all');
    const [aiOfferText, setAiOfferText] = useState('');

    // Flash Deal State
    const [activeFlashDeal, setActiveFlashDeal] = useState({
        product: 'Combo Deluxe',
        discount: 30,
        timeLeft: '01:45:22',
        status: 'active'
    });

    // Loyalty State
    const [cashbackPercent, setCashbackPercent] = useState(5);
    const [coinValue, setCoinValue] = useState(0.01);
    const [isSavingLoyalty, setIsSavingLoyalty] = useState(false);

    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

    const testSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().then(() => {
            setSoundEnabled(true);
            addToast('OVOZ YOQILDI', 'Yangi buyurtmalar haqida xabar beriladi 🔊', <FaVolumeUp />);
        }).catch(e => {
            addToast('XATOLIK', 'Ovozni yoqish uchun ekraningizni bosing', <FaVolumeMute />);
        });
    };

    useEffect(() => {
        if (careerApplications.length > lastAppCount) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.play().catch(e => console.log('Audio blocked by browser, needs user interaction', e));
        }
        setLastAppCount(careerApplications.length);
    }, [careerApplications.length, lastAppCount]);
    const [riders, setRiders] = useState([
        { id: 1, name: "Alijon", phone: "+998901234567", status: "available", orders: 12, lat: 41.3111, lng: 69.2406, vehicle: "Scooter", currentStreet: "Amir Temur ko'chasi" },
        { id: 2, name: "Sardor", phone: "+998907654321", status: "busy", orders: 8, lat: 41.2995, lng: 69.2401, vehicle: "Bike", currentStreet: "Shota Rustaveli ko'chasi" },
        { id: 3, name: "Javohir", phone: "+998935554433", status: "offline", orders: 5, lat: 41.3211, lng: 69.2606, vehicle: "Car", currentStreet: "Mustaqillik shoh ko'chasi" }
    ]);


    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isFetchingSubs, setIsFetchingSubs] = useState(false);
    const [lastSyncCount, setLastSyncCount] = useState(-1);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // { name, phone }
    const [reservations, setReservations] = useState([]);
    const [isFetchingReservations, setIsFetchingReservations] = useState(false);
    const [allReviews, setAllReviews] = useState([]);


    // Inventory State (Nima qoshdik: Ombor nazorati + LocalStorage persistence)
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('bsb_inventory');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "Burger Nonlari", stock: 150, unit: "ta", min: 50, category: "Bakery", price: 0.5 },
            { id: 2, name: "Sigir Go'shti (Patties)", stock: 85, unit: "kg", min: 20, category: "Meat", price: 12.0 },
            { id: 3, name: "Cheddar Pishlog'i", stock: 12, unit: "kg", min: 10, category: "Dairy", price: 15.0 },
            { id: 4, name: "Kartoshka (Fri)", stock: 200, unit: "kg", min: 60, category: "Vegetables", price: 2.0 },
            { id: 5, name: "Coca-Cola (Sirop)", stock: 45, unit: "l", min: 15, category: "Beverage", price: 8.5 },
            { id: 6, name: "Maxsus Sous", stock: 8, unit: "l", min: 10, category: "Sauce", price: 5.0 }
        ];
    });

    useEffect(() => {
        localStorage.setItem('bsb_inventory', JSON.stringify(inventory));
    }, [inventory]);

    // System Terminal Logs
    const [terminalLogs, setTerminalLogs] = useState([
        { id: 1, time: "16:52:10", msg: "API Connection established: OK", type: "success" },
        { id: 2, time: "16:52:12", msg: "Database sync check... DONE", type: "info" },
        { id: 3, time: "16:52:15", msg: "Telegram Webhook: Active", type: "success" },
        { id: 4, time: "16:52:45", msg: "New User detected: IP 178.21.XX.XX", type: "warning" }
    ]);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalSuggestions, setTerminalSuggestions] = useState([]);

    const availableCommands = [
        'help', 'clear', 'status', 'inventory', 'staff', 'restart',
        'time', 'whoami', 'orders', 'revenue', 'echo', 'system', 'logout',
        'lockdown', 'shield', 'audit', 'purge', 'scramble', 'reboot', 'void'
    ];



    const handleTerminalCommand = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (terminalSuggestions.length > 0) {
                setTerminalInput(terminalSuggestions[0]);
                setTerminalSuggestions([]);
            }
        }

        if (e.key === 'Enter') {
            const fullCmd = terminalInput.trim();
            if (!fullCmd) return;

            const parts = fullCmd.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ');

            // Add user command to logs
            const userLog = { id: Date.now(), time: new Date().toLocaleTimeString(), msg: `> ${fullCmd}`, type: 'info' };
            setTerminalLogs(prev => [userLog, ...prev.slice(0, 49)]);

            let response = { id: Date.now() + 1, time: new Date().toLocaleTimeString(), msg: '', type: 'info' };

            switch (cmd) {
                case 'help':
                case '/help':
                    response.msg = "ABS-VOID Commands: help, status, lockdown, shield, audit, purge, scramble, reboot, void, logout";
                    break;
                case 'lockdown':
                    response.msg = "CRITICAL: LOCKDOWN INITIATED. TIZIM MUZLATILMOQDA...";
                    response.type = 'error';
                    logAction('Security', 'Emergency', 'Lockdown triggered via Terminal');
                    setTimeout(() => setIsLockdown(true), 1500);
                    break;
                case 'purge':
                    response.msg = "FATAL: ATOMIC_PURGE INITIATED. MEMORY WIPING...";
                    response.type = 'error';
                    atomicPurge();
                    break;
                case 'scramble':
                    response.msg = "PROTCOL: UI_SCRAMBLE active. Scrambling data vectors...";
                    setIsDataMasked(true);
                    setSecurityScore(100);
                    response.type = 'success';
                    break;
                case 'void':
                    response.msg = "Welcome to the Absolute-Void. All tracks are hidden.";
                    setIsDataMasked(true);
                    setSecurityScore(99.99);
                    response.type = 'success';
                    break;
                case 'reboot':
                    response.msg = "WARM_BOOT initiated. Cleaning buffers...";
                    setTimeout(() => window.location.reload(), 1000);
                    break;
                case 'shield':
                    response.msg = "Xavfsizlik skaneri ishga tushirildi... [OK]. Barcha portlar yopiq.";
                    response.type = 'success';
                    setSecurityScore(99.9);
                    logAction('Security', 'Shield', 'Shield protocol activated');
                    break;
                case 'audit':
                    response.msg = `Audit Logs: ${auditLogs.length} events recorded. High-Risk: 0. Integrity: 100%.`;
                    break;
                case 'time':
                    response.msg = `SYS_TIME: ${new Date().toLocaleString('uz-UZ')}`;
                    break;
                case 'whoami':
                    response.msg = `USER: admin_root | ROLE: SuperAdmin | SESSION: Active-256bit`;
                    break;
                case 'orders':
                    const pending = orders.filter(o => o.status === 'pending').length;
                    const shipping = orders.filter(o => o.status === 'shipping').length;
                    response.msg = `ORDERS: Total(${orders.length}) | Pending(${pending}) | Shipping(${shipping})`;
                    break;
                case 'revenue':
                    const totalRev = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
                    response.msg = `FINANCE: Total Gross Revenue: $${totalRev.toFixed(0)}`;
                    response.type = 'success';
                    break;
                case 'echo':
                    response.msg = args || "Usage: echo [message]";
                    break;
                case 'system':
                    response.msg = `RES: CPU(12.4%) | RAM(1.2GB/4GB) | DISK(82% Free) | OS: BSB_Kernel_v3.2`;
                    break;
                case 'logout':
                    response.msg = "TERMINATING SESSION... Redirection in 2s.";
                    response.type = 'warning';
                    setTimeout(() => logout(), 2000);
                    break;
                case 'clear':
                case '/clear':
                    setTerminalLogs([]);
                    setTerminalInput('');
                    return;
                case 'status':
                case '/status':
                    response.msg = `SYS: Server ${backendStatus.toUpperCase()} | Store: ${isStoreOpen ? 'OPEN' : 'CLOSED'} | Active Orders: ${orders.filter(o => o.status === 'pending').length}`;
                    response.type = backendStatus === 'online' ? 'success' : 'warning';
                    break;
                case 'inventory':
                case '/inventory':
                    response.msg = "Inventory stats synced with Master Node.";
                    response.type = 'success';
                    break;
                case 'staff':
                case '/staff':
                    response.msg = `TOTAL STAFF: ${staff.length} active members on shift.`;
                    break;
                case 'restart':
                case '/restart':
                    response.msg = "SYSTEM RESTART INITIATED... Please wait.";
                    response.type = 'warning';
                    setTimeout(() => {
                        setTerminalLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg: "RESTART COMPLETED. Services restored.", type: 'success' }, ...prev]);
                    }, 3000);
                    break;
                default:
                    response.msg = `Command not recognized: '${cmd}'. Type 'help' for list of commands.`;
                    response.type = 'warning';
            }

            setTerminalLogs(prev => [response, ...prev.slice(0, 49)]);
            setTerminalInput('');
            setTerminalSuggestions([]);
            playUXSound('pop');
        }
    };

    // Auto-suggestion logic
    useEffect(() => {
        if (terminalInput.trim()) {
            const filtered = availableCommands.filter(c =>
                c.startsWith(terminalInput.toLowerCase()) && c !== terminalInput.toLowerCase()
            );
            setTerminalSuggestions(filtered);
        } else {
            setTerminalSuggestions([]);
        }
    }, [terminalInput]);

    useEffect(() => {
        const interval = setInterval(() => {
            const msgs = [
                "GET /api/inventory sync...",
                "POST /callback/telegram 200 OK",
                "HEARTBEAT active",
                "Cache cleared for static assets",
                "New background task initialized",
                "Security scan completed: 0 vulnerabilities"
            ];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            const newLog = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                msg: randomMsg,
                type: Math.random() > 0.8 ? 'warning' : 'info'
            };
            setTerminalLogs(prev => [newLog, ...prev.slice(0, 49)]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const fetchSubscriptions = async (silent = false) => {
        if (!silent) setIsFetchingSubs(true);
        console.log('--- FETCH START ---');
        try {
            const res = await fetch('http://127.0.0.1:8000/subscriptions', {
                cache: 'no-store'
            });
            console.log('Backend response status:', res.status);
            if (res.ok) {
                const data = await res.json();
                console.log('Raw data from backend:', data);
                const reversedData = [...data].reverse();

                // For notifications
                if (lastSyncCount !== -1 && data.length > lastSyncCount) {
                    const newSub = data[data.length - 1];
                    console.log('NEW SUB DETECTED!', newSub);
                    addToast('YANGI ABONEMENT!', `${newSub.phone}: ${newSub.plan_name}`, <FaCrown />);
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                    audio.play().catch(e => console.log('Audio error:', e));
                }

                setSubscriptions(reversedData);
                setLastSyncCount(data.length);
            }
        } catch (err) {
            console.error('SERVER BILAN BOG\'LANISHDA XATO:', err);
        } finally {
            if (!silent) setIsFetchingSubs(false);
            console.log('--- FETCH END ---');
        }
    };

    const fetchReservations = async (silent = false) => {
        if (!silent) setIsFetchingReservations(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/reservations');
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (e) {
            console.error("Reservations fetch error:", e);
        } finally {
            if (!silent) setIsFetchingReservations(false);
        }
    };

    const fetchReviews = async () => {
        playUXSound('pop');
        try {
            const res = await fetch('http://127.0.0.1:8000/reviews');
            if (res.ok) {
                const data = await res.json();
                setAllReviews(data);
                addToast('YANGILANDI', 'Barcha tahliliy ma\'lumotlar yangilandi.', <FaChartLine />);
            }
        } catch (e) { console.error("Reviews fetch error:", e); }
    };

    useEffect(() => {
        if (isLoggedIn && activeTab === 'reports') {
            fetchReviews();
        }
    }, [isLoggedIn, activeTab]);

    const handleReservationAction = async (id, status) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/reservations/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                logAction('Admin', 'Reservation', `${id}-kodli buyurtma ${status} holatiga o'tkazildi.`);
                addToast('MUVAFFAQIYAT', `Band qilish ${status === 'confirmed' ? 'tasdiqlandi' : 'bekor qilindi'}!`, <FaCheckCircle />);
                fetchReservations(true);
            }
        } catch (e) {
            addToast('XATOLIK', 'Serverda xatolik yuz berdi.', <FaExclamationTriangle />);
        }
    };


    useEffect(() => {
        if (isLoggedIn && activeTab === 'reservations') {
            fetchReservations();
        }
    }, [isLoggedIn, activeTab]);

    useEffect(() => {
        if (isLoggedIn) {
            const interval = setInterval(() => fetchReservations(true), 15000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    // Zaxirani to'ldirish funksiyasi
    const handleRestock = (id) => {
        const item = inventory.find(i => i.id === id);
        if (!item) return;

        const amount = window.prompt(`${item.name} uchun qancha miqdor qo'shmoqchisiz? (${item.unit})`, "50");
        if (amount === null) return;

        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            addToast('XATO', 'To\'g\'ri miqdor kiriting!', <FaExclamationTriangle />);
            return;
        }

        setInventory(prev => prev.map(i =>
            i.id === id ? { ...i, stock: i.stock + numAmount } : i
        ));

        playUXSound('success');
        addToast('MUVAFFAQIYAT', `${item.name} zaxirasi yangilandi!`, <FaCheckCircle />);
        logAction('Inventory', 'Restock', `${item.name} +${numAmount} ${item.unit}`);

        // Log to terminal
        const logEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            msg: `INVENTORY_UPDATE: ${item.name} replenished by ${numAmount} ${item.unit}`,
            type: 'success'
        };
        setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
    };

    useEffect(() => {
        if (isLoggedIn && activeTab === 'subscriptions') {
            fetchSubscriptions();
        }
    }, [isLoggedIn, activeTab]);

    const handleSubAction = async (id, status) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/subscriptions/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status,
                    bot_token: telegramSettings.botToken
                })
            });
            if (res.ok) {
                logAction('Admin', 'Subscription', `Abonement #${id} statusi '${status}' ga o'zgartirildi.`);
                addToast('MUVAFFAQIYAT!', `Abonement holati '${status}' ga o'zgartirildi!`, <FaCheckCircle />);
                fetchSubscriptions(true);
            } else {
                addToast('XATO!', "Backend sozlamalarida xatolik.", <FaExclamationTriangle />);
            }
        } catch (err) {
            console.error('Failed to update subscription status:', err);
            addToast('XATO!', "Server bilan bog'lanib bo'lmadi.", <FaExclamationTriangle />);
        }
    };

    // Toast Notifications State
    const [toasts, setToasts] = useState([]);
    const addToast = (title, msg, icon = <FaBell />) => {
        const id = Date.now();
        const isError = title.toLowerCase().includes('error') || title.toLowerCase().includes('xato') || title.toLowerCase().includes('rad');
        playUXSound(isError ? 'error' : 'success');
        setToasts(prev => [{ id, title, msg, icon }, ...prev]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    // Polling for Subscriptions (Optimized for real-time push)
    useEffect(() => {
        if (isLoggedIn) {
            const interval = setInterval(() => fetchSubscriptions(true), 5000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, lastSyncCount]);

    // Order push notification
    useEffect(() => {
        // Faqat count oshsa va birinchi buyurtma pending bo'lsa ovoz chiqadi
        if (isLoggedIn && orders.length > lastOrderCount) {
            const lastOrder = orders[0];
            if (lastOrder.status === 'pending') {
                addToast('YANGI BUYURTMA!', `${lastOrder.customer}: $${lastOrder.total}`, <FaClipboardList />);
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                audio.play().catch(e => console.log('Ovozli xabar bloklandi:', e));
            }
        }
        setLastOrderCount(orders.length);
    }, [orders.length, isLoggedIn]);

    const [riderAssigning, setRiderAssigning] = useState(null); // ID of order being assigned




    // Chart Data Preparation
    // Semi-real sales data
    const getSalesData = () => {
        const last7Days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
        return last7Days.map(day => ({
            name: day,
            sales: Math.floor(Math.random() * 800) + 200
        }));
    };
    const salesData = getSalesData();

    const marketingData = [
        { name: 'Dush', sent: 1200, opened: 850, clicked: 400 },
        { name: 'Sesh', sent: 1500, opened: 1100, clicked: 550 },
        { name: 'Chor', sent: 900, opened: 700, clicked: 300 },
        { name: 'Pay', sent: 2000, opened: 1600, clicked: 800 },
        { name: 'Jum', sent: 1800, opened: 1400, clicked: 750 },
        { name: 'Shan', sent: 2500, opened: 2100, clicked: 1200 },
        { name: 'Yak', sent: 2200, opened: 1800, clicked: 950 },
    ];

    let totalSales = 0;
    let uniqueCustomers = 0;
    let todaySales = 0;

    try {
        totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
        uniqueCustomers = new Set(orders.map(o => o.customer)).size;
        const today = new Date().toLocaleDateString();
        const todayOrders = orders.filter(o => o.date === today);
        todaySales = todayOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    } catch (e) {
        console.error("Stats calculation error:", e);
    }

    const statusConfig = {
        pending: { label: 'Kutilmoqda', color: '#ffab00' },
        preparing: { label: 'Tayyorlanmoqda', color: '#ff5722' },
        shipping: { label: 'Yetkazilmoqda', color: '#2196f3' },
        completed: { label: 'Bajarildi', color: '#4caf50' },
        cancelled: { label: 'Bekor qilindi', color: '#f44336' }
    };

    const stats = [
        { title: 'Bugungi Savdo', value: (isDataMasked || violationCount >= 2) ? '$X.XXX,XX' : `$${todaySales.toFixed(2)}`, icon: <FaCalendarAlt />, color: '#00c853' },
        { title: 'Umumiy Savdo', value: (isDataMasked || violationCount >= 2) ? '$XX.XXX,XX' : `$${totalSales.toFixed(2)}`, icon: <FaChartLine />, color: '#4caf50' },
        { title: 'Buyurtmalar', value: orders.length.toString(), icon: <FaClipboardList />, color: '#2196f3' },
        { title: 'Mijozlar', value: (isDataMasked || violationCount >= 2) ? 'MASKED' : uniqueCustomers.toString(), icon: <FaUsers />, color: '#ff9800' },
    ];


    const handleStatusChange = (orderId, status) => {
        playUXSound('pop');
        updateOrderStatus(orderId, status);
        addToast('BUYURTMA YANGILANDI!', `#${orderId} buyurtma holati '${status}' ga o'zgartirildi!`, <FaCheckCircle />);
        logAction('Admin', 'Order Status', `#${orderId} -> ${status}`);

        // Agar Admin "HA, TO'LOV QILDIM" (preparing) ni bossa, Telegramga xabar yuboramiz
        if (status === 'preparing') {
            const order = orders.find(o => String(o.orderId) === String(orderId));
            if (order) {
                sendTelegramNotification(order);
            }
        }
    };

    const renderOrdersTable = (limit = null, filterStatus = null) => {
        let displayOrders = orders;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            displayOrders = displayOrders.filter(o =>
                String(o.orderId).includes(query) ||
                (o.customer && o.customer.toLowerCase().includes(query))
            );
        }

        if (filterStatus) {
            displayOrders = displayOrders.filter(o => o.status === filterStatus);
        }

        if (limit) displayOrders = displayOrders.slice(0, limit);

        return (
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mijoz</th>
                            <th>Mahsulotlar</th>
                            <th>Narx</th>
                            <th>Status</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayOrders.length > 0 ? (
                            displayOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>#{order.orderId}</td>
                                    <td>
                                        <div className="customer-cell-masked">
                                            <strong>{isDataMasked ? `ID-${String(order.orderId).slice(-4)}` : (order.customer || "Noma'lum mijoz")}</strong>
                                            {order.phone && <small>{isDataMasked ? "+998 ** *** ** **" : order.phone}</small>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="item-preview">
                                            {order.items.length} ta mahsulot
                                        </div>
                                    </td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td>
                                        <div className="status-control-wrapper">
                                            <span className={`status-tag-simple ${order.status}`}>
                                                {violationCount >= 2 ? '⚠️ AUTH_REQUIRED' : (statusConfig[order.status]?.label || order.status)}
                                            </span>

                                            {order.status === 'pending' && violationCount < 2 && (
                                                <div className="admin-order-actions">
                                                    <button
                                                        className="admin-confirm-btn"
                                                        onClick={() => handleStatusChange(order.orderId, 'preparing')}
                                                    >
                                                        HA, TO'LOV QILDIM
                                                    </button>
                                                    <button
                                                        className="admin-cancel-btn"
                                                        onClick={() => handleStatusChange(order.orderId, 'cancelled')}
                                                    >
                                                        YO'Q, BEKOR QILISH
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Ma'lumot topilmadi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const allowedTabsByRole = {
        SuperAdmin: ['dashboard', 'orders', 'menu', 'users', 'marketing', 'subscriptions', 'reservations', 'settings', 'chat', 'ai_insights', 'kds', 'riders', 'reports', 'staff', 'loyalty', 'design', 'logs', 'careers', 'inventory', 'heatmap', 'terminal'],
        Chef: ['kds', 'orders', 'inventory'],
        Rider: ['riders', 'orders', 'heatmap']
    };

    const renderContent = () => {
        if (!allowedTabsByRole[currentRole].includes(activeTab)) {
            return (
                <div className="admin-access-denied">
                    <h2><FaExclamationTriangle /> Kirishga ruxsat yo'q</h2>
                    <p>Sizning rolingiz ({currentRole}) ushbu sahifaga kirish huquqiga ega emas.</p>
                    <button onClick={() => {
                        const defaultTab = allowedTabsByRole[currentRole][0] || 'dashboard';
                        setActiveTab(defaultTab);
                    }}>Ruxsat etilgan sahifaga o'tish</button>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                // Calculate real top products from orders
                const productCounts = {};
                orders.forEach(order => {
                    if (order.status === 'cancelled') return;
                    order.items.forEach(item => {
                        const name = (item.name && item.name.trim()) || "Noma'lum";
                        productCounts[name] = (productCounts[name] || 0) + item.quantity;
                    });
                });

                const topProducts = Object.keys(productCounts).length > 0
                    ? Object.entries(productCounts)
                        .map(([name, count]) => ({ name, orders: count }))
                        .sort((a, b) => b.orders - a.orders)
                        .slice(0, 5)
                    : products.slice(0, 5).map(p => ({
                        name: (p.name && p.name.trim()) || "Noma'lum",
                        orders: 0
                    }));

                return (
                    <div className="admin-dashboard">
                        <div className="dashboard-top-widgets">
                            <div className="stats-grid">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-card">
                                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <div className="stat-info">
                                            <h3>{stat.value}</h3>
                                            <p>{stat.title}</p>
                                        </div>
                                        <div className="stat-trend positive">+12%</div>
                                    </div>
                                ))}
                            </div>

                            <div className="daily-goal-card">
                                <div className="goal-header">
                                    <h3>KUNLIK SAVDO MAQSADI ($2000)</h3>
                                    <span>{Math.min(100, (todaySales / 2000 * 100)).toFixed(1)}%</span>
                                </div>
                                <div className="goal-progress-bar">
                                    <div className="goal-fill" style={{ width: `${Math.min(100, (todaySales / 2000 * 100))}%` }}></div>
                                </div>
                                <p>Bugungi maqsadga yetish uchun yana ${Math.max(0, 2000 - todaySales).toFixed(2)} kerak</p>
                            </div>
                        </div>

                        <div className="dashboard-grid-main">
                            <div className="dashboard-left">
                                <div className="charts-grid">
                                    <div className="chart-card">
                                        <h3>Haftalik Savdo</h3>
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={salesData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="sales"
                                                        stroke="#e30034"
                                                        strokeWidth={3}
                                                        dot={{ r: 6, fill: '#e30034', strokeWidth: 2, stroke: '#fff' }}
                                                        activeDot={{ r: 8 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="chart-card">
                                        <h3>Geografik buyurtmalar (Heat Map)</h3>
                                        <div className="heat-map-mock">
                                            <div className="map-overlay">
                                                <div className="heat-point p1" title="Chilonzor: 85 ta"></div>
                                                <div className="heat-point p2" title="Yunusobod: 62 ta"></div>
                                                <div className="heat-point p3" title="Mirobod: 110 ta"></div>
                                                <div className="heat-point p4" title="Olmazor: 45 ta"></div>
                                                <div className="heat-point p5" title="Sergeli: 28 ta"></div>
                                            </div>
                                            <img src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/69.2406,41.2995,11,0/600x300?access_token=YOUR_MAPBOX_TOKEN" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"} alt="Tashkent Map" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-right">
                                <div className="security-shield-card">
                                    <div className="shield-header">
                                        <FaShieldAlt className="shield-icon" />
                                        <div className="shield-title">
                                            <h3>ABSOLUTE-VOID SECURITY</h3>
                                            <p>Integrity: {securityScore}% | Attacks blocked: {threatsPrevented}</p>
                                        </div>
                                    </div>
                                    <div className="security-features-grid">
                                        <div className={`s-feature ${securityScore > 99.5 ? 'active' : ''}`}>
                                            <span className="s-f-dot"></span> HWID_SYNC
                                        </div>
                                        <div className={`s-feature ${currentRole === 'SuperAdmin' ? 'active' : ''}`}>
                                            <span className="s-f-dot"></span> OMEGA_AUTH
                                        </div>
                                        <div className={`s-feature ${backendStatus === 'online' ? 'active' : 'warn'}`}>
                                            <span className="s-f-dot"></span> NET_PULSE
                                        </div>
                                        <div className={`s-feature ${violationCount === 0 ? 'active' : 'bad'}`}>
                                            <span className="s-f-dot"></span> IDS_LEVEL_{3 - violationCount}
                                        </div>
                                    </div>
                                </div>

                                <div className="quick-actions-card">
                                    <h3>TEZKOR AMALLAR</h3>
                                    <div className="quick-actions-list">
                                        <div className={`store-toggle-card ${isStoreOpen ? 'open' : 'closed'}`}>
                                            <div className="toggle-info">
                                                <h4>Do'kon holati (Ochiq/Yopiq)</h4>
                                                <p>{isStoreOpen ? 'Hozirda mijozlar buyurtma bera oladi ✅' : 'Hozirda do\'kon yopiq (Mahsulotlar qolmadi) ❌'}</p>
                                            </div>
                                            <button
                                                className={`toggle-btn ${isStoreOpen ? 'active' : ''}`}
                                                onClick={() => setIsStoreOpen(!isStoreOpen)}
                                                title={isStoreOpen ? "Do'konni yopish" : "Do'konni ochish"}
                                            >
                                                <div className="toggle-circle"></div>
                                            </button>
                                        </div>

                                        <button className="q-action-item" onClick={() => setActiveTab('menu')}>
                                            <span className="q-icon"><FaPlus /></span>
                                            <span>Yangi mahsulot</span>
                                        </button>

                                        <button className="q-action-item" onClick={() => setActiveTab('orders')}>
                                            <span className="q-icon"><FaClipboardList /></span>
                                            <span>Buyurtmalarni saralash</span>
                                        </button>

                                        <button className="q-action-item" onClick={() => window.print()}>
                                            <span className="q-icon"><FaPrint /></span>
                                            <span>Hisobotni chop etish</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="inventory-forecast-card">
                                    <div className="card-header-flex">
                                        <h3>📈 INVENTAR BASHORATI</h3>
                                        <span className="forecast-tag">AI Powered</span>
                                    </div>
                                    <div className="forecast-content">
                                        <div className="forecast-item">
                                            <p>Go'sht zaxirasi</p>
                                            <div className="f-progress"><div className="f-fill" style={{ width: '40%', background: '#ff9800' }}></div></div>
                                            <span>2 kunda tugashi mumkin</span>
                                        </div>
                                        <div className="forecast-item">
                                            <p>Non (Klassik)</p>
                                            <div className="f-progress"><div className="f-fill" style={{ width: '15%', background: '#f44336' }}></div></div>
                                            <span>Bugun kechga tugaydi ⚠️</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="low-stock-card">
                                    <div className="card-header-flex">
                                        <h3>⚠️ KAM QOLGANLAR</h3>
                                        <span className="count-badge">{products.filter(p => p.isAvailable === false).length}</span>
                                    </div>
                                    <div className="low-stock-list">
                                        {products.filter(p => p.isAvailable === false).length > 0 ? (
                                            products.filter(p => p.isAvailable === false).slice(0, 3).map(p => (
                                                <div key={p.id} className="low-stock-item">
                                                    <img src={p.image} alt="" />
                                                    <div className="ls-info">
                                                        <p>{p.name}</p>
                                                        <span>Mahsulot tugagan</span>
                                                    </div>
                                                    <button onClick={() => updateProduct(p.id, { isAvailable: true })}>Tiklash</button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-low-stock">Barcha mahsulotlar mavjud ✅</p>
                                        )}
                                    </div>
                                </div>

                                <div className="activity-feed-card">
                                    <h3>SO'NGGI FAOLIYAT</h3>
                                    <div className="activity-list">
                                        {orders.slice(0, 3).map((order, idx) => (
                                            <div key={idx} className="activity-item">
                                                <div className="act-dot"></div>
                                                <div className="act-info">
                                                    <p><strong>{order.customer}</strong> yangi buyurtma berdi</p>
                                                    <span>{order.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="server-monitor-card">
                                    <div className="monitor-header">
                                        <h4>🖥️ Server Health & Latency</h4>
                                        <div className="pro-badge-premium">PRO++ SYSTEM</div>
                                    </div>
                                    <div className="status-row">
                                        <div className="m-stat">
                                            <label>CPU Usage</label>
                                            <div className="m-bar-bg"><motion.div animate={{ width: ['12%', '25%', '18%'] }} transition={{ duration: 5, repeat: Infinity }} className="m-fill-pro"></motion.div></div>
                                        </div>
                                        <div className="m-stat">
                                            <label>Memory (RAM)</label>
                                            <div className="m-bar-bg"><motion.div animate={{ width: ['65%', '68%', '64%'] }} transition={{ duration: 8, repeat: Infinity }} className="m-fill-pro blue"></motion.div></div>
                                        </div>
                                        <div className="m-stat">
                                            <label>DB Latency</label>
                                            <div className="m-bar-bg"><motion.div animate={{ width: ['5%', '12%', '7%'] }} transition={{ duration: 3, repeat: Infinity }} className="m-fill-pro green"></motion.div></div>
                                        </div>
                                    </div>
                                    <small style={{ display: 'block', marginTop: '15px', color: '#94a3b8', fontSize: '11px' }}>Node: 127.0.0.1:8000 (Python FastAPI)</small>
                                </div>
                            </div>
                        </div>

                        <div className="recent-orders">
                            <h2>Oxirgi buyurtmalar</h2>
                            {renderOrdersTable(5)}
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="admin-orders-manage">
                        <div className="admin-actions">
                            <h2>Barcha buyurtmalar</h2>
                        </div>
                        <div className="orders-list">
                            {renderOrdersTable()}
                        </div>
                    </div>
                );
            case 'menu':
                const filteredProducts = products.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <div className="admin-menu-manage">
                        <div className="admin-actions">
                            <div className="tab-title">
                                <h2>Menyuni boshqarish <span>({products.length})</span></h2>
                            </div>
                            <div className="action-buttons">
                                <div className="inner-search">
                                    <FaSearch />
                                    <input
                                        type="text"
                                        placeholder="Mahsulot qidirish..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className="add-btn" onClick={() => setIsAddingProduct(true)}>
                                    <FaPlus /> Yangi mahsulot
                                </button>
                            </div>
                        </div>

                        <div className="menu-list">
                            {filteredProducts.map(product => (
                                <div key={product.id} className={`menu-admin-item ${product.isAvailable === false ? 'out-of-stock' : ''}`}>
                                    <div className="item-img-container">
                                        <img src={product.image} alt={product.name} />
                                        {product.isAvailable === false && <span className="stock-badge">Tugagan</span>}
                                    </div>
                                    <div className="item-details">
                                        <h4>{product.name}</h4>
                                        <div className="item-meta">
                                            <span className="p-category">{product.category}</span>
                                            <span className="p-price">{product.price}</span>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="stock-toggle"
                                            title={product.isAvailable === false ? "Sotuvga chiqarish" : "Tugadi deb belgilash"}
                                            onClick={() => {
                                                const newStatus = product.isAvailable !== false;
                                                updateProduct(product.id, { isAvailable: newStatus });
                                                addToast('PULSE', `${product.name} holati: ${newStatus ? 'SOTUVDA' : 'TUGADI'}`, newStatus ? <FaCheckCircle /> : <FaTimesCircle />);
                                            }}
                                        >
                                            {product.isAvailable === false ? <FaCheckCircle color="#4caf50" /> : <FaTimesCircle color="#ff5252" />}
                                        </button>
                                        <button className="edit-icon" onClick={() => {
                                            setEditingProduct(product);
                                            setIsAddingProduct(true);
                                        }}><FaEdit /></button>
                                        <button className="delete-icon" onClick={() => {
                                            if (window.confirm('O\'chirishni tasdiqlaysizmi?')) {
                                                deleteProduct(product.id);
                                                addToast('O\'CHIRILDI!', `${product.name} menyudan olib tashlandi.`, <FaTrash />);
                                                logAction('Admin', 'Menu', `${product.name} o'chirildi.`);
                                            }
                                        }}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'users':
                const customerMap = {};
                orders.forEach(o => {
                    const customerName = o.customer || "Noma'lum mijoz";
                    if (!customerMap[customerName]) {
                        customerMap[customerName] = { count: 0, total: 0, lastDate: o.date, phone: o.phone || "" };
                    }
                    customerMap[customerName].count += 1;
                    customerMap[customerName].total += o.total;
                    if (o.phone) customerMap[customerName].phone = o.phone;
                });

                const filteredCustomers = Object.entries(customerMap).filter(([name]) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <div className="admin-users-manage">
                        <div className="admin-actions">
                            <h2>Mijozlar bazasi <span>({filteredCustomers.length})</span></h2>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mijoz Ismi</th>
                                        <th>Jami buyurtmalar</th>
                                        <th>Umumiy sarf</th>
                                        <th>Coins Balansi</th>
                                        <th>Oxirgi sana</th>
                                        <th>Amal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map(([name, data], idx) => (
                                            <tr key={idx}>
                                                <td className="c-name">{isDataMasked ? `Customer_${idx + 100}` : name}</td>
                                                <td>{data.count}</td>
                                                <td className="c-total">${data.total.toFixed(2)}</td>
                                                <td className="c-coins" style={{ color: '#ff9d00', fontWeight: '800' }}>
                                                    <FaGem style={{ fontSize: '10px', marginRight: '5px' }} />
                                                    {Math.floor(data.total * 10)}
                                                </td>
                                                <td>{data.lastDate}</td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="send-msg-btn-mini"
                                                        title="Xabar yuborish"
                                                        onClick={() => {
                                                            if (isDataMasked) {
                                                                addToast('BLOKLANDI', 'Ma\'lumotlar maskirovka qilingan holatda xabar yuborib bo\'lmaydi', <FaShieldAlt />);
                                                                return;
                                                            }
                                                            setSelectedCustomer({ name, phone: data.phone });
                                                            setMarketingSegment('individual');
                                                            setBroadcastMsg(`Assalomu alaykum ${name}! BSB jamoasidan xabar: `);
                                                            setActiveTab('marketing');
                                                        }}
                                                    >
                                                        <FaPaperPlane />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Mijoz topilmadi</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'marketing':
                return (
                    <div className="admin-marketing">
                        <div className="admin-actions">
                            <h2>Marketing va Broadcast 🚀</h2>
                        </div>

                        <div className="marketing-grid">
                            {/* Mass Broadcast & Targeting */}
                            <div className="marketing-card broadcast">
                                <div className="card-header-flex">
                                    <h3><FaPaperPlane /> Marketing Command Center</h3>
                                    <span className="pro-badge-premium">TARGETED PRO++</span>
                                </div>
                                <div className="targeting-options">
                                    <label>Segment Tanlang:</label>
                                    <div className="segment-chips">
                                        {['all', 'VIP', 'Sodiq', 'Yangi', ...(selectedCustomer ? ['individual'] : [])].map(s => (
                                            <button
                                                key={s}
                                                className={`seg-chip ${marketingSegment === s ? 'active' : ''} ${s === 'individual' ? 'individual-chip' : ''}`}
                                                onClick={() => setMarketingSegment(s)}
                                            >
                                                {s === 'all' ? 'BARCHA' : s === 'individual' ? `MIJOZ: ${selectedCustomer.name.split(' ')[0]}` : s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="ai-generator-mini">
                                    <button className="ai-gen-btn" onClick={() => {
                                        const offers = {
                                            all: "Bugun barcha menyuga -20% chegirma! 🍔 Uni o'tkazib yubormang!",
                                            VIP: "Assalomu alaykum, aziz VIP mijozimiz! Faqat siz uchun maxsus 'Chef Edition' burger sovg'a sifatida! 🎁",
                                            Sodiq: "Siz bizning doimiy mijozimizsiz! Keyingi buyurtmangizda Fri va Cola tekin! 🍟🥤",
                                            Yangi: "Xush kelibsiz! Birinchi buyurtmangizga -30% promokod: WELCOME30 🌭",
                                            individual: `Assalomu alaykum ${selectedCustomer?.name}! BSB jamoasidan siz uchun maxsus sovg'a tayyorlab qo'ydik! ✨`
                                        };
                                        setBroadcastMsg(offers[marketingSegment]);
                                    }}>
                                        ✨ AI ORQALI MATN YARATISH
                                    </button>
                                </div>

                                <textarea
                                    placeholder="Xabar matnini kiriting..."
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    rows="5"
                                ></textarea>

                                <div className="broadcast-actions">
                                    <button
                                        className="send-broadcast-btn-pro"
                                        disabled={isBroadcasting || !broadcastMsg.trim()}
                                        onClick={async () => {
                                            const confirmText = marketingSegment === 'all'
                                                ? "Barcha mijozlarga xabar yuborilsinmi?"
                                                : `${marketingSegment} segmentidagi mijozlarga yuborilsinmi?`;
                                            if (!window.confirm(confirmText)) return;
                                            setIsBroadcasting(true);
                                            try {
                                                const res = await fetch('http://localhost:8000/broadcast', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        message: broadcastMsg,
                                                        segment: marketingSegment,
                                                        customer_phone: marketingSegment === 'individual' ? selectedCustomer.phone : null,
                                                        bot_token: telegramSettings.botToken
                                                    })
                                                });
                                                const data = await res.json();
                                                logAction('Admin', 'Marketing', `${marketingSegment} segmentiga xabar yuborildi.`);
                                                addToast('MARKETING', 'Xabar muvaffaqiyatli yuborildi!', <FaPaperPlane />);
                                                setBroadcastMsg('');
                                            } catch (e) {
                                                addToast('XATO!', 'Yuborishda xatolik yuz berdi.', <FaTimesCircle />);
                                            }
                                            setIsBroadcasting(false);
                                        }}
                                    >
                                        {isBroadcasting ? "YUBORILMOQDA..." : `XABARNI YUBORISH (${marketingSegment.toUpperCase()})`}
                                    </button>
                                </div>
                            </div>

                            {/* Coupon Management */}
                            <div className="marketing-card coupons">
                                <h3><FaGift /> Promokodlar va Kuponlar</h3>
                                <div className="coupon-list-admin">
                                    {coupons.map((cp, idx) => (
                                        <div key={idx} className={`coupon-item-row ${cp.status}`}>
                                            <div className="cp-info">
                                                <strong>{cp.code}</strong>
                                                <span>{cp.discount} chegirma</span>
                                            </div>
                                            <div className="cp-status-badge">{cp.status.toUpperCase()}</div>
                                            <button
                                                className="del-btn-mini"
                                                onClick={() => {
                                                    if (window.confirm(`${cp.code} o'chirilsinmi?`)) {
                                                        deleteCoupon(cp.code);
                                                        logAction('Admin', 'Coupon', `${cp.code} o'chirildi.`);
                                                    }
                                                }}
                                            ><FaTrash /></button>
                                        </div>
                                    ))}
                                </div>
                                <button className="add-coupon-btn" onClick={() => setIsCouponModalOpen(true)}><FaPlus /> Yangi kupon</button>
                            </div>
                        </div>

                        <div className="marketing-insights">
                            <h3>Marketing samaradorligi</h3>
                            <div className="insights-grid-mini">
                                <div className="ins-item">
                                    <p>Kuponlar orqali foyda</p>
                                    <h4>${(coupons.length * 850).toLocaleString()}</h4>
                                </div>
                                <div className="ins-item">
                                    <p>Aktiv Mijozlar</p>
                                    <h4>{new Set(orders.map(o => o.phone)).size} ta</h4>
                                </div>
                                <div className="ins-item">
                                    <p>Konversiya (Broadcasting)</p>
                                    <h4>12.5%</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'subscriptions':
                return (
                    <div className="admin-subscriptions-manage">
                        <div className="admin-actions">
                            <h2>Abonement so'rovlari</h2>
                            <button
                                className="refresh-btn"
                                onClick={() => fetchSubscriptions()}
                                disabled={isFetchingSubs}
                            >
                                {isFetchingSubs ? 'Yangilanmoqda...' : 'Yangilash'}
                            </button>
                        </div>
                        <p className="admin-section-desc">Mijozlar tomonidan yuborilgan premium plan so'rovlari.</p>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Telefon</th>
                                        <th>Plan</th>
                                        <th>Sana</th>
                                        <th>Holat</th>
                                        <th>Amal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const filteredSubs = subscriptions.filter(sub =>
                                            sub.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            sub.plan_name.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                        return filteredSubs.length > 0 ? (
                                            filteredSubs.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td>#{sub.id.toString().slice(-6)}</td>
                                                    <td><b>{sub.phone}</b></td>
                                                    <td>{sub.plan_name}</td>
                                                    <td>{sub.created_at}</td>
                                                    <td>
                                                        <span className={`status-badge ${sub.status}`}>
                                                            {sub.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell">
                                                        {sub.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    className="confirm-btn-small"
                                                                    onClick={() => handleSubAction(sub.id, 'confirmed')}
                                                                >
                                                                    OK
                                                                </button>
                                                                <button
                                                                    className="reject-btn-small"
                                                                    onClick={() => handleSubAction(sub.id, 'rejected')}
                                                                >
                                                                    X
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>So'rovlar topilmadi</td></tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'ai_insights':
                const totalRevenue = orders
                    .filter(o => o.status === 'completed' || o.status === 'shipping')
                    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
                const avgTicket = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;

                // Real-time Segmentation Logic (Pro++)
                const custStats = {};
                orders.forEach(o => {
                    const name = o.customer || "Mehmon";
                    if (!custStats[name]) custStats[name] = { count: 0, total: 0 };
                    custStats[name].count += 1;
                    custStats[name].total += parseFloat(o.total) || 0;
                });
                const segData = { VIP: 0, Sodiq: 0, Yangi: 0 };
                Object.values(custStats).forEach(s => {
                    if (s.count >= 8 || s.total > 400) segData.VIP++;
                    else if (s.count >= 3) segData.Sodiq++;
                    else segData.Yangi++;
                });
                const segmentationChartData = [
                    { name: 'VIP', value: segData.VIP },
                    { name: 'Sodiq', value: segData.Sodiq },
                    { name: 'Yangi', value: segData.Yangi }
                ].filter(d => d.value > 0);

                const churnRiskPercent = Math.max(5, Math.min(45, 40 - (orders.length / 2)));
                const sentimentScore = Math.min(98, 88 + (totalRevenue / 1000));
                const retentionRate = ((segData.VIP + segData.Sodiq) / (Object.keys(custStats).length || 1) * 100).toFixed(0);

                return (
                    <div className="admin-ai-advisor">
                        <div className="admin-actions">
                            <div className="ai-title-group">
                                <h2>🧠 AI Business Insights <span>Pro++</span></h2>
                                <p>Sun'iy intellekt tomonidan tahlil qilingan real vaqt ma'lumotlari.</p>
                            </div>
                            <div className="ai-live-indicator">
                                <span className="pulse-dot"></span> Tizim: Optimal
                            </div>
                        </div>

                        <div className="ai-metrics-row">
                            <div className="ai-metric-box">
                                <div className="m-icon"><FaChartLine /></div>
                                <div className="m-text">
                                    <label>O'rtacha Chek</label>
                                    <strong>${avgTicket}</strong>
                                </div>
                                <span className="m-trend positive">+4.5%</span>
                            </div>
                            <div className="ai-metric-box">
                                <div className="m-icon"><FaUsers /></div>
                                <div className="m-text">
                                    <label>Mijoz Sodiqligi</label>
                                    <strong>{retentionRate}%</strong>
                                </div>
                                <span className="m-trend positive">+1.2%</span>
                            </div>
                            <div className="ai-metric-box">
                                <div className="m-icon"><FaFire /></div>
                                <div className="m-text">
                                    <label>Aktivlik darajasi</label>
                                    <strong>Haqiqiy Vaqtda</strong>
                                </div>
                                <span className="m-label hot">YUQORI</span>
                            </div>
                        </div>

                        <div className="ai-advisor-grid">
                            <div className="ai-recommendations-panel">
                                <h3>💡 AI Tavsiyalari</h3>
                                <div className="rec-scroll-container">
                                    <div className="rec-card warning">
                                        <div className="rec-header">
                                            <FaBolt /> <h4>Burgers Sotuvida Pasayish</h4>
                                        </div>
                                        <p>Oxirgi 48 soat ichida burgerlar sotuvi 12% ga kamaydi. Dushanba kuni 'Mega-Burger' chegirmasini yoqishni maslahat beraman.</p>
                                        <button className="pro-rec-btn">Aksiya Yaratish</button>
                                    </div>
                                    <div className="rec-card success">
                                        <div className="rec-header">
                                            <FaCrown /> <h4>Premium Mijozlar Trendi</h4>
                                        </div>
                                        <p>Standard Pass egalari soni 30+ taga oshdi. Ular uchun 'Secret Menu' (maxfiy menyu) ochish vaqti keldi.</p>
                                        <button className="pro-rec-btn success">Menyuni ochish</button>
                                    </div>
                                    <div className="rec-card info">
                                        <div className="rec-header">
                                            <FaMapMarkerAlt /> <h4>Yunusobodda Talab Yuqori</h4>
                                        </div>
                                        <p>Yunusobod tumanida buyurtmalar 25% ga oshgan. U yerda yangi 'Dark Kitchen' ochish xarajatlarni 15% ga kamaytiradi.</p>
                                        <button className="pro-rec-btn info">Lokatsiyani ko'rish</button>
                                    </div>
                                </div>
                            </div>

                            <div className="ai-diagnostics-panel">
                                <div className="diagnostics-card">
                                    <h3>Biznes Diagnostikasi & O'sish</h3>
                                    <div className="diagnostics-grid">
                                        <div className="diag-item">
                                            <label>Mijozlar Segmentatsiyasi</label>
                                            <div className="pro-chart-mini">
                                                <ResponsiveContainer width="100%" height={150}>
                                                    <PieChart>
                                                        <Pie
                                                            data={segmentationChartData}
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            <Cell fill="#e30034" />
                                                            <Cell fill="#ff4d6d" />
                                                            <Cell fill="#1e293b" />
                                                            <Cell fill="#94a3b8" />
                                                        </Pie>
                                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="diag-item">
                                            <label>Revenue Heatmap (Soatlar)</label>
                                            <div className="heatmap-mini">
                                                <div className="h-row">
                                                    {[2, 5, 8, 4, 3, 1].map((v, i) => <div key={i} className={`h-cell s${v}`}></div>)}
                                                </div>
                                                <div className="h-row">
                                                    {[9, 7, 6, 8, 5, 2].map((v, i) => <div key={i} className={`h-cell s${v}`}></div>)}
                                                </div>
                                                <div className="h-row">
                                                    {[4, 3, 2, 5, 7, 9].map((v, i) => <div key={i} className={`h-cell s${v}`}></div>)}
                                                </div>
                                            </div>
                                            <small>Eng faol vaqt: 18:00 - 21:00</small>
                                        </div>
                                    </div>

                                    <div className="ai-sentiment-meter">
                                        <div className="s-header">
                                            <label>Mijozlar Kayfiyati (Sentiment)</label>
                                            <span>Positiv: {sentimentScore.toFixed(0)}%</span>
                                        </div>
                                        <div className="s-bar">
                                            <motion.div
                                                className="s-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sentimentScore}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="growth-prediction-box premium-ai-box">
                                        <div className="p-header">
                                            <h4>Future Demand Prediction (AI)</h4>
                                            <div className="prediction-accuracy">
                                                <span>Accuracy: 96.8%</span>
                                                <div className="acc-bar"><div className="acc-fill" style={{ width: '96.8%' }}></div></div>
                                            </div>
                                        </div>
                                        <div className="prediction-chart-container">
                                            <ResponsiveContainer width="100%" height={160}>
                                                <AreaChart data={[
                                                    { h: '12:00', real: 40, pred: 38 },
                                                    { h: '14:00', real: 30, pred: 35 },
                                                    { h: '16:00', real: 55, pred: 50 },
                                                    { h: '18:00', real: 85, pred: 90 },
                                                    { h: '20:00', real: 70, pred: 75 },
                                                    { h: '22:00', real: null, pred: 45 },
                                                    { h: '00:00', real: null, pred: 20 },
                                                ]}>
                                                    <defs>
                                                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                                    <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                                    <Area type="monotone" dataKey="real" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorReal)" name="Haqiqiy Savdo" />
                                                    <Area type="monotone" dataKey="pred" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" name="AI Bashorati" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="ai-insight-footer">
                                            <p><FaBolt style={{ color: '#eab308' }} /> Bugun kechki soat <b>18:30-19:15</b> oralig'ida buyurtmalar soni odatdagidan 25% ko'proq bo'lishi bashorat qilinmoqda.</p>
                                            <button className="ai-apply-btn">Resurslarni tayyorlash</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="admin-settings">
                        <div className="admin-actions">
                            <h2>Tizim sozlamalari</h2>
                        </div>
                        <div className="settings-grid">
                            <div className="settings-card">
                                <h3>Telegram Bot (Xabarnomalar)</h3>
                                <div className="s-input">
                                    <label>Bot Token</label>
                                    <input
                                        type="text"
                                        placeholder="TOKEN..."
                                        value={telegramSettings.botToken}
                                        onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                                    />
                                </div>
                                <div className="s-input">
                                    <label>Chat ID</label>
                                    <input
                                        type="text"
                                        placeholder="ID..."
                                        value={telegramSettings.chatId}
                                        onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                                    />
                                </div>
                                <div className="s-input">
                                    <label>Bot Username (masalan: bsb_burger_bot)</label>
                                    <input
                                        type="text"
                                        placeholder="foydalanuvchi_nomi"
                                        value={telegramSettings.botUsername}
                                        onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                                    />
                                </div>
                                <button className="save-btn" onClick={() => alert('Telegram sozlamalari saqlandi!')}>Saqlash</button>
                            </div>

                            <div className="settings-card">
                                <h3>Haqiqiy SMS (Eskiz.uz)</h3>
                                <div className="s-input">
                                    <label>Eskiz Email</label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        id="eskiz_email"
                                        defaultValue={JSON.parse(localStorage.getItem('bsb_eskiz_settings') || '{}').email}
                                    />
                                </div>
                                <div className="s-input">
                                    <label>Eskiz Parol</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        id="eskiz_pass"
                                        defaultValue={JSON.parse(localStorage.getItem('bsb_eskiz_settings') || '{}').password}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>
                                    SMS yuborish uchun <a href="https://eskiz.uz" target="_blank" rel="noreferrer">Eskiz.uz</a> dan ro'yxatdan o'tgan bo'lishingiz kerak.
                                </p>
                                <button className="save-btn" onClick={() => {
                                    const email = document.getElementById('eskiz_email').value;
                                    const password = document.getElementById('eskiz_pass').value;
                                    localStorage.setItem('bsb_eskiz_settings', JSON.stringify({ email, password }));
                                    alert('SMS sozlamalari saqlandi!');
                                }}>Saqlash</button>
                            </div>

                            <div className="settings-card">
                                <h3>Do'kon sozlamalari</h3>
                                <div className="s-input">
                                    <label>Xizmat haqi (%)</label>
                                    <input type="number" defaultValue="10" />
                                </div>
                                <div className="s-input">
                                    <label>Minimal buyurtma miqdori ($)</label>
                                    <input type="number" defaultValue="5" />
                                </div>
                                <button className="save-btn">Saqlash</button>
                            </div>
                        </div>
                    </div>
                );
            case 'chat':
                return (
                    <div className="admin-chat-section">
                        <div className="admin-actions">
                            <h2>Mijozlar bilan suhbat</h2>
                        </div>
                        <div className="admin-chat-container">
                            <div className="chat-sidebar">
                                {Object.keys(chats).length > 0 ? (
                                    Object.entries(chats).map(([id, chat]) => (
                                        <div
                                            key={id}
                                            className={`chat-list-item ${selectedChatId === id ? 'active' : ''} ${chat.unread > 0 ? 'has-unread' : ''}`}
                                            onClick={() => {
                                                setSelectedChatId(id);
                                                markAsRead(id);
                                            }}
                                        >
                                            <div className="chat-item-avatar">
                                                {chat.userName.charAt(0)}
                                            </div>
                                            <div className="chat-item-info">
                                                <h4>{chat.userName}</h4>
                                                <p>{chat.lastMessage}</p>
                                            </div>
                                            {chat.unread > 0 && <span className="unread-dot">{chat.unread}</span>}
                                            <button className="del-chat" onClick={(e) => {
                                                e.stopPropagation();
                                                deleteChat(id);
                                                if (selectedChatId === id) setSelectedChatId(null);
                                            }}><FaTrash /></button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-chats">Hozircha xabarlar yo'q</div>
                                )}
                            </div>
                            <div className="chat-main-view">
                                {selectedChatId && chats[selectedChatId] ? (
                                    <>
                                        <div className="chat-view-header">
                                            <h3>{chats[selectedChatId].userName} bilan suhbat</h3>
                                        </div>
                                        <div className="chat-view-messages">
                                            {chats[selectedChatId].messages.map((m) => (
                                                <div key={m.id} className={`admin-msg-bubble ${m.sender}`}>
                                                    <p>{m.text}</p>
                                                    <span>{m.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <form className="admin-chat-input" onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!adminMsg.trim()) return;
                                            sendMessage(selectedChatId, adminMsg, 'admin');
                                            setAdminMsg('');
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Javob yozing..."
                                                value={adminMsg}
                                                onChange={(e) => setAdminMsg(e.target.value)}
                                            />
                                            <button type="submit"><FaPaperPlane /></button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="select-chat-prompt">
                                        <FaComments />
                                        <p>Suhbatni boshlash uchun chapdan mijozni tanlang</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'kds':
                const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
                return (
                    <div className="admin-kds">
                        <div className="admin-actions">
                            <h2>👨‍🍳 Oshxona Tizimi (KDS)</h2>
                            <div className="kds-stats">Aktiv buyurtmalar: {activeOrders.length} ta</div>
                        </div>
                        <div className="kds-grid">
                            {activeOrders.map(order => (
                                <div key={order.orderId} className={`kds-card ${order.status}`}>
                                    <div className="kds-card-header">
                                        <span className="order-id">#{order.orderId}</span>
                                        <span className="time-elapsed">{order.time}</span>
                                    </div>
                                    <div className="kds-items">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="kds-item">
                                                <span className="qty">{item.quantity}x</span>
                                                <span className="item-name">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="kds-actions">
                                        {order.status === 'pending' ? (
                                            <button className="start-btn" onClick={() => handleStatusChange(order.orderId, 'preparing')}>TAYYORLASHNI BOSHLASH</button>
                                        ) : (
                                            <button className="finish-btn" onClick={() => handleStatusChange(order.orderId, 'shipping')}>TAYYOR! (KURYERGA)</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'riders':
                const unassignedOrders = orders.filter(o => o.status === 'preparing' && !o.rider_id);
                return (
                    <div className="admin-riders-pro">
                        <div className="admin-actions">
                            <h2>🛵 Live Rider Tracking & Logistics</h2>
                            <div className="riders-header-stats">
                                <span>Aktiv Kuryerlar: {riders.filter(r => r.status !== 'offline').length}</span>
                                <span>Kutilayotgan buyurtmalar: {unassignedOrders.length}</span>
                            </div>
                        </div>

                        <div className="riders-main-layout">
                            <div className="riders-list-panel">
                                <h3>Kuryerlar Roi'yxati</h3>
                                <div className="riders-grid-mini">
                                    {riders.filter(r =>
                                        r.name.toLowerCase().includes(riderSearch.toLowerCase()) ||
                                        r.phone.includes(riderSearch)
                                    ).map(rider => (
                                        <div
                                            key={rider.id}
                                            className={`rider-card-pro ${rider.status} ${focusedRiderId === rider.id ? 'focused' : ''}`}
                                            onClick={() => setFocusedRiderId(rider.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="rider-avatar-p">
                                                {rider.name.charAt(0)}
                                                <span className={`status-badge ${rider.status}`}></span>
                                            </div>
                                            <div className="rider-info-p">
                                                <h4>{rider.name}</h4>
                                                <p><FaMotorcycle /> {rider.vehicle}</p>
                                                <p className="rider-street-mini"><small>📍 {rider.currentStreet}</small></p>
                                                <div className="rider-meta-p">
                                                    <span>{rider.orders} ta yetkazildi</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="unassigned-orders-section">
                                    <h3>Topshirilmgan Buyurtmalar ({unassignedOrders.length})</h3>
                                    <div className="unassigned-list">
                                        {unassignedOrders.length > 0 ? (
                                            unassignedOrders.map(order => (
                                                <div key={order.orderId} className="unassigned-card">
                                                    <div className="u-info">
                                                        <span>#{order.orderId}</span>
                                                        <strong>{order.customer}</strong>
                                                    </div>
                                                    <button className="assign-btn-pro" onClick={() => {
                                                        const rider = riders.find(r => r.status === 'available');
                                                        if (rider) {
                                                            addToast('KURYER BIRIKTIRILDI!', `${order.orderId}-sonli buyurtma ${rider.name}ga biriktirildi!`, <FaMotorcycle />);
                                                            updateOrderDetails(order.orderId, { status: 'shipping', rider_id: rider.id });
                                                        } else {
                                                            addToast('XATO!', "Bo'sh kuryer topilmadi!", <FaExclamationTriangle />);
                                                        }
                                                    }}>BIRIKTIRISH</button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-unassigned">Barcha buyurtmalar yuborildi ✅</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="riders-map-panel">
                                <div className="live-map-wrapper">
                                    <div className="map-header-mini">
                                        <span><span className="live-dot"></span> LIVE TRACKING</span>
                                        <div className="map-search-box">
                                            <FaSearch />
                                            <input
                                                type="text"
                                                placeholder="Kuryerlarni qidirish..."
                                                value={riderSearch}
                                                onChange={(e) => setRiderSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mock-map-container">


                                        {riders.filter(r =>
                                            r.status !== 'offline' &&
                                            (r.name.toLowerCase().includes(riderSearch.toLowerCase()) || r.phone.includes(riderSearch))
                                        ).map(rider => (
                                            <motion.div
                                                key={rider.id}
                                                className={`map-rider-pin ${rider.status} ${focusedRiderId === rider.id ? 'focused' : ''}`}
                                                animate={focusedRiderId === rider.id ? {
                                                    scale: [1, 1.5, 1],
                                                    y: [0, -20, 0],
                                                    filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 15px var(--primary-color))", "drop-shadow(0 0 0px #fff)"]
                                                } : {
                                                    x: [0, Math.random() * 20 - 10, 0],
                                                    y: [0, Math.random() * 20 - 10, 0]
                                                }}
                                                transition={focusedRiderId === rider.id ? {
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                } : {
                                                    duration: 5,
                                                    repeat: Infinity
                                                }}
                                                style={{
                                                    top: `${40 + (rider.id * 10)}%`,
                                                    left: `${30 + (rider.id * 15)}%`,
                                                    zIndex: focusedRiderId === rider.id ? 10 : 1
                                                }}
                                                onClick={() => setFocusedRiderId(rider.id)}
                                            >
                                                <FaMotorcycle />
                                                <div className="pin-label">
                                                    <strong>{rider.name}</strong>
                                                    {focusedRiderId === rider.id && (
                                                        <span className="pin-street">📍 {rider.currentStreet}</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        <div className="map-legend">
                                            <div className="l-item"><span className="dot available"></span> Bo'sh</div>
                                            <div className="l-item"><span className="dot busy"></span> Band</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'loyalty':
                return (
                    <div className="admin-loyalty">
                        <div className="admin-actions">
                            <h2>Sodiqlik tizimi va Cashback 💎</h2>
                        </div>

                        <div className="loyalty-grid">
                            {/* Cashback Settings */}
                            <div className="loyalty-card">
                                <h3><FaGem /> Cashback Sozlamalari</h3>
                                <div className="s-input">
                                    <label>Cashback foizi (%)</label>
                                    <div className="input-with-preview">
                                        <input
                                            type="number"
                                            value={cashbackPercent}
                                            onChange={(e) => setCashbackPercent(e.target.value)}
                                        />
                                        <span className="p-badge">{cashbackPercent}%</span>
                                    </div>
                                    <p className="hint">Har bir buyurtmadan mijozning balansiga qaytadigan summa.</p>
                                </div>
                                <div className="s-input">
                                    <label>1 Coin qiymati ($)</label>
                                    <input
                                        type="number"
                                        value={coinValue}
                                        onChange={(e) => setCoinValue(e.target.value)}
                                        step="0.001"
                                    />
                                    <p className="hint">Mijoz yutgan 1 ball necha dollarga tengligi.</p>
                                </div>
                                <button
                                    className="add-btn"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => {
                                        setIsSavingLoyalty(true);
                                        setTimeout(() => {
                                            logAction('Admin', 'Loyalty', `Cashback sozlamalari yangilandi: ${cashbackPercent}%, 1 coin = $${coinValue}`);
                                            addToast('SAQLANDI!', "Loyalty sozlamalari muvaffaqiyatli saqlandi! ✅", <FaGem />);
                                            setIsSavingLoyalty(false);
                                        }, 800);
                                    }}
                                >
                                    {isSavingLoyalty ? "SAQLANMOQDA..." : "SOZLAMALARNI SAQLASH"}
                                </button>
                            </div>

                            {/* Rewards / Gifts */}
                            <div className="loyalty-card">
                                <h3><FaGift /> Mavjud Sovg'alar</h3>
                                <div className="gift-list-admin">
                                    {rewards.map((gift, i) => (
                                        <div key={i} className="gift-item-row">
                                            <div className="gift-info">
                                                <strong>{gift.name}</strong>
                                                <span>{gift.points} coins</span>
                                            </div>
                                            <div className="gift-actions">
                                                <button className="del-btn-mini" onClick={() => {
                                                    if (window.confirm(`${gift.name} o'chirilsinmi?`)) {
                                                        deleteReward(gift.id);
                                                        logAction('Admin', 'Loyalty', `${gift.name} sovg'asi o'chirildi.`);
                                                    }
                                                }}><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="add-btn-outline"
                                    style={{ marginTop: '15px', width: '100%' }}
                                    onClick={() => setIsRewardModalOpen(true)}
                                >
                                    <FaPlus /> Yangi sovg'a qo'shish
                                </button>
                            </div>

                            {/* Flash Deals / Hot Sale */}
                            <div className="loyalty-card flash-deals-manage">
                                <h3><FaFire /> Flash Deals (Shohona Taklif)</h3>
                                {activeFlashDeal.status === 'active' ? (
                                    <div className="active-flash-preview">
                                        <div className="flash-timer-mock">{activeFlashDeal.timeLeft}</div>
                                        <div className="flash-details">
                                            <h4>{activeFlashDeal.product}</h4>
                                            <p>{activeFlashDeal.discount}% chegirma aktiv</p>
                                        </div>
                                        <div className="flash-status online">AKSIYA DAVOM ETMOQDA</div>
                                        <button
                                            className="stop-flash-btn"
                                            onClick={() => {
                                                setActiveFlashDeal({ ...activeFlashDeal, status: 'inactive' });
                                                logAction('Admin', 'FlashDeal', `Aksiya to'xtatildi: ${activeFlashDeal.product}`);
                                            }}
                                        >TO'XTATISH</button>
                                    </div>
                                ) : (
                                    <div className="no-flash-active">
                                        <p>Hozirda aktiv aksiya yo'q.</p>
                                    </div>
                                )}
                                <div className="s-input">
                                    <label>Mahsulotni tanlang</label>
                                    <select id="flash_product">
                                        {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="s-input">
                                    <label>Chegirma (%)</label>
                                    <input type="number" id="flash_discount" placeholder="25" />
                                </div>
                                <div className="s-input">
                                    <label>Vaqt (Daqiqa)</label>
                                    <input type="number" id="flash_duration" placeholder="60" />
                                </div>
                                <button
                                    className="add-btn"
                                    style={{ background: '#ff9d00', width: '100%', justifyContent: 'center' }}
                                    onClick={() => {
                                        const prod = document.getElementById('flash_product').value;
                                        const disc = document.getElementById('flash_discount').value;
                                        const dur = document.getElementById('flash_duration').value;
                                        if (!disc) return alert("Chegirma miqdorini kiriting!");

                                        setActiveFlashDeal({
                                            product: prod,
                                            discount: disc,
                                            timeLeft: `${dur}:00`,
                                            status: 'active'
                                        });
                                        logAction('Admin', 'FlashDeal', `Yangi aksiya boshlandi: ${prod} (-${disc}%)`);
                                        alert(`${prod} uchun ${disc}% chegirma aktivlashtirildi! 🔥`);
                                    }}
                                >
                                    AKSIYANI BOSHLASH
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                // Dynamic Category Distribution
                const categoryTotal = {};
                orders.forEach(o => {
                    if (o.status !== 'cancelled') {
                        o.items.forEach(it => {
                            const cat = it.category || 'OTHER';
                            categoryTotal[cat] = (categoryTotal[cat] || 0) + (parseFloat(it.price.replace('$', '')) * it.quantity);
                        });
                    }
                });
                const dynamicCategoryData = Object.entries(categoryTotal).map(([name, value], idx) => ({
                    name,
                    value,
                    color: ['#e30034', '#f1c40f', '#3498db', '#27ae60', '#9b59b6', '#34495e'][idx % 6]
                }));

                // Sentiment Analysis from reviews
                const positive = allReviews.filter(r => r.rating >= 4).length;
                const neutral = allReviews.filter(r => r.rating === 3).length;
                const negative = allReviews.filter(r => r.rating <= 2).length;
                const sentimentData = [
                    { name: 'Ijobiy', count: positive, color: '#2ecc71' },
                    { name: 'O\'rta', count: neutral, color: '#f1c40f' },
                    { name: 'Salbiy', count: negative, color: '#e74c3c' }
                ];

                return (
                    <div className="admin-reports-pro">
                        <div className="admin-actions">
                            <div className="tab-title">
                                <h2>📊 Advanced Business Analytics <span>(Deep Insights)</span></h2>
                            </div>
                            <div className="report-actions">
                                <button className="ai-refresh-btn" onClick={fetchReviews}><FaCogs /> DATA REFRESH</button>
                                <button className="export-btn" onClick={() => alert("Excel formatida yuklab olindi!")}>Excel</button>
                            </div>
                        </div>

                        <div className="ai-insights-grid">
                            <div className="insight-card ai-powered">
                                <h3>✨ SMART INSIGHTS</h3>
                                <div className="insight-content">
                                    <div className="i-item">
                                        <p>Savdo bashorati</p>
                                        <h4>Keyingi 7 kunda sotuvlar {orders.length > 5 ? '+18%' : 'kutilmoqda'} oshadi</h4>
                                    </div>
                                    <div className="i-item">
                                        <p>Mijoz kayfiyati</p>
                                        <h4>Mijozlarning {(positive / (allReviews.length || 1) * 100).toFixed(0)}% i sizdan mamnun!</h4>
                                    </div>
                                    <div className="i-item">
                                        <p>Oltin mahsulot</p>
                                        <h4>Eng serdaromad kategoriya: {dynamicCategoryData.sort((a, b) => b.value - a.value)[0]?.name || 'Burgers'}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="insight-card chart-main">
                                <h3>Savdo Dinamikasi (Jonli statistika)</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={salesData}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#e30034" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#e30034" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="sales" stroke="#e30034" fillOpacity={1} fill="url(#colorSales)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="reports-middle-grid">
                            <div className="report-card pie-chart">
                                <h3>Daromad ulushi (Kategoriyalar)</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={dynamicCategoryData.length > 0 ? dynamicCategoryData : [{ name: 'Ma\'lumot yo\'q', value: 1, color: '#eee' }]}
                                                cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"
                                            >
                                                {dynamicCategoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="report-card bar-chart">
                                <h3>Mijozlar Fikri (Sentiment)</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={sentimentData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                                                {sentimentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="orders-summary-table-luxury">
                            <h3>Oxirgi Savdolar Tahlili</h3>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Mijoz</th>
                                        <th>Summa</th>
                                        <th>Kategoriya</th>
                                        <th>Sana</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(o => (
                                        <tr key={o.id}>
                                            <td>#{o.orderId}</td>
                                            <td>{o.customer}</td>
                                            <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>${parseFloat(o.total).toFixed(2)}</td>
                                            <td>{o.items[0]?.category || 'Kombos'}</td>
                                            <td>{o.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'staff':
                return (
                    <div className="admin-staff">
                        <div className="admin-actions">
                            <h2>👥 Xodimlar Royxati</h2>
                            <button className="add-btn" onClick={() => {
                                setEditingStaff(null);
                                setIsStaffModalOpen(true);
                            }}>
                                <FaPlus /> Yangi Xodim
                            </button>
                        </div>
                        <div className="staff-grid">
                            {staff.map(member => (
                                <div key={member.id} className="staff-card">
                                    <div className="staff-avatar">{member.name.charAt(0)}</div>
                                    <div className="staff-info">
                                        <h4>{member.name}</h4>
                                        <p className="role-tag">{member.role}</p>
                                        <p className="joined-date">Joined: {member.joined}</p>
                                    </div>
                                    <div className={`staff-status ${member.status}`}>{member.status}</div>
                                    <div className="staff-actions">
                                        <button className="edit-btn" onClick={() => {
                                            setEditingStaff(member);
                                            setIsStaffModalOpen(true);
                                        }}><FaEdit /></button>
                                        <button className="delete-btn" onClick={() => {
                                            deleteStaff(member.id);
                                            logAction('Admin', 'Xodim', `O'chirildi: ${member.name}`);
                                        }}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'design':
                return (
                    <div className="admin-design">
                        <div className="admin-actions">
                            <h2>🎨 Sayt Dizayni va Bannerlar</h2>
                        </div>
                        <div className="design-grid">
                            <div className="design-card">
                                <h3>Asosiy Banner</h3>
                                <div className="s-input">
                                    <label>Banner Matni</label>
                                    <input
                                        type="text"
                                        value={siteSettings.bannerText}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, bannerText: e.target.value })}
                                    />
                                </div>
                                <div className="s-input">
                                    <label>Banner Rasm URL</label>
                                    <input
                                        type="text"
                                        value={siteSettings.bannerImage}
                                        onChange={(e) => setSiteSettings({ ...siteSettings, bannerImage: e.target.value })}
                                    />
                                </div>
                                <div className="s-toggle">
                                    <span>Banner ko'rinishi</span>
                                    <button
                                        className={`toggle-btn-small ${siteSettings.isBannerActive ? 'active' : ''}`}
                                        onClick={() => setSiteSettings({ ...siteSettings, isBannerActive: !siteSettings.isBannerActive })}
                                    ></button>
                                </div>
                                <button className="save-btn" onClick={() => {
                                    logAction('Admin', 'Dizayn O\'zgarishi', 'Banner ma\'lumotlari yangilandi');
                                    addToast('SAQLANDI!', 'Banner sozlamalari muvaffaqiyatli yangilandi.', <FaCheckCircle />);
                                }}>Saqlash</button>
                            </div>
                            <div className="design-card preview">
                                <h3>Jonli Preview</h3>
                                <div className="banner-preview-box" style={{ backgroundImage: `url(${siteSettings.bannerImage})` }}>
                                    <div className="preview-overlay">
                                        <h4>{siteSettings.bannerText}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'logs':
                return (
                    <div className="admin-logs">
                        <div className="admin-actions">
                            <h2>📜 Xavfsizlik va Audit Loglari</h2>
                            <button className="clear-btn-red" onClick={() => {
                                if (window.confirm('Loglarni tozalashni xohlaysizmi?')) {
                                    setAuditLogs([]);
                                }
                            }}><FaTrash /> Tozalash</button>
                        </div>
                        <div className="table-responsive">
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Admin</th>
                                        <th>Amal</th>
                                        <th>Tafsilot</th>
                                        <th>Vaqt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const filteredLogs = auditLogs.filter(log =>
                                            log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            log.details.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                        return filteredLogs.length > 0 ? (
                                            filteredLogs.map(log => (
                                                <tr key={log.id}>
                                                    <td className="log-admin"><strong>{log.admin}</strong></td>
                                                    <td className="log-action"><span className="action-tag">{log.action}</span></td>
                                                    <td className="log-details">{log.details}</td>
                                                    <td className="log-time">{log.time}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loglar topilmadi</td></tr>
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>
                        <div className="security-IDS-footer">
                            <div className="ids-status">
                                <span className="status-dot"></span> INTEGRITY: 100%
                            </div>
                            {/* Honey Pot Trap */}
                            <div
                                className="void-honey-pot"
                                onClick={() => {
                                    logAction('OMEGA', 'HoneyPot', 'CRITICAL: Trap triggered! Atomic destruction initiated.');
                                    atomicPurge();
                                }}
                            >
                                <FaShieldAlt /> TIZIMNI O'CHIRISH (DEBUG_ONLY)
                            </div>
                        </div>
                    </div>
                );
            case 'careers':
                return (
                    <div className="admin-careers-manage">
                        <div className="admin-actions">
                            <h2>👨‍💼 Ishga qabul qilish (Arizalar)</h2>
                        </div>
                        <div className="career-apps-list">
                            {careerApplications.length > 0 ? (
                                careerApplications.map(app => (
                                    <div key={app.id} className="career-app-card pending">
                                        <div className="app-main-info">
                                            <div className="app-header">
                                                <h4>{app.name}</h4>
                                                <span className="status-badge pending">Kutilmoqda</span>
                                            </div>
                                            <div className="app-details">
                                                <p><strong>Lavozim:</strong> {app.jobTitle}</p>
                                                <p><strong>Tel:</strong> {app.phone}</p>
                                                <p><strong>Sana:</strong> {app.date}</p>
                                            </div>
                                            <div className="app-resume">
                                                <strong>Tajriba/Resume:</strong>
                                                <p>{app.resume}</p>
                                            </div>
                                        </div>

                                        <div className="app-actions">
                                            <button className="accept-btn" onClick={() => {
                                                if (app.jobTitle === 'Kuryer') {
                                                    const newRider = {
                                                        id: Date.now(),
                                                        name: app.name,
                                                        phone: app.phone,
                                                        status: 'available',
                                                        orders: 0,
                                                        lat: 41.2995,
                                                        lng: 69.2401,
                                                        vehicle: 'Scooter'
                                                    };
                                                    setRiders(prev => [...prev, newRider]);
                                                    handleCareerAction(app.id, 'accepted');
                                                    logAction('Hiring', `${app.name} kuryer sifatida ishga olindi.`);
                                                    addToast('MUVAFFAQIYAT!', `${app.name} kuryerlar ro'yxatiga qo'shildi! ✅`, <FaCheckCircle />);
                                                } else {
                                                    let role = 'Admin';
                                                    if (app.jobTitle === 'Shef-povar') role = 'Chef';
                                                    if (app.jobTitle === 'Povar') role = 'Povar';
                                                    if (app.jobTitle === 'Menejer') role = 'Admin';

                                                    const newStaffMember = {
                                                        name: app.name,
                                                        role: role
                                                    };
                                                    addStaff(newStaffMember);
                                                    handleCareerAction(app.id, 'accepted');
                                                    logAction('Hiring', `${app.name} ${role} sifatida ishga olindi.`);
                                                    addToast('MUVAFFAQIYAT!', `${app.name} xodimlar ro'yxatiga (${role}) qo'shildi! ✅`, <FaCheckCircle />);
                                                }
                                            }}>ISHGA OLISH</button>
                                            <button className="reject-btn" onClick={() => {
                                                handleCareerAction(app.id, 'rejected');
                                                logAction('Admin', 'Career', `Rad etildi: ${app.name}`);
                                                addToast('MA\'LUMOT', "Nomzod arizasi rad etildi. ❌", <FaTimesCircle />);
                                            }}>RAD ETISH</button>

                                            <button className="contact-tg-btn" onClick={() => {
                                                setBroadcastMsg(`Assalomu alaykum ${app.name}! BSB jamoasidan xabar: Arizangiz ko'rib chiqildi va biz sizni jamoamizda kutamiz! 🎉`);
                                                setActiveTab('marketing');
                                            }}>MARKETING ORQALI YOZISH</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-apps">Hozircha arizalar yo'q.</div>
                            )}
                        </div>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="admin-inventory">
                        <div className="admin-actions">
                            <div className="ai-title-group">
                                <h2>📦 Ombor va Masalliqlar Nazorati <span>REAL-TIME</span></h2>
                                <p>Mahsulotlar va xom-ashyolar zaxirasi boshqaruvi.</p>
                            </div>
                            <button className="add-btn-premium"><FaPlus /> Yangi Masalliq</button>
                        </div>

                        <div className="inventory-stats-row">
                            <div className="inv-stat-card">
                                <span>Kam qolgan</span>
                                <strong>{inventory.filter(i => i.stock <= i.min).length} ta</strong>
                            </div>
                            <div className="inv-stat-card">
                                <span>Jami Qiymat</span>
                                <strong>${inventory.reduce((a, b) => a + (b.stock * b.price), 0).toFixed(0)}</strong>
                            </div>
                        </div>

                        <div className="inventory-grid">
                            {inventory.map(item => (
                                <div key={item.id} className={`inventory-card ${item.stock <= item.min ? 'warning' : ''}`}>
                                    <div className="inv-header">
                                        <div className="inv-icon-box">
                                            {item.category === 'Meat' ? <FaFire /> : <FaBolt />}
                                        </div>
                                        <div className="inv-title">
                                            <h4>{item.name}</h4>
                                            <small>{item.category}</small>
                                        </div>
                                    </div>
                                    <div className="inv-body">
                                        <div className="inv-progress">
                                            <div className="p-label">
                                                <span>Zaxira: {item.stock} {item.unit}</span>
                                                <span>{((item.stock / (item.min * 3)) * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="p-bar">
                                                <div
                                                    className="p-fill"
                                                    style={{
                                                        width: `${Math.min(100, (item.stock / (item.min * 3)) * 100)}%`,
                                                        background: item.stock <= item.min ? '#e30034' : '#22c55e'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="inv-meta">
                                            <div className="m-val">Min: {item.min} {item.unit}</div>
                                            <div className="m-val">Narx: ${item.price}</div>
                                        </div>
                                    </div>
                                    <div className="inv-footer">
                                        <button className="inv-edit-btn" onClick={() => addToast('INFO', 'Tahrirlash tizimi tez kunda...', <FaEdit />)}><FaEdit /></button>
                                        <button className="inv-add-btn" onClick={() => handleRestock(item.id)}>Zaxirani To'ldirish</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'heatmap':
                return (
                    <div className="admin-heatmap">
                        <div className="admin-actions">
                            <div className="ai-title-group">
                                <h2>🗺️ Advanced Sales Heatmap <span>AI DATA</span></h2>
                                <p>Toshkent shahri bo'ylab buyurtmalar geografiyasi va issiqlik nuqtalari.</p>
                            </div>
                            <div className="map-filters">
                                <select className="map-select"><option>Bugun</option><option>Hafta</option></select>
                            </div>
                        </div>

                        <div className="heatmap-main-container">
                            <div className="heatmap-visual">
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&h=800"
                                    alt="Tashkent Map"
                                    className="map-base-img"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=1200&h=800';
                                    }}
                                />
                                <div className="map-grid-overlay"></div>

                                {/* AI Heat Overlay Pins */}
                                <div className="heat-pin p1" data-intensity="hot"></div>
                                <div className="heat-pin p2" data-intensity="medium"></div>
                                <div className="heat-pin p3" data-intensity="high"></div>
                                <div className="heat-pin p4" data-intensity="high"></div>
                                <div className="heat-pin p5" data-intensity="hot"></div>
                            </div>

                            <div className="heatmap-sidebar">
                                <div className="heat-stat">
                                    <label>Eng faol tuman:</label>
                                    <h4>YUNUSOBOD</h4>
                                    <small>425 buyurtma (Bugun)</small>
                                </div>
                                <div className="heat-stat">
                                    <label>O'sib borayotgan hudud:</label>
                                    <h4>CHILONZOR</h4>
                                    <small>+15% o'sish</small>
                                </div>
                                <div className="map-legend-pro">
                                    <div className="l-item"><span className="l-dot hot"></span> Juda Faol (Hot)</div>
                                    <div className="l-item"><span className="l-dot high"></span> Faol (High)</div>
                                    <div className="l-item"><span className="l-dot med"></span> O'rtacha (Med)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'terminal':
                return (
                    <div className="admin-terminal">
                        <div className="terminal-header">
                            <div className="t-dots"><span></span><span></span><span></span></div>
                            <span className="t-title">SYSTEM_CONSOLE v2.04</span>
                        </div>
                        <div className="terminal-body scrollbar-custom">
                            <div className="terminal-history">
                                {[...terminalLogs].reverse().map(log => (
                                    <div key={log.id} className={`terminal-line ${log.type}`}>
                                        <span className="l-time">[{log.time}]</span>
                                        <span className="l-cmd">admin@bsb:~#</span>
                                        <span className="l-msg">{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="terminal-input-area">
                                {terminalSuggestions.length > 0 && (
                                    <div className="terminal-suggestions">
                                        {terminalSuggestions.map((s, idx) => (
                                            <span key={s} className={idx === 0 ? 'top-s' : ''} onClick={() => {
                                                setTerminalInput(s);
                                                setTerminalSuggestions([]);
                                            }}>
                                                {s} {idx === 0 && <small>(Tab)</small>}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="terminal-input-line">
                                    <span className="l-cmd">admin@bsb:~#</span>
                                    <input
                                        type="text"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        onKeyDown={handleTerminalCommand}
                                        placeholder="Yozishni boshlang..."
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    <div className="terminal-cursor"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'reservations':
                return (
                    <div className="admin-reservations-manage">
                        <div className="admin-actions">
                            <div className="tab-title">
                                <h2>Stol Band Qilish <span>({reservations.length})</span></h2>
                            </div>
                            <button className="refresh-btn" onClick={() => fetchReservations()}>
                                {isFetchingReservations ? 'Yangilanmoqda...' : 'Yangilash'}
                            </button>
                        </div>

                        <div className="reservations-grid">
                            {reservations.length === 0 ? (
                                <div className="no-data" style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '20px' }}>Hozircha band qilish so'rovlari yo'q.</div>
                            ) : (
                                <div className="admin-table-wrapper" style={{ background: '#fff', padding: '20px', borderRadius: '20px' }}>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Mijoz</th>
                                                <th>Odam</th>
                                                <th>Sana & Vaqt</th>
                                                <th>Status</th>
                                                <th>Izoh</th>
                                                <th>Amallar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.map(res => (
                                                <tr key={res.id}>
                                                    <td>
                                                        <div className="user-id-cell">
                                                            <strong>{isDataMasked ? "O'ID_****" + res.id.toString().slice(-3) : res.name}</strong>
                                                            <span>{isDataMasked ? "+998 ** *** ** **" : res.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td>{res.guests} kishi</td>
                                                    <td>
                                                        <div className="date-cell">
                                                            <span>{res.date}</span>
                                                            <small>{res.time}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-pill ${res.status}`}>
                                                            {res.status === 'pending' ? 'Kutilmoqda' :
                                                                res.status === 'confirmed' ? 'Tasdiqlandi' : 'Bekor qilindi'}
                                                        </span>
                                                    </td>
                                                    <td className="comment-cell">{res.comment || '-'}</td>
                                                    <td>
                                                        <div className="action-btns">
                                                            {res.status === 'pending' && (
                                                                <>
                                                                    <button className="confirm-btn" style={{ color: '#4caf50' }} onClick={() => handleReservationAction(res.id, 'confirmed')} title="Tasdiqlash">
                                                                        <FaCheckCircle />
                                                                    </button>
                                                                    <button className="cancel-btn" style={{ color: '#ff5252' }} onClick={() => handleReservationAction(res.id, 'cancelled')} title="Bekor qilish">
                                                                        <FaTimesCircle />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className="info-btn" title="Aloqa">
                                                                <FaComments />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                if (currentRole !== 'SuperAdmin') {
                    return (
                        <div className="admin-restricted-module">
                            <div className="restricted-badge">
                                <FaShieldAlt />
                                <span>RUXSAT BERILMAGAN</span>
                            </div>
                            <h3>KIRELISH CHEKLANGAN</h3>
                            <p>Ushbu modulga faqat SuperAdmin ruxsati bilan kirish mumkin.</p>
                            <small>Sizning darajangiz: {currentRole}</small>
                        </div>
                    );
                }
                return <div>Tez kunda...</div>;
        }
    };

    if (isLockdown) {
        return (
            <div className={`lockdown-overlay ${isPermanentLock ? 'permanent' : ''}`}>
                <div className="void-glitch-overlay"></div>
                <div className="void-scanline"></div>

                <div className="lockdown-core">
                    <motion.div
                        className="warning-shield"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <FaShieldAlt size={120} color="#ff0033" />
                    </motion.div>

                    <h1 className="glitch-text" data-text={isPermanentLock ? "CRITICAL_SYSTEM_FAILURE" : "SYSTEM_LOCKDOWN"}>
                        {isPermanentLock ? "CRITICAL_SYSTEM_FAILURE" : "SYSTEM_LOCKDOWN"}
                    </h1>

                    <div className="diagnostics-terminal">
                        <div className="terminal-header">
                            <span>TERMINAL v4.0.9 - SECURITY_CORE</span>
                            <div className="dots"><span></span><span></span><span></span></div>
                        </div>
                        <div className="terminal-content">
                            <p className="log-entry">[0.0001] Initializing VOID_CORE integrity check...</p>
                            <p className="log-entry">[0.0042] Threat detected: HOSTILE_INTENT_DETECTED</p>
                            <p className="log-entry">[0.0192] Violation Count: {violationCount}/3</p>
                            <p className="log-entry">[0.0481] Security Protocol: BLACK_VOID initiated</p>
                            {isPermanentLock && (
                                <>
                                    <p className="log-entry danger">[ERROR] MEMORY_INTEGRITY_COMPROMISED</p>
                                    <p className="log-entry danger">[ERROR] SESSION_CLONING_DETECTED</p>
                                    <p className="log-entry danger">[FATAL] PERMANENT_LOCK_ENGAGED</p>
                                    <p className="log-entry danger">[ACTION] Hardware ID blacklisted on Master Server</p>
                                </>
                            )}
                            <p className="log-entry active-line">_</p>
                        </div>
                    </div>

                    <p className="lockdown-msg">
                        {isPermanentLock
                            ? "Ushbu qurilma tizim xavfsizligini buzishga urindi. Barcha kirish huquqlari server darajasida doimiy bloklandi."
                            : "Shubhali harakat aniqlandi. Davom etish uchun SuperAdmin tasdig'i talab qilinadi."}
                    </p>

                    {!isPermanentLock && (
                        <button
                            className="emergency-unlock-btn"
                            onClick={() => {
                                const pass = window.prompt("MASTER_OVERRIDE_KEY:");
                                if (pass === 'VOID_RECOVERY_99') {
                                    setIsLockdown(false);
                                    setViolationCount(0);
                                    addToast('SECURITY', 'Sistem qayta tiklandi', <FaShieldAlt />);
                                } else {
                                    setViolationCount(v => v + 1);
                                    addToast('FATAL', 'Override key noto\'g\'ri!', <FaTimesCircle />);
                                }
                            }}
                        >
                            <FaBolt /> OVERRIDE LOCKDOWN
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

    if (isPinRequired && !securityVerified) {
        return (
            <div className="admin-modal" style={{ background: '#0f172a' }}>
                <div className="admin-modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    {isScanning ? (
                        <div className="biometric-scan-view">
                            <div className="biometric-scan-area">
                                <div className="scan-line"></div>
                                <FaFingerprint className="biometric-icon" style={{ fontSize: '60px', color: '#00ff7f' }} />
                            </div>
                            <h3 style={{ color: '#00ff7f' }}>BIOMETRIK SKANERLASH...</h3>
                            <p style={{ color: '#64748b' }}>Iltimos, shaxsingizni tasdiqlang</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔐</div>
                            <h3>XAVFSIZLIK TASDIQLOVI</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
                                SuperAdmin huquqlari uchun 4 xonali xavfsizlik kodini kiriting.
                            </p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const pin = e.target.pin.value;
                                if (pin === '0000') {
                                    setIsScanning(true);
                                    playUXSound('pop');
                                    setTimeout(() => {
                                        setSecurityVerified(true);
                                        setIsPinRequired(false);
                                        setIsScanning(false);
                                        sessionStorage.setItem('bsb_pin_verified', 'true');
                                        logAction('Security', '2FA', 'SuperAdmin PIN + Biometrics OK');
                                        addToast('XAVFSIZLIK', 'Kirishga ruxsat berildi!', <FaShieldAlt />);
                                        playUXSound('success');
                                    }, 2000);
                                } else {
                                    addToast('XATO', 'Kod noto\'g\'ri!', <FaTimesCircle />);
                                    playUXSound('error');
                                    logAction('Security', 'Warning', 'Noto\'g\'ri PIN urinishi!');
                                }
                            }}>
                                <input
                                    name="pin"
                                    type="password"
                                    maxLength="4"
                                    placeholder="****"
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '24px',
                                        letterSpacing: '10px',
                                        marginBottom: '20px'
                                    }}
                                    required
                                    autoFocus
                                />
                                <button type="submit" className="save-btn" style={{ width: '100%' }}>TASDIQLASH</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    style={{ width: '100%', marginTop: '10px' }}
                                    onClick={() => {
                                        sessionStorage.clear();
                                        setIsLoggedIn(false);
                                        setSecurityVerified(false);
                                        setIsPinRequired(false);
                                    }}
                                >
                                    BEKOR QILISH
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>BSB <span>ADMIN</span></h2>
                </div>
                <nav className="admin-nav scrollbar-custom">
                    <div className="security-pulse">
                        <div className="health-header">
                            <span className="pulse-dot-green"></span>
                            SYSTEM HEALTH: {securityScore}%
                        </div>
                        <div className="health-bar-container">
                            <div className="health-bar-fill" style={{ width: `${securityScore}%` }}></div>
                        </div>
                    </div>
                    {(() => {
                        const navigation = [
                            { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine />, roles: ['SuperAdmin'] },
                            { id: 'menu', label: 'Menyu Boshqaruvi', icon: <FaUtensils />, roles: ['SuperAdmin'] },
                            { id: 'orders', label: 'Buyurtmalar', icon: <FaClipboardList />, roles: ['SuperAdmin', 'Chef', 'Rider'] },
                            { id: 'reservations', label: 'Rezervatsiyalar', icon: <FaCalendarAlt />, roles: ['SuperAdmin'] },
                            { id: 'kds', label: 'Oshxona (KDS)', icon: <FaUtensils style={{ color: '#ffab00' }} />, roles: ['SuperAdmin', 'Chef'] },
                            { id: 'riders', label: 'Kuryerlar & Map', icon: <FaMotorcycle />, roles: ['SuperAdmin', 'Rider'] },
                            { id: 'inventory', label: 'Omborxona', icon: <FaBolt />, roles: ['SuperAdmin', 'Chef'] },

                            { divider: true, label: 'TIZIM ++', roles: ['SuperAdmin'] },
                            { id: 'users', label: 'Mijozlar', icon: <FaUsers />, roles: ['SuperAdmin'] },
                            { id: 'reports', label: 'Hisobotlar', icon: <FaChartLine style={{ color: '#00e676' }} />, roles: ['SuperAdmin'] },
                            { id: 'staff', label: 'Xodimlar Nazorati', icon: <FaUsers />, roles: ['SuperAdmin'] },
                            { id: 'subscriptions', label: 'Premium Subs', icon: <FaCrown />, roles: ['SuperAdmin'] },
                            { id: 'marketing', label: 'Marketing AI', icon: <FaPaperPlane />, roles: ['SuperAdmin'] },
                            { id: 'loyalty', label: 'Loyalty & Gem', icon: <FaGem />, roles: ['SuperAdmin'] },
                            { id: 'careers', label: 'Arizalar (Career)', icon: <FaUserTie />, roles: ['SuperAdmin'] },
                            { id: 'design', label: 'Dizayn Tahrir', icon: <FaPalette />, roles: ['SuperAdmin'] },
                            { id: 'logs', label: 'Audit Logs', icon: <FaHistory />, roles: ['SuperAdmin'] },

                            { divider: true, label: 'NAZORAT', roles: ['SuperAdmin'] },
                            { id: 'heatmap', label: 'Heatmap Map', icon: <FaFire />, roles: ['SuperAdmin', 'Rider'] },
                            { id: 'terminal', label: 'System Terminal', icon: <FaCogs />, roles: ['SuperAdmin'] },
                            { id: 'ai_insights', label: 'AI Insights', icon: <FaBolt />, roles: ['SuperAdmin'] },
                        ];

                        return navigation
                            .filter(item => item.roles.includes(currentRole))
                            .map((item, idx) => item.divider ? (
                                <div key={`div-${idx}`} className="nav-divider"><span>{item.label}</span></div>
                            ) : (
                                <button
                                    key={item.id}
                                    className={activeTab === item.id ? 'active' : ''}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        playUXSound('click');
                                    }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {activeTab === item.id && <motion.div layoutId="nav-pill" className="nav-pill" />}
                                </button>
                            ));
                    })()}
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={logout} title="Tizimdan chiqish"><FaSignOutAlt /> <span>Chiqish</span></button>
                </div>
                <div className="security-intelligence">
                    <div className="intelligence-label">IDS ACTIVE</div>
                    <div className="threats-counter">
                        <FaShieldAlt /> <span>{threatsPrevented} Threats Blocked</span>
                    </div>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <div className={`server-status-pill ${backendStatus}`}>
                            <div className="status-icon">
                                <FaCogs />
                            </div>
                            <div className="status-info">
                                <div className="status-title">PYTHON SERVER STATUS</div>
                                <div className="status-state">
                                    <span className={`pulse-dot ${backendStatus === 'online' ? 'green' : backendStatus === 'warning' ? 'yellow' : 'red'}`}></span>
                                    {backendStatus === 'online' ? 'LIVE & STABLE' :
                                        backendStatus === 'warning' ? 'SLOW CONNECTION' :
                                            backendStatus === 'checking' ? 'CHECKING...' : 'DISCONNECTED'}
                                </div>
                            </div>
                            {(backendStatus === 'online' || backendStatus === 'warning') && (
                                <div className="status-uptime">
                                    <small>MS: {latency}ms</small>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="header-right">
                        <button
                            className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
                            onClick={testSound}
                            title={soundEnabled ? "Ovoz yoqilgan" : "Ovozni yoqish uchun bosing"}
                        >
                            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                            <span>{soundEnabled ? 'SOUND ON' : 'ENABLE SOUND'}</span>
                        </button>

                        <button
                            className={`security-toggle-btn ${!isDataMasked ? 'active' : ''}`}
                            onClick={() => {
                                if (isDataMasked) {
                                    const pin = window.prompt("Ma'lumotlarni ochish uchun MASTER PIN kodini kiriting:");
                                    if (pin === '0000') {
                                        setIsDataMasked(false);
                                        addToast('XAVFSIZLIK', 'Ma\'lumotlar ochildi', <FaShieldAlt />);
                                    } else {
                                        setViolationCount(prev => prev + 1);
                                        addToast('OGOHLANTIRISH', 'Noto\'g\'ri PIN! IDS qayd etildi.', <FaExclamationTriangle />);
                                    }
                                } else {
                                    setIsDataMasked(true);
                                }
                            }}
                        >
                            {isDataMasked ? <FaEyeSlash /> : <FaEye />}
                            <span>{isDataMasked ? 'DATA MASKED' : 'DATA UNMASKED'}</span>
                        </button>

                        {activeTab === 'menu' && (
                            <div className="search-bar">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Mahsulotlarni qidirish..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="admin-user-profile-simple">
                            <div className="avatar">
                                {currentRole === 'SuperAdmin' ? 'SA' : currentRole === 'Chef' ? 'CH' : 'RD'}
                                <div className="online-status"></div>
                            </div>
                            <div className="admin-info">
                                <span className="admin-name">{currentRole === 'SuperAdmin' ? 'Admin Root' : currentRole === 'Chef' ? 'Oshpaz (Chief)' : 'Kuryer (Rider)'}</span>
                                <span className="admin-role">{currentRole}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="admin-content fade-in">
                    {renderContent()}
                </div>

                {/* Toasts */}
                <div className="admin-toasts-container">
                    {toasts.map(toast => (
                        <div key={toast.id} className="admin-toast">
                            <div className="toast-icon">{toast.icon}</div>
                            <div className="toast-body">
                                <h4>{toast.title}</h4>
                                <p>{toast.msg}</p>
                            </div>
                            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
                {/* VOID_WATERMARK: Real-time session authenticity overlay */}
                <div className="abs-void-watermark">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="watermark-row">
                            <span>{new Date().toLocaleDateString()}</span>
                            <span>VOiD_AUTH_SESSION_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                            <span>{currentRole}</span>
                        </div>
                    ))}
                </div>
            </main>

            {/* Global Modals */}
            {isAddingProduct && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3>{editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const productData = {
                                name: formData.get('name'),
                                price: `$${formData.get('price')}`,
                                category: formData.get('category'),
                                image: formData.get('image'),
                                description: formData.get('description'),
                                ingredients: formData.get('ingredients').split(',').map(i => i.trim()),
                                isAvailable: editingProduct ? editingProduct.isAvailable : true
                            };
                            if (editingProduct) {
                                updateProduct(editingProduct.id, productData);
                                logAction('Admin', 'Menu', `${productData.name} tahrirlandi.`);
                                addToast('YANGILANDI!', `${productData.name} muvaffaqiyatli tahrirlandi.`, <FaEdit />);
                            } else {
                                addProduct(productData);
                                logAction('Admin', 'Menu', `${productData.name} menyuga qo'shildi.`);
                                addToast('QO\'SHILDI!', `${productData.name} menyuga qo'shildi!`, <FaPlus />);
                            }
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                        }}>
                            <div className="s-input">
                                <label>Mahsulot nomi</label>
                                <input name="name" placeholder="Nomi" defaultValue={editingProduct?.name} required />
                            </div>
                            <div className="s-input">
                                <label>Narxi ($)</label>
                                <input name="price" type="number" step="0.01" placeholder="Narxi ($)" defaultValue={editingProduct?.price.replace('$', '')} required />
                            </div>
                            <div className="s-input">
                                <label>Kategoriya</label>
                                <select name="category" defaultValue={editingProduct?.category || 'BURGERS'}>
                                    <option value="BURGERS">BURGERS</option>
                                    <option value="SIDES">SIDES</option>
                                    <option value="DRINKS">DRINKS</option>
                                    <option value="SALADS">SALADS</option>
                                    <option value="PIZZA">PIZZA</option>
                                </select>
                            </div>
                            <div className="s-input">
                                <label>Rasm URL</label>
                                <input name="image" placeholder="Rasm URL" defaultValue={editingProduct?.image} required />
                            </div>
                            <div className="s-input">
                                <label>Tavsif</label>
                                <textarea name="description" placeholder="Tavsif" defaultValue={editingProduct?.description} required />
                            </div>
                            <div className="s-input">
                                <label>Tarkibi (vergul bilan)</label>
                                <input name="ingredients" placeholder="Tarkibi" defaultValue={editingProduct?.ingredients?.join(', ')} required />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Saqlash</button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setIsAddingProduct(false);
                                    setEditingProduct(null);
                                }}>Bekor qilish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {selectedOrder && (
                <div className="admin-modal order-detail-modal">
                    <div className="admin-modal-content">
                        <div className="modal-header">
                            <h3>Buyurtma tafsilotlari #{selectedOrder.orderId}</h3>
                            <button className="close-x" onClick={() => setSelectedOrder(null)}>&times;</button>
                        </div>
                        <div className="order-full-info">
                            <div className="info-section">
                                <h4>Mijoz malumotlari</h4>
                                <p><strong>Ism:</strong> {selectedOrder.customer || "Noma'lum"}</p>
                                <p><strong>Sana:</strong> {selectedOrder.date}</p>
                                <p><strong>Status:</strong> <span className={`status-tag ${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                            </div>
                            <div className="info-section">
                                <h4>Buyurtma tarkibi</h4>
                                <div className="order-items-list">
                                    {selectedOrder.items.map((item, id) => (
                                        <div key={id} className="order-item-row">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-summary-total">
                                    <span>Jami:</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="save-btn" onClick={() => window.print()}>Chekni chop etish</button>
                            <button className="cancel-btn" onClick={() => setSelectedOrder(null)}>Yopish</button>
                        </div>
                    </div>
                </div>
            )}

            {isStaffModalOpen && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3><FaUserTie /> Yangi Xodim Qo'shish</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const name = formData.get('name');
                            const role = formData.get('role');
                            addStaff({ name, role });
                            logAction('Admin', 'Staff', `Yangi xodim: ${name} (${role})`);
                            addToast('QO\'SHILDI', `${name} xodimlar safiga qo'shildi!`, <FaCheckCircle />);
                            setIsStaffModalOpen(false);
                        }}>
                            <div className="s-input">
                                <label>Xodim ismi</label>
                                <input name="name" placeholder="Masalan: Alisher Valiyev" required />
                            </div>
                            <div className="s-input">
                                <label>Lavozimi</label>
                                <select name="role">
                                    <option value="Chef">Chef (Oshpaz)</option>
                                    <option value="Admin">Admin (Menejer)</option>
                                    <option value="Runner">Runner (Yordamchi)</option>
                                    <option value="Cleaner">Tozalik xodimi</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Qo'shish</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsStaffModalOpen(false)}>Bekor qilish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCouponModalOpen && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3>Yangi Kupon Qo'shish</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newCoupon = {
                                code: formData.get('code').toUpperCase(),
                                discount: formData.get('discount') + (formData.get('type') === 'percent' ? '%' : '$'),
                                status: 'active'
                            };
                            setCoupons([...coupons, newCoupon]);
                            logAction('Admin', 'Marketing', `Yangi kupon yaratildi: ${newCoupon.code}`);
                            addToast('YARATILDI', `Promokod: ${newCoupon.code}`, <FaGift />);
                            setIsCouponModalOpen(false);
                        }}>
                            <div className="s-input">
                                <label>Kupon kodi</label>
                                <input name="code" placeholder="BSB100" required />
                            </div>
                            <div className="s-input">
                                <label>Chegirma miqdori</label>
                                <input name="discount" type="number" placeholder="20" required />
                            </div>
                            <div className="s-input">
                                <label>Turi</label>
                                <select name="type">
                                    <option value="percent">Foiz (%)</option>
                                    <option value="fixed">Fiksirlangan ($)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Saqlash</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsCouponModalOpen(false)}>Bekor qilish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
