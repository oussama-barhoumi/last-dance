import { Search, Bell, ChevronDown, CheckCircle2, AlertCircle, Clock, ArrowRight, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import clsx from 'clsx';

export default function Header({ user }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
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
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 text-gray-500">
                    <button className="hover:text-black transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={clsx(
                                "relative hover:text-black transition-colors p-2 rounded-xl",
                                showNotifications && "bg-gray-100 text-black"
                            )}
                        >
                            <Bell className="w-5 h-5" />
                            {user.unread_notifications_count > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
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
                                    className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-gray-50 overflow-hidden"
                                >
                                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <h3 className="font-black text-sm text-gray-900">Notifications</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                {user.unread_notifications_count} New Alerts
                                            </p>
                                        </div>
                                        {user.unread_notifications_count > 0 && (
                                            <button 
                                                onClick={markAllRead}
                                                className="text-[10px] font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest"
                                            >
                                                Mark all read
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
                                                        "p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4",
                                                        !notif.read_at && "bg-purple-50/30"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                                                        notif.data.type === 'success' ? "bg-green-100 text-green-600" : 
                                                        notif.data.type === 'alert' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                        {notif.data.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                                                         notif.data.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 mb-1">{notif.data.title}</p>
                                                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{notif.data.message}</p>
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
                                                <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Bell className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-900">All caught up!</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">No new notifications</p>
                                            </div>
                                        )}
                                    </div>

                                    <Link 
                                        href="#"
                                        className="p-4 bg-gray-50 text-center block text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                                    >
                                        View All Notifications
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                    <div className="bg-white rounded-[15px] px-6 py-2.5 flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">My Balance</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900 leading-none">
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
