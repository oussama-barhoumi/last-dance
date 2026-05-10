import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Plus, CreditCard, Shield, Lock, Eye, EyeOff, 
    TrendingUp, ArrowUpRight, ArrowDownLeft, ChevronRight,
    Settings, Globe, Zap, Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const CardVisual = ({ card, showDetails }) => {
    const { t } = useTranslation();
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className={clsx(
                "relative h-56 rounded-[32px] p-8 text-white shadow-2xl overflow-hidden group",
                card.type === 'Visa' ? "bg-gradient-to-br from-gray-900 to-black" : "bg-gradient-to-br from-purple-600 to-indigo-700"
            )}
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{t('accounts.available_balance')}</p>
                        <p className="text-2xl font-black">${parseFloat(card.balance).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        {card.type === 'Visa' ? <Globe className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-lg font-medium tracking-[0.2em]">
                        {showDetails ? card.card_number : `**** **** **** ${card.card_number.slice(-4)}`}
                    </p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">{t('cards.card_holder')}</p>
                            <p className="text-xs font-bold uppercase">{card.holder_name || 'JOHN DOE'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">{t('cards.expires')}</p>
                            <p className="text-xs font-bold">{card.expiry_date || '12/26'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Index({ cards, totalCardBalance, recentTransactions }) {
    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <DashboardLayout>
            <Head title={`${t('cards.title')} - HarborBank`} />

            <div className="space-y-8 mt-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">{t('cards.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('cards.total_combined')} <span className="text-black font-black">${totalCardBalance.toLocaleString()}</span></p>
                    </div>
                    <Link 
                        href={route('cards.request')}
                        className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-black/10"
                    >
                        <Plus className="w-5 h-5" /> {t('cards.request_new')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Cards View */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cards.map((card) => (
                                <div key={card.id} className="space-y-4">
                                    <CardVisual card={card} showDetails={showDetails} />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setShowDetails(!showDetails)}
                                            className="flex-1 bg-white border border-gray-100 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                        >
                                            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            {showDetails ? t('cards.hide_details') : t('cards.show_details')}
                                        </button>
                                        <button className="flex-1 bg-white border border-gray-100 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                            <Lock className="w-4 h-4" /> {t('cards.freeze')}
                                        </button>
                                        <button className="bg-white border border-gray-100 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                            <Settings className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Card Benefits */}
                        <div className="bg-[#FAF9F6] p-10 rounded-[40px] border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Crown className="w-6 h-6 text-yellow-500" /> {t('cards.exclusive_benefits')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Shield className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{t('cards.purchase_protection')}</h4>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t('cards.purchase_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{t('cards.cashback_rewards')}</h4>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t('cards.cashback_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Analytics */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
                                {t('dashboard.recent_activity')}
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                            </h3>
                            <div className="space-y-6">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 font-bold text-xs group-hover:bg-black group-hover:text-white transition-colors">
                                                {tx.description.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{tx.description}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={clsx(
                                                "text-xs font-black",
                                                tx.type === 'receive' ? "text-green-500" : "text-gray-900"
                                            )}>
                                                {tx.type === 'receive' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-black p-8 rounded-[40px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/40 transition-colors" />
                            <h3 className="text-lg font-black mb-2 relative z-10">{t('cards.card_analytics')}</h3>
                            <p className="text-xs text-gray-400 mb-8 relative z-10">{t('cards.spending_distribution')}</p>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                        <span>{t('cards.physical_card')}</span>
                                        <span>72%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                        <span>{t('cards.virtual_card')}</span>
                                        <span>28%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '28%' }} className="h-full bg-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
