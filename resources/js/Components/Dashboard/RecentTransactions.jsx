import { MoreHorizontal, Plus, Send, ShoppingBag, Wrench, Wallet2, TrendingUp, CreditCard, Laptop, Banknote, Coffee, Music, Smartphone } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const TransactionItem = ({ icon: Icon, title, category, amount, color, isNegative, date }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between py-4 group hover:bg-gray-50 dark:hover:bg-zinc-800/50 px-4 -mx-4 rounded-3xl transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-black text-sm text-gray-900 dark:text-zinc-100 group-hover:text-purple-600 transition-colors">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t(`dashboard.categories.${category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`)}</p>
                        {date && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-200" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{date}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className={clsx(
                "font-black text-sm",
                isNegative ? "text-gray-900 dark:text-zinc-100" : "text-green-600 dark:text-emerald-400"
            )}>
                {isNegative ? '-' : '+'}${Math.abs(amount).toLocaleString()}
            </p>
        </div>
    );
};

export default function RecentTransactions() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('online');

    const categories = [
        { id: 'online', name: t('dashboard.online'), icon: Laptop },
        { id: 'card', name: t('dashboard.card'), icon: CreditCard },
        { id: 'cash', name: t('dashboard.cash'), icon: Banknote },
    ];

    const transactionData = {
        online: [
            { icon: ShoppingBag, title: "Amazon Prime", category: "Subscription", amount: 14.99, color: "bg-blue-500", isNegative: true, date: t('dashboard.recent') },
            { icon: Music, title: "Spotify Family", category: "Entertainment", amount: 16.99, color: "bg-green-500", isNegative: true, date: "Yesterday" },
            { icon: Send, title: "Transfer to Sarah", category: "P2P Payment", amount: 250.00, color: "bg-purple-500", isNegative: true, date: "2 days ago" },
            { icon: Wallet2, title: "Freelance Pay", category: "Income", amount: 1500.00, color: "bg-black", isNegative: false, date: "3 days ago" },
        ],
        card: [
            { icon: Coffee, title: "Starbucks Coffee", category: "Food & Drink", amount: 5.50, color: "bg-orange-500", isNegative: true, date: t('dashboard.recent') },
            { icon: ShoppingBag, title: "Zara Fashion", category: "Shopping", amount: 89.90, color: "bg-pink-500", isNegative: true, date: t('dashboard.recent') },
            { icon: Smartphone, title: "Apple Store", category: "Technology", amount: 999.00, color: "bg-gray-900", isNegative: true, date: "1 week ago" },
        ],
        cash: [
            { icon: Banknote, title: "ATM Withdrawal", category: "Cash", amount: 200.00, color: "bg-zinc-800", isNegative: true, date: "Yesterday" },
            { icon: Wrench, title: "Local Repair", category: "Services", amount: 45.00, color: "bg-yellow-600", isNegative: true, date: "4 days ago" },
        ]
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm h-full flex flex-col border border-gray-50 dark:border-zinc-800 transition-colors">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{t('dashboard.recent_activity')}</h3>
                <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-50 dark:bg-zinc-800 p-2 rounded-xl">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Premium Tab Switcher */}
            <div className="flex p-1 bg-gray-50 dark:bg-zinc-800 rounded-2xl mb-8 transition-colors">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative",
                            activeTab === cat.id ? "text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        )}
                    >
                        {activeTab === cat.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-0 bg-black dark:bg-zinc-700 rounded-xl shadow-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <cat.icon className={clsx("w-3 h-3 relative z-10", activeTab === cat.id && "fill-current")} />
                        <span className="relative z-10">{cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        {transactionData[activeTab].map((tx, idx) => (
                            <TransactionItem key={idx} {...tx} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Link 
                href={route('transactions.index')}
                className="mt-8 w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-black dark:hover:bg-zinc-700 hover:text-white transition-all group"
            >
                {t('dashboard.view_full_statement')}
                <Plus className="w-3 h-3 transition-transform group-hover:rotate-90" />
            </Link>
        </div>
    );
}
