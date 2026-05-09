import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    CreditCard, Plus, Shield, Lock, Unlock, 
    Eye, EyeOff, Settings, ArrowUpRight, ArrowDownLeft,
    PieChart, Zap, Layers, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

const BankCard = ({ card }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isFrozen, setIsFrozen] = useState(card.is_frozen);

    const getTheme = (theme) => {
        switch(theme) {
            case 'purple': return 'from-purple-600 to-indigo-700 shadow-purple-500/20';
            case 'gradient': return 'from-pink-500 via-purple-500 to-indigo-500 shadow-indigo-500/20';
            case 'black': 
            default: return 'from-zinc-800 to-black shadow-black/40';
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
        >
            <div className={clsx(
                "relative aspect-[1.586/1] w-full rounded-[24px] p-8 text-white overflow-hidden transition-all duration-500 shadow-2xl bg-gradient-to-br",
                getTheme(card.color_theme),
                isFrozen && "grayscale contrast-75 brightness-75"
            )}>
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                
                {/* Chip & Type */}
                <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-lg shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 flex flex-col justify-around py-1 opacity-50">
                            {[1,2,3,4].map(i => <div key={i} className="h-px bg-black/20 w-full" />)}
                        </div>
                    </div>
                    <img 
                        src={card.type === 'visa' ? "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"} 
                        alt="Card Type" 
                        className="h-8 filter brightness-0 invert opacity-80"
                    />
                </div>

                {/* Card Number */}
                <div className="mb-8">
                    <p className="text-xl md:text-2xl font-medium tracking-[0.2em] shadow-sm">
                        {showDetails ? card.card_number : `•••• •••• •••• ${card.card_number.slice(-4)}`}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Card Holder</p>
                        <p className="text-sm font-bold tracking-tight">{card.card_holder}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Expires</p>
                        <p className="text-sm font-bold tracking-tight">{card.expiry_date}</p>
                    </div>
                </div>

                {/* Frozen Overlay */}
                <AnimatePresence>
                    {isFrozen && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10"
                        >
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-white" />
                                <span className="font-black text-white text-xs uppercase tracking-widest">Card Frozen</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-3">
                <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-1 bg-white border border-gray-100 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-900 hover:border-black transition-all shadow-sm"
                >
                    {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showDetails ? "Hide" : "Details"}
                </button>
                <button 
                    onClick={() => setIsFrozen(!isFrozen)}
                    className={clsx(
                        "flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm",
                        isFrozen ? "bg-black text-white" : "bg-white border border-gray-100 text-gray-900 hover:border-red-200 hover:text-red-600"
                    )}
                >
                    {isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {isFrozen ? "Unfreeze" : "Freeze"}
                </button>
                <button className="bg-white border border-gray-100 p-3 rounded-2xl flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all shadow-sm">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default function Index({ cards, totalCardBalance, recentTransactions }) {
    const stagger = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <DashboardLayout>
            <Head title="Card Management - HarborBank" />

            <div className="space-y-10 mt-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Card Management</h2>
                        <p className="text-sm text-gray-500 mt-1">Configure your physical and virtual payment methods.</p>
                    </div>
                    <button className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-black/10">
                        <Plus className="w-5 h-5" /> Request New Card
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Cards Grid */}
                    <div className="lg:col-span-8 space-y-10">
                        <motion.div 
                            variants={stagger}
                            initial="initial"
                            animate="animate"
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {cards.map(card => (
                                <BankCard key={card.id} card={card} />
                            ))}
                            
                            {/* Empty Add Slot */}
                            <button className="aspect-[1.586/1] border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-black hover:text-black transition-all group">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-bold text-sm">Add New Card</span>
                            </button>
                        </motion.div>

                        {/* Card Analytics */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <PieChart className="w-6 h-6" /> Card Analytics
                                </h3>
                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                    <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">Month</button>
                                    <button className="px-4 py-1.5 text-gray-400 text-xs font-bold">Year</button>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Spending</p>
                                    <p className="text-2xl font-black text-gray-900">$12,450.00</p>
                                    <div className="mt-4 flex items-center gap-1 text-green-500 font-bold text-[10px]">
                                        <ArrowUpRight className="w-3 h-3" /> 12% from last month
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Card Limits</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-2xl font-black text-gray-900">$5,000</p>
                                        <p className="text-[10px] font-bold text-gray-400 mb-1">/ $10,000</p>
                                    </div>
                                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-black w-[50%]" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-gray-100 flex flex-col justify-between">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Cards</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-black" />
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500" />
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300" />
                                        </div>
                                        <span className="text-sm font-black text-gray-900 ml-2">3 Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Quick Security */}
                        <div className="bg-[#0A0A0A] p-10 rounded-[40px] text-white">
                            <h3 className="text-xl font-black mb-8">Card Security</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Zap className="w-5 h-5 text-yellow-500" /></div>
                                        <span className="text-sm font-bold">Contactless Payments</span>
                                    </div>
                                    <button className="w-10 h-5 bg-purple-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Layers className="w-5 h-5 text-blue-500" /></div>
                                        <span className="text-sm font-bold">Online Transactions</span>
                                    </div>
                                    <button className="w-10 h-5 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-green-500" /></div>
                                        <span className="text-sm font-bold">ATM Withdrawals</span>
                                    </div>
                                    <button className="w-10 h-5 bg-purple-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></button>
                                </div>
                            </div>
                            
                            <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                    <span className="text-sm font-bold">Purchase Protection</span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                    Your physical cards are covered by HarborBank's advanced fraud protection and zero-liability policy.
                                </p>
                            </div>
                        </div>

                        {/* Recent Card Transactions */}
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                            <h3 className="text-xl font-black text-gray-900 mb-8">Recent Card Tx</h3>
                            <div className="space-y-6">
                                {recentTransactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                tx.type === 'receive' ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                                            )}>
                                                {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 leading-tight">{tx.description}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase">{tx.payment_method}</p>
                                            </div>
                                        </div>
                                        <p className={clsx(
                                            "text-xs font-black",
                                            tx.type === 'receive' ? "text-green-500" : "text-gray-900"
                                        )}>
                                            {tx.type === 'receive' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 rounded-2xl bg-gray-50 text-gray-400 text-xs font-bold hover:bg-gray-100 hover:text-black transition-all">
                                View Full History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
