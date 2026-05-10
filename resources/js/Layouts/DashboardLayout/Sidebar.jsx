import { Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import {
    LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, BarChart,
    TrendingUp, Settings, LogOut, Globe, Anchor, ChevronDown, Camera
} from 'lucide-react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NavItem = ({ icon: Icon, label, active, href = "#", badge, badgeColor }) => (
    <Link
        href={href}
        className={`flex items-center justify-between px-6 py-3 transition-all group ${active ? 'text-white border-l-4 border-blue-400 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
                {badge}
            </span>
        )}
    </Link>
);

export default function Sidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        avatar: null,
    });

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            // Submit immediately
            const formData = new FormData();
            formData.append('avatar', file);
            post(route('profile.avatar.update'), {
                forceFormData: true,
            });
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0A192F] flex flex-col z-50">
            <div className="p-8 pb-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Anchor className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">HarborBank</span>
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto pt-4">
                <div className="px-6 mb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('sidebar.navigation')}</span>
                </div>
                <nav className="space-y-1">
                    <NavItem icon={LayoutDashboard} label={t('sidebar.dashboard')} active={route().current('dashboard')} href={route('dashboard')} />
                    <NavItem icon={ArrowLeftRight} label={t('sidebar.transactions')} active={route().current('transactions.index')} href={route('transactions.index')} />
                    <NavItem icon={BarChart} label={t('sidebar.ai_assistant')} active={route().current('ai-assistant.index')} href={route('ai-assistant.index')} badge="AI" badgeColor="bg-blue-500" />
                    <NavItem icon={Globe} label={t('sidebar.voice_coach')} active={route().current('voice-coach.index')} href={route('voice-coach.index')} badge="LIVE" badgeColor="bg-red-500" />
                    <NavItem icon={CreditCard} label={t('sidebar.accounts')} active={route().current('accounts.index')} href={route('accounts.index')} />
                    <NavItem icon={CreditCard} label={t('sidebar.cards')} active={route().current('cards.index')} href={route('cards.index')} badge="3" badgeColor="bg-[#8B5CF6]" />
                    <NavItem icon={Wallet} label={t('sidebar.investment')} active={route().current('investments.index')} href={route('investments.index')} badge="14" badgeColor="bg-[#10B981]" />
                    <NavItem icon={BarChart} label={t('sidebar.reports')} active={route().current('reports.index')} href={route('reports.index')} />
                    <NavItem icon={TrendingUp} label={t('sidebar.loan')} active={route().current('loans.index')} href={route('loans.index')} />
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-6 mt-auto">
                <div className="bg-[#1F2937] rounded-full p-2 flex items-center justify-between mb-6">
                    <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                        <img
                            src={auth.user.profile_photo_url}
                            alt="User"
                            className={clsx(
                                "w-8 h-8 rounded-full transition-opacity",
                                processing ? "opacity-50" : "group-hover/avatar:opacity-40"
                            )}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="flex gap-2 pr-2">
                        <Link
                            href={route('settings.index')}
                            className={clsx(
                                "transition-colors",
                                route().current('settings.index') ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <Settings className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="text-red-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mb-6 px-2">
                    <LanguageSwitcher />
                </div>

                <div className="flex gap-4 px-2">
                    <Link href="#" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-black">{t('sidebar.privacy')}</Link>
                    <Link href="#" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-black">{t('sidebar.license')}</Link>
                    <Link href="#" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-black">{t('sidebar.api')}</Link>
                </div>
            </div>

            {/* Logout Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] shadow-2xl relative overflow-hidden p-8 text-center border border-transparent dark:border-zinc-800"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('sidebar.confirm_logout')}</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8">{t('sidebar.logout_message')}</p>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 hover:scale-[1.02] transition-all"
                                >
                                    {t('sidebar.yes_logout')}
                                </Link>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    {t('sidebar.cancel')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </aside>
    );
}
