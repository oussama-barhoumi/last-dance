import { Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { 
    LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, BarChart, 
    TrendingUp, Settings, LogOut, Globe, Landmark, ChevronDown, 
    Cpu, MessageSquare, Mic, Bell, Search, Menu, X, User,
    Activity, ShieldAlert, ShieldCheck, Lock, Calendar, MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, active, href = "#", badge, badgeColor = "bg-purple-500" }) => (
    <Link 
        href={href} 
        className={clsx(
            "relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
            active 
                ? "text-white bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
    >
        {active && (
            <motion.div 
                layoutId="activeGlow"
                className="absolute inset-0 rounded-2xl border border-purple-500/50 blur-[2px] pointer-events-none"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        
        <div className="flex items-center gap-3 relative z-10">
            <div className={clsx(
                "p-2 rounded-lg transition-colors",
                active ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium tracking-tight">{label}</span>
        </div>

        {badge && (
            <span className={clsx(
                "relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg",
                badgeColor,
                "after:absolute after:inset-0 after:rounded-full after:animate-pulse after:bg-inherit after:opacity-40"
            )}>
                {badge}
            </span>
        )}
    </Link>
);

export default function Sidebar() {
    const { auth } = usePage().props;
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const role = auth.user.role;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const userItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: route('dashboard'), active: route().current('dashboard') },
        { icon: ArrowLeftRight, label: "Transactions", href: route('transactions.index'), active: route().current('transactions.index') },
        { icon: Landmark, label: "Accounts", href: route('accounts.index'), active: route().current('accounts.index') },
        { icon: CreditCard, label: "Cards", href: route('cards.index'), active: route().current('cards.index'), badge: "3" },
        { icon: Wallet, label: "Investments", href: route('investments.index'), active: route().current('investments.index'), badge: "PRO" },
        { icon: BarChart, label: "Reports", href: "#", active: false },
        { icon: TrendingUp, label: "Loans", href: route('loans.index'), active: route().current('loans.index') },
    ];

    const adminItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: route('admin.dashboard'), active: route().current('admin.dashboard') },
        { icon: User, label: "Users Management", href: route('super-admin.users.index'), active: route().current('super-admin.users.index') },
        { icon: Activity, label: "Transactions Monitoring", href: route('super-admin.transactions.index'), active: route().current('super-admin.transactions.index') },
        { icon: Landmark, label: "Loan Requests", href: route('admin.loans.index'), active: route().current('admin.loans.index') },
        { icon: Calendar, label: "Bank Appointments", href: route('admin.appointments.index'), active: route().current('admin.appointments.index'), badge: "NEW" },
        { icon: MapPin, label: "Institutional Branches", href: route('admin.branches.index'), active: route().current('admin.branches.index') },
        { icon: ShieldCheck, label: "KYC Verification", href: route('admin.kyc.index'), active: route().current('admin.kyc.index'), badge: "PENDING" },
        { icon: MessageSquare, label: "Support Tickets", href: "#", active: false },
        { icon: BarChart, label: "Reports", href: "#", active: false },
        { icon: Bell, label: "Notifications", href: "#", active: false },
    ];

    const superAdminItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: route('super-admin.dashboard'), active: route().current('super-admin.dashboard') },
        { icon: Calendar, label: "Appointment Flow", href: route('admin.appointments.index'), active: route().current('admin.appointments.index'), badge: "HOT" },
        { icon: ShieldCheck, label: "Admin Management", href: route('super-admin.admins.index'), active: route().current('super-admin.admins.index') },
        { icon: BarChart, label: "System Analytics", href: route('super-admin.analytics.index'), active: route().current('super-admin.analytics.index') },
        { icon: Landmark, label: "Loan Control", href: route('super-admin.loans.index'), active: route().current('super-admin.loans.index') },
        { icon: ShieldAlert, label: "Fraud Detection", href: route('super-admin.fraud.index'), active: route().current('super-admin.fraud.index'), badge: "ALERT", badgeColor: "bg-red-500" },
        { icon: Lock, label: "Security Logs", href: route('super-admin.logs.index'), active: route().current('super-admin.logs.index') },
        { icon: ArrowLeftRight, label: "Transaction Control", href: route('super-admin.transactions.index'), active: false },
        { icon: User, label: "User Control", href: route('super-admin.users.index'), active: false },
        { icon: Settings, label: "System Settings", href: route('super-admin.settings.index'), active: route().current('super-admin.settings.index') },
        { icon: Cpu, label: "AI Monitoring", href: route('super-admin.ai-monitoring.index'), active: route().current('super-admin.ai-monitoring.index'), badge: "PRO" },
    ];

    const aiItems = [
        { icon: Cpu, label: "AI Assistant", href: route('ai-assistant.index'), active: route().current('ai-assistant.index') },
        { icon: Mic, label: "Voice Bank AI", href: route('voice-call.index'), active: route().current('voice-call.index'), badge: "LIVE", badgeColor: "bg-red-500" },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Branding */}
            <div className="p-8 relative">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5 rounded-xl relative z-10 shadow-lg shadow-purple-500/20">
                            <Landmark className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight leading-none">HarborBank</span>
                        <span className="text-[10px] font-medium text-purple-400/80 tracking-widest uppercase mt-1">Institutional</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide py-4">
                {/* Role Specific Section */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                        {role === 'super_admin' ? 'Root Terminal' : role === 'admin' ? 'Ops Console' : 'Core Banking'}
                    </p>
                    {role === 'super_admin' && superAdminItems.map((item, idx) => <NavItem key={idx} {...item} />)}
                    {role === 'admin' && adminItems.map((item, idx) => <NavItem key={idx} {...item} />)}
                    {role === 'user' && userItems.map((item, idx) => <NavItem key={idx} {...item} />)}
                </div>

                {/* Shared AI Section */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">AI Protocols</p>
                    {aiItems.map((item, idx) => (
                        <NavItem key={idx} {...item} />
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-3xl border border-white/10 p-4 space-y-4">
                    {/* User Card */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="relative">
                            <img 
                                src={auth.user.profile_photo_url} 
                                alt={auth.user.name} 
                                className="w-10 h-10 rounded-xl object-cover border border-white/10"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0D0D0D] rounded-full" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-white truncate">{auth.user.name}</span>
                            <span className="text-[10px] font-medium text-purple-400 uppercase tracking-widest">{role.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <div className="h-[1px] bg-white/10 w-full" />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                            <Link 
                                href={route('settings.index')}
                                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </Link>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer hover:bg-black/60 transition-colors group">
                            <Globe className="w-3 h-3 text-gray-500 group-hover:text-purple-400 transition-colors" />
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">EN</span>
                            <ChevronDown className="w-2.5 h-2.5 text-gray-600 group-hover:text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-[#0D0D0D] border-r border-white/10 flex-col z-[60] overflow-hidden">
                {/* Topographic Background Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="topo" width="200" height="200" patternUnits="userSpaceOnUse">
                                <path d="M0 100 C 20 80, 40 120, 60 100 S 100 80, 120 100 S 160 120, 180 100 S 200 80, 220 100" fill="none" stroke="white" strokeWidth="1" />
                                <path d="M0 150 C 20 130, 40 170, 60 150 S 100 130, 120 150 S 160 170, 180 150 S 200 130, 220 150" fill="none" stroke="white" strokeWidth="0.5" />
                                <path d="M0 50 C 20 30, 40 70, 60 50 S 100 30, 120 50 S 160 70, 180 50 S 200 30, 220 50" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#topo)" />
                    </svg>
                </div>
                
                {/* Glow Effects */}
                <div className="absolute top-0 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 -right-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Header */}
            <div className={clsx(
                "lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-[70] transition-all duration-300",
                scrolled ? "bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
            )}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-purple-600 p-1.5 rounded-lg">
                        <Landmark className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">HarborBank</span>
                </Link>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10 text-white active:scale-90 transition-transform"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#0D0D0D] border-r border-white/10 z-[90] lg:hidden"
                        >
                            <div className="absolute top-6 right-6">
                                <button 
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
