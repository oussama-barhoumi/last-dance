import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    User, Shield, CreditCard, Bell, Globe, 
    Smartphone, Lock, Eye, Trash2, Plus,
    ChevronRight, ExternalLink, HelpCircle,
    Sliders, Key, Fingerprint, Languages,
    Users, Layout, Moon, Sun, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

const SettingSection = ({ icon: Icon, title, description, children, active = false }) => (
    <div className={clsx(
        "p-10 rounded-[40px] border transition-all duration-500",
        active ? "bg-white border-gray-100 shadow-sm" : "bg-transparent border-transparent opacity-60"
    )}>
        <div className="flex items-center gap-4 mb-8">
            <div className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                active ? "bg-black text-white" : "bg-gray-100 text-gray-400"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        {active && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {children}
            </motion.div>
        )}
    </div>
);

const Toggle = ({ active, onToggle }) => (
    <button 
        onClick={onToggle}
        className={clsx(
            "w-12 h-6 rounded-full transition-all duration-300 relative",
            active ? "bg-black" : "bg-gray-200"
        )}
    >
        <div className={clsx(
            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
            active ? "left-7" : "left-1"
        )} />
    </button>
);

export default function Index({ user, sessions, beneficiaries }) {
    const [activeTab, setActiveTab] = useState('personal');

    const tabs = [
        { id: 'personal', label: 'Personal Information', sub: 'المعلومات الشخصية', icon: User },
        { id: 'security', label: 'Security Settings', sub: 'الحماية والولوج', icon: Lock },
        { id: 'cards', label: 'Cards Management', sub: 'تسيير البطائق', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', sub: 'التنبيهات', icon: Bell },
        { id: 'language', label: 'Language Settings', sub: 'اللغة والإعدادات', icon: Globe },
        { id: 'beneficiaries', label: 'Beneficiaries', sub: 'المستفيدين', icon: Users },
        { id: 'devices', label: 'Devices', sub: 'الأجهزة المرتبطة', icon: Smartphone },
    ];

    return (
        <DashboardLayout>
            <Head title="Account Settings - HarborBank" />

            <div className="flex flex-col lg:flex-row gap-12 mt-8 mb-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="sticky top-24 space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 px-6">Settings</h2>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left group",
                                    activeTab === tab.id ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" : "text-gray-400 hover:text-black hover:bg-gray-50"
                                )}
                            >
                                <tab.icon className={clsx(
                                    "w-5 h-5",
                                    activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-black"
                                )} />
                                <div>
                                    <p className="text-sm font-bold">{tab.label}</p>
                                    <p className={clsx(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        activeTab === tab.id ? "text-white/50" : "text-gray-400"
                                    )}>{tab.sub}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">
                    {activeTab === 'personal' && (
                        <SettingSection 
                            icon={User} 
                            title="Personal Information" 
                            description="المعلومات الشخصية - Manage your identity and contact details."
                            active={true}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input type="text" defaultValue={user.name} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input type="email" defaultValue={user.email} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">National ID (CIN)</label>
                                    <input type="text" placeholder="AB123456" className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                                    <input type="text" placeholder="+212 6..." className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black" />
                                </div>
                            </div>
                            <button className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform">Save Changes</button>
                        </SettingSection>
                    )}

                    {activeTab === 'security' && (
                        <SettingSection 
                            icon={Shield} 
                            title="Security Settings" 
                            description="Protection / PIN / Biometric - Secure your account."
                            active={true}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <Key className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Change Password</p>
                                            <p className="text-xs text-gray-500">Update your account password</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-black uppercase tracking-widest text-black hover:underline">Change</button>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <Fingerprint className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Biometric Login</p>
                                            <p className="text-xs text-gray-500">Face ID or Fingerprint</p>
                                        </div>
                                    </div>
                                    <Toggle active={true} onToggle={() => {}} />
                                </div>
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <Sliders className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Transaction PIN</p>
                                            <p className="text-xs text-gray-500">Required for all payments</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-black uppercase tracking-widest text-black hover:underline">Set PIN</button>
                                </div>
                            </div>
                        </SettingSection>
                    )}

                    {activeTab === 'cards' && (
                        <SettingSection 
                            icon={CreditCard} 
                            title="Cards Management" 
                            description="Enable/Disable/Limits - Control your physical and virtual cards."
                            active={true}
                        >
                            <div className="space-y-8">
                                <div className="p-8 bg-[#0A0A0A] rounded-[32px] text-white flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Main Visa Card</p>
                                            <p className="text-xs text-gray-500">**** 4589</p>
                                        </div>
                                    </div>
                                    <Toggle active={true} onToggle={() => {}} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Daily ATM Limit</h4>
                                        <div className="flex items-center gap-4">
                                            <input type="range" className="flex-1 accent-black" min="0" max="10000" defaultValue="5000" />
                                            <span className="text-sm font-black text-gray-900">5,000 DH</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Online Purchase Limit</h4>
                                        <div className="flex items-center gap-4">
                                            <input type="range" className="flex-1 accent-black" min="0" max="50000" defaultValue="20000" />
                                            <span className="text-sm font-black text-gray-900">20,000 DH</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Contactless Pay</button>
                                    <button className="px-6 py-3 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">International Use</button>
                                    <button className="px-6 py-3 rounded-xl bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-100 transition-colors">Report Stolen</button>
                                </div>
                            </div>
                        </SettingSection>
                    )}

                    {activeTab === 'notifications' && (
                        <SettingSection 
                            icon={Bell} 
                            title="Notifications" 
                            description="SMS / Email Alerts - Stay informed about your activity."
                            active={true}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Push Notifications</p>
                                        <p className="text-xs text-gray-500">Transaction alerts and security warnings</p>
                                    </div>
                                    <Toggle active={true} onToggle={() => {}} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Email Alerts</p>
                                        <p className="text-xs text-gray-500">Monthly statements and reports</p>
                                    </div>
                                    <Toggle active={true} onToggle={() => {}} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">SMS Verification</p>
                                        <p className="text-xs text-gray-500">One-time passcodes for payments</p>
                                    </div>
                                    <Toggle active={false} onToggle={() => {}} />
                                </div>
                            </div>
                        </SettingSection>
                    )}

                    {activeTab === 'language' && (
                        <SettingSection 
                            icon={Languages} 
                            title="Language & Regional" 
                            description="العربية / Français - Customize your interface language."
                            active={true}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['English', 'Français', 'العربية'].map((lang) => (
                                    <button 
                                        key={lang}
                                        className={clsx(
                                            "p-6 rounded-3xl border-2 transition-all text-center",
                                            lang === 'English' ? "border-black bg-black text-white" : "border-gray-50 bg-white hover:border-gray-200"
                                        )}
                                    >
                                        <span className="text-sm font-bold">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </SettingSection>
                    )}

                    {activeTab === 'beneficiaries' && (
                        <SettingSection 
                            icon={Users} 
                            title="Beneficiaries" 
                            description="المستفيدين - Manage people you send money to frequently."
                            active={true}
                        >
                            <div className="space-y-4">
                                {beneficiaries.map((b) => (
                                    <div key={b.id} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-3xl shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">
                                                {b.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{b.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{b.bank} • {b.account}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 hover:border-black hover:text-black transition-all flex items-center justify-center gap-2 font-bold text-sm">
                                    <Plus className="w-4 h-4" /> Add New Beneficiary
                                </button>
                            </div>
                        </SettingSection>
                    )}

                    {activeTab === 'devices' && (
                        <SettingSection 
                            icon={Smartphone} 
                            title="Device Management" 
                            description="الأجهزة المرتبطة - Sessions and devices with account access."
                            active={true}
                        >
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-3xl shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                <Smartphone className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-gray-900">{session.device}</p>
                                                    {session.status === 'Current Session' && (
                                                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-600 uppercase tracking-widest">Active</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{session.location} • {session.last_active}</p>
                                            </div>
                                        </div>
                                        {session.status !== 'Current Session' && (
                                            <button className="text-xs font-black uppercase tracking-widest text-red-500 hover:underline">Logout Device</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SettingSection>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
