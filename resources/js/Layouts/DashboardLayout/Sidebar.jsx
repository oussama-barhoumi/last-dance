import { Link, useForm, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { 
    LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, BarChart, 
    TrendingUp, Settings, LogOut, Globe, Anchor, ChevronDown, Camera,
    ShieldAlert, ShieldCheck, User as UserIcon, FileText, Landmark,
    Users, Activity, Lock, Cpu, Download
} from 'lucide-react';
import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, active, href = "#", badge, badgeColor }) => (
    <Link 
        href={href} 
        className={clsx(
            "flex items-center justify-between px-6 py-4 transition-all group border-l-4",
            active 
                ? "text-white border-white bg-white/5" 
                : "text-gray-500 border-transparent hover:text-white hover:bg-white/5 hover:border-white/20"
        )}
    >
        <div className="flex items-center gap-4">
            <Icon className={clsx("w-5 h-5 transition-colors", active ? "text-white" : "text-gray-500 group-hover:text-white")} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        {badge && (
            <span className={clsx("px-2 py-0.5 rounded-none text-[8px] font-black text-white border border-white/20", badgeColor)}>
                {badge}
            </span>
        )}
    </Link>
);

export default function Sidebar() {
    const { auth } = usePage().props;
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        avatar: null,
    });

    const role = auth.user.role;

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const formData = new FormData();
            formData.append('avatar', file);
            post(route('profile.avatar.update'), {
                forceFormData: true,
            });
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-black flex flex-col z-50 border-r border-white/10 font-mono uppercase tracking-tighter">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="bg-white p-2 rounded-none group-hover:invert transition-all duration-500">
                        <Anchor className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">HARBORBANK</span>
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto pt-6">
                <div className="px-6 mb-6">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Protocol Control</span>
                </div>
                <nav className="space-y-0">
                    {/* Role-Specific Dashboards */}
                    {role === 'super_admin' && (
                        <>
                            <div className="px-6 mt-4 mb-2">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Root Control</span>
                            </div>
                            <NavItem icon={ShieldAlert} label="Manage Admins" href={route('super-admin.admins.index')} active={route().current('super-admin.admins.index')} />
                            <NavItem icon={Users} label="Manage Users" href={route('super-admin.users.index')} active={route().current('super-admin.users.index')} />
                            <NavItem icon={BarChart} label="Bank Analytics" href={route('super-admin.analytics.index')} active={route().current('super-admin.analytics.index')} />
                            <NavItem icon={Activity} label="Tx Monitoring" href={route('super-admin.transactions.index')} active={route().current('super-admin.transactions.index')} />
                            <NavItem icon={Lock} label="Freeze Accounts" href={route('super-admin.users.index')} />
                            <NavItem icon={Landmark} label="Approve Loans" href={route('super-admin.loans.index')} active={route().current('super-admin.loans.index')} />
                            <NavItem icon={Settings} label="System Settings" href={route('super-admin.settings.index')} active={route().current('super-admin.settings.index')} />
                            <NavItem icon={ShieldAlert} label="Fraud Detection" href={route('super-admin.fraud.index')} active={route().current('super-admin.fraud.index')} badge="ALERT" badgeColor="bg-red-600 border-red-600" />
                            <NavItem icon={FileText} label="Logs & Alerts" href={route('super-admin.logs.index')} active={route().current('super-admin.logs.index')} />
                            <NavItem icon={Cpu} label="AI Monitoring" href={route('super-admin.ai-monitoring.index')} active={route().current('super-admin.ai-monitoring.index')} badge="BETA" badgeColor="bg-white text-black" />
                            <NavItem icon={BarChart} label="AI Assistant" href={route('ai-assistant.index')} active={route().current('ai-assistant.index')} />
                            <NavItem icon={Globe} label="Voice Coach" href={route('voice-coach.index')} active={route().current('voice-coach.index')} />
                            <NavItem icon={Download} label="Reports & Exports" href={route('super-admin.reports.index')} active={route().current('super-admin.reports.index')} />
                        </>
                    )}
                    
                    {role === 'admin' && (
                        <>
                            <div className="px-6 mt-4 mb-2">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Ops Console</span>
                            </div>
                            <NavItem 
                                icon={ShieldCheck} 
                                label="Admin Console" 
                                active={route().current('admin.dashboard')} 
                                href={route('admin.dashboard')} 
                            />
                            <NavItem icon={Users} label="Manage Users" href="#" />
                            <NavItem icon={Landmark} label="Loan Requests" href={route('admin.dashboard')} />
                            <NavItem icon={FileText} label="KYC Audit" href={route('admin.kyc.index')} active={route().current('admin.kyc.index')} />
                        </>
                    )}

                    {/* Core Services Section - Only for Admins and Users */}
                    {role !== 'super_admin' && (
                        <>
                            <div className="px-6 mt-8 mb-4">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Core Services</span>
                            </div>

                            <NavItem 
                                icon={LayoutDashboard} 
                                label="User Dashboard" 
                                active={route().current('dashboard')} 
                                href={route('dashboard')} 
                            />
                            <NavItem icon={Activity} label="AI Assistant" active={route().current('ai-assistant.index')} href={route('ai-assistant.index')} badge="AI" badgeColor="bg-blue-600 border-blue-600" />
                            <NavItem icon={Globe} label="Voice Coach" active={route().current('voice-coach.index')} href={route('voice-coach.index')} badge="LIVE" badgeColor="bg-red-600 border-red-600" />
                            <NavItem icon={Cpu} label="Voice Call" active={route().current('voice-call.index')} href={route('voice-call.index')} />
                            <NavItem icon={ArrowLeftRight} label="Transactions" active={route().current('transactions.index')} href={route('transactions.index')} />
                            <NavItem icon={CreditCard} label="Cards" active={route().current('cards.index')} href={route('cards.index')} />
                            <NavItem icon={Wallet} label="Investment" active={route().current('investments.index')} href={route('investments.index')} />
                            <NavItem icon={TrendingUp} label="Loans" active={route().current('loans.index')} href={route('loans.index')} />
                        </>
                    )}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-8 mt-auto border-t border-white/5">
                <div className="bg-white/5 p-4 flex items-center justify-between mb-8 border border-white/10">
                    <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                        <img 
                            src={auth.user.profile_photo_url} 
                            alt="User" 
                            className={clsx(
                                "w-10 h-10 rounded-none grayscale transition-all",
                                processing ? "opacity-50" : "group-hover/avatar:grayscale-0"
                            )}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/40">
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
                    <div className="flex gap-4 pr-2">
                        <Link 
                            href={route('settings.index')}
                            className={clsx(
                                "transition-colors",
                                route().current('settings.index') ? "text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            <Settings className="w-4 h-4" />
                        </Link>
                        <button 
                            onClick={() => setShowLogoutModal(true)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {role === 'super_admin' && (
                    <div className="px-6 mb-8 mt-4">
                        <div className="bg-white/5 border border-white/10 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[7px] font-black text-gray-500 uppercase tracking-[0.2em]">System Integrity</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-green-500 animate-pulse" />
                                    <div className="w-1 h-1 bg-green-500 animate-pulse delay-75" />
                                    <div className="w-1 h-1 bg-green-500 animate-pulse delay-150" />
                                </div>
                            </div>
                            <div className="h-0.5 bg-white/10 w-full overflow-hidden">
                                <motion.div 
                                    animate={{ x: ['-100%', '100%'] }} 
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="h-full bg-white/40 w-1/2" 
                                />
                            </div>
                            <div className="flex justify-between items-center text-[6px] font-black text-gray-600 uppercase tracking-widest">
                                <span>Core: Optimal</span>
                                <span>Lat: 12ms</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 text-gray-600 text-[8px] font-black uppercase tracking-widest px-2 hover:text-white cursor-pointer transition-colors">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    <span>Clearance: L3_ROOT</span>
                    <ChevronDown className="w-2 h-2 ml-auto" />
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-black w-full max-w-sm border border-white/20 relative overflow-hidden p-10 text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-white text-black flex items-center justify-center mx-auto mb-8">
                                <LogOut className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Terminate Session</h3>
                            <p className="text-[10px] text-gray-500 mb-10 uppercase tracking-widest font-bold">Are you sure you want to disconnect from the HarborBank protocol?</p>
                            
                            <div className="flex flex-col gap-4">
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button" 
                                    className="w-full bg-white text-black font-black py-4 rounded-none hover:bg-gray-200 transition-all text-xs uppercase tracking-widest"
                                >
                                    Confirm Disconnect
                                </Link>
                                <button 
                                    onClick={() => setShowLogoutModal(false)}
                                    className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Abort
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </aside>
    );
}
