import { Search, Bell, ChevronDown, CheckCircle2, AlertCircle, Clock, ArrowRight, X, LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, BarChart, TrendingUp, Globe, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '@/Components/ThemeToggle';
import enTranslations from '@/locales/en/translation.json';

// Helper to flatten translations
const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};

const allTranslations = flattenObject(enTranslations);

// Map top level keys to routes and icons
const routeMapping = {
    'sidebar': { route: 'dashboard', icon: LayoutDashboard },
    'dashboard': { route: 'dashboard', icon: LayoutDashboard },
    'transactions': { route: 'transactions.index', icon: ArrowLeftRight },
    'ai_assistant': { route: 'ai-assistant.index', icon: BarChart },
    'voice_coach': { route: 'voice-coach.index', icon: Globe },
    'accounts': { route: 'accounts.index', icon: CreditCard },
    'cards': { route: 'cards.index', icon: CreditCard },
    'investments': { route: 'investments.index', icon: Wallet },
    'loans': { route: 'loans.index', icon: TrendingUp },
    'settings': { route: 'settings.index', icon: Settings },
    'profile': { route: 'profile.edit', icon: Settings },
    'welcome': { route: 'dashboard', icon: LayoutDashboard }, // Fallback
    'auth': { route: 'login', icon: Search }
};

export default function Header({ user }) {
    const { t } = useTranslation();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    // Generate searchable index from all translations
    const searchableIndex = Object.entries(allTranslations).map(([key, value]) => {
        const topLevelKey = key.split('.')[0];
        const routeInfo = routeMapping[topLevelKey] || { route: 'dashboard', icon: Search };
        
        return {
            title: value,
            key: key,
            route: routeInfo.route,
            icon: routeInfo.icon
        };
    }).filter(item => typeof item.title === 'string'); // ensure only strings

    // Keep the core sidebar items at the top
    const coreItems = [
        { title: t('sidebar.dashboard'), route: 'dashboard', icon: LayoutDashboard },
        { title: t('sidebar.transactions'), route: 'transactions.index', icon: ArrowLeftRight },
        { title: t('sidebar.accounts'), route: 'accounts.index', icon: CreditCard },
        { title: t('sidebar.cards'), route: 'cards.index', icon: CreditCard },
        { title: t('sidebar.investment'), route: 'investments.index', icon: Wallet },
        { title: t('sidebar.reports'), route: 'reports.index', icon: BarChart },
        { title: t('sidebar.loan'), route: 'loans.index', icon: TrendingUp },
        { title: t('sidebar.ai_assistant'), route: 'ai-assistant.index', icon: BarChart },
        { title: t('sidebar.voice_coach'), route: 'voice-coach.index', icon: Globe },
    ];

    const filteredItems = [...coreItems, ...searchableIndex]
        .filter(item => searchQuery && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        // Remove duplicates by title
        .filter((item, index, self) => index === self.findIndex((t) => t.title === item.title))
        .slice(0, 8); // limit to 8 results for UI performance

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        router.post(route('notifications.mark-as-read', id));
    };

    const markAllRead = () => {
        router.post(route('notifications.mark-all-as-read'));
    };

    return (
        <header className="sticky top-0 z-40 bg-transparent/50 backdrop-blur-sm px-10 py-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">{t('header.overview')}</h1>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 text-gray-500 dark:text-zinc-400">
                    <ThemeToggle />
                    <div id="tour-search" className="relative" ref={searchRef}>
                        <div className={clsx(
                            "flex items-center gap-2 transition-all duration-300",
                            showSearch ? "w-64 bg-white dark:bg-zinc-800 rounded-full px-4 py-2 border border-gray-200 dark:border-zinc-700 shadow-sm" : "w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer"
                        )}
                        onClick={() => !showSearch && setShowSearch(true)}>
                            <Search className="w-5 h-5 text-gray-500 dark:text-zinc-400 shrink-0" />
                            {showSearch && (
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder={t('header.search_placeholder') || "Search..."}
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-400 p-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showSearch && searchQuery && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-4 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden left-0"
                                >
                                    {filteredItems.length > 0 ? (
                                        <div className="py-2">
                                            {filteredItems.map((item, i) => (
                                                <Link
                                                    key={i}
                                                    href={route(item.route)}
                                                    onClick={() => {
                                                        setShowSearch(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                                >
                                                    <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-200 truncate">{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                                            No results found
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={clsx(
                                "relative hover:text-black dark:hover:text-white transition-colors p-2 rounded-xl",
                                showNotifications && "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white"
                            )}
                        >
                            <Bell className="w-5 h-5" />
                            {user.unread_notifications_count > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900">
                                    {user.unread_notifications_count}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-96 bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-gray-50 dark:border-zinc-800 overflow-hidden"
                                >
                                    <div className="p-6 border-b border-gray-50 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                                        <div>
                                            <h3 className="font-black text-sm text-gray-900 dark:text-white">{t('header.notifications')}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                {user.unread_notifications_count} {t('header.new_alerts')}
                                            </p>
                                        </div>
                                        {user.unread_notifications_count > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 uppercase tracking-widest"
                                            >
                                                {t('header.mark_all_read')}
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[400px] overflow-y-auto">
                                        {user.notifications?.length > 0 ? (
                                            user.notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => !notif.read_at && markAsRead(notif.id)}
                                                    className={clsx(
                                                        "p-6 border-b border-gray-50 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-4",
                                                        !notif.read_at && "bg-purple-50/30 dark:bg-purple-900/10"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                                                        notif.data.type === 'success' ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                                            notif.data.type === 'alert' ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                    )}>
                                                        {notif.data.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                                            notif.data.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">{notif.data.title}</p>
                                                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{notif.data.message}</p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    {!notif.read_at && (
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 self-start" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 px-6 text-center">
                                                <div className="bg-gray-50 dark:bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                                                    <Bell className="w-6 h-6 text-gray-300 dark:text-zinc-600" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{t('header.all_caught_up')}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('header.no_new_notifications')}</p>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="#"
                                        className="p-4 bg-gray-50 dark:bg-zinc-800 text-center block text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        {t('header.view_all')}
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                    <div className="bg-white dark:bg-zinc-900 rounded-[15px] px-6 py-2.5 flex items-center gap-3 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('header.my_balance')}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900 dark:text-white leading-none">
                                    ${parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">USD</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
