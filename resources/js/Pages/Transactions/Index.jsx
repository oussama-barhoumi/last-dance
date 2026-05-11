import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, Filter, Download, ChevronLeft, ChevronRight, 
    MoreHorizontal, ArrowUpRight, ArrowDownLeft, Eye, 
    Calendar, CreditCard as CardIcon, Wallet, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const styles = {
        success: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    };
    return (
        <span className={clsx('px-3 py-1 rounded-full text-[10px] font-bold border capitalize transition-colors', styles[status])}>
            {t(`transactions.${status}`)}
        </span>
    );
};

export default function Index({ transactions, filters, recentActivity }) {
    const { t } = useTranslation();
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('transactions.index'), { search, type: filters.type, status: filters.status }, { preserveState: true });
    };

    const exportToCSV = () => {
        if (!transactions || transactions.data.length === 0) return;
        
        const headers = [
            t('transactions.transaction_id'), 
            t('transactions.description'), 
            t('transactions.type'), 
            t('transactions.amount'), 
            t('transactions.status'), 
            t('transactions.date'), 
            t('transactions.payment_method')
        ];
        
        const rows = transactions.data.map(tx => [
            tx.transaction_id,
            `"${tx.description.replace(/"/g, '""')}"`, // escape quotes and commas
            tx.type,
            tx.amount,
            tx.status,
            new Date(tx.date).toLocaleDateString(),
            tx.payment_method
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `HarborBank_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout>
            <Head title={`${t('transactions.title')} - HarborBank`} />

            <div className="space-y-8 mt-8">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">{t('transactions.title')}</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{t('transactions.desc')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:border-black dark:hover:border-white transition-colors shadow-sm"
                        >
                            <FileText className="w-4 h-4" /> {t('transactions.export_csv')}
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-black/10 print:hidden"
                        >
                            <Download className="w-4 h-4" /> {t('transactions.download_statement')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Table Column */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Filters Bar */}
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-4 transition-colors">
                            <form onSubmit={handleSearch} className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder={t('transactions.search_placeholder')}
                                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 border-transparent rounded-xl text-sm focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </form>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <select 
                                    className="bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 border-transparent rounded-xl text-xs font-bold px-4 py-2.5 focus:ring-black dark:focus:ring-white"
                                    value={filters.type || 'all'}
                                    onChange={e => router.get(route('transactions.index'), { ...filters, type: e.target.value })}
                                >
                                    <option value="all">{t('transactions.all_types')}</option>
                                    <option value="expense">{t('transactions.expense')}</option>
                                    <option value="receive">{t('transactions.receive')}</option>
                                </select>
                                <select 
                                    className="bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 border-transparent rounded-xl text-xs font-bold px-4 py-2.5 focus:ring-black dark:focus:ring-white"
                                    value={filters.status || 'all'}
                                    onChange={e => router.get(route('transactions.index'), { ...filters, status: e.target.value })}
                                >
                                    <option value="all">{t('transactions.all_status')}</option>
                                    <option value="success">{t('transactions.success')}</option>
                                    <option value="pending">{t('transactions.pending')}</option>
                                    <option value="failed">{t('transactions.failed')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-50 dark:border-zinc-800 overflow-hidden transition-colors">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.transaction_id')}</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.description')}</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.type')}</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.amount')}</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.status')}</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('transactions.date')}</th>
                                            <th className="px-8 py-5 text-right"></th>
                                        </tr>
                                    </thead>
                                    <motion.tbody variants={container} initial="hidden" animate="show">
                                        {transactions.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Search className="w-12 h-12 text-gray-200 dark:text-zinc-700" />
                                                        <p className="text-gray-400 font-bold">{t('transactions.no_transactions')}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.data.map((tx) => (
                                                <motion.tr 
                                                    key={tx.id} 
                                                    variants={item}
                                                    className="border-b border-gray-50 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                                                    onClick={() => setSelectedTransaction(tx)}
                                                >
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-black text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">#{tx.transaction_id}</span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={clsx(
                                                                'w-8 h-8 rounded-lg flex items-center justify-center',
                                                                tx.type === 'receive' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                            )}>
                                                                {tx.type === 'receive' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">{tx.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 capitalize">{t(`transactions.${tx.type}`)}</span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className={clsx(
                                                            'text-sm font-black',
                                                            tx.type === 'receive' ? 'text-green-500' : 'text-gray-900 dark:text-zinc-100'
                                                        )}>
                                                            {tx.type === 'receive' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <StatusBadge status={tx.status} />
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="text-xs font-bold text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-black dark:hover:text-white">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </motion.tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-8 py-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between bg-gray-50/10 dark:bg-zinc-800/10">
                                <p className="text-xs font-bold text-gray-400">
                                    {t('transactions.showing')} <span className="text-black dark:text-white">{transactions.from}</span> {t('transactions.to')} <span className="text-black dark:text-white">{transactions.to}</span> {t('transactions.of')} <span className="text-black dark:text-white">{transactions.total}</span> {t('transactions.entries')}
                                </p>
                                <div className="flex items-center gap-2">
                                    {transactions.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={clsx(
                                                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                                                link.active ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800',
                                                !link.url && 'opacity-50 cursor-not-allowed'
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Column */}
                    <div className="space-y-8">
                        {/* Quick Activity */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-50 dark:border-zinc-800 transition-colors">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">{t('dashboard.recent_activity')}</h3>
                            <div className="space-y-6">
                                {recentActivity.map((tx, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== recentActivity.length - 1 && (
                                            <div className="absolute left-4 top-10 w-0.5 h-6 bg-gray-100 dark:bg-zinc-800" />
                                        )}
                                        <div className={clsx(
                                            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
                                            tx.type === 'receive' ? 'bg-green-500' : 'bg-black dark:bg-white'
                                        )}>
                                            {tx.type === 'receive' ? <ArrowDownLeft className="w-3 h-3 text-white" /> : <ArrowUpRight className="w-3 h-3 text-white dark:text-black" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 leading-tight">{tx.description}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Widget - already dark bg */}
                        <div className="bg-[#0A0A0A] dark:bg-zinc-950 p-8 rounded-[32px] shadow-sm text-white overflow-hidden relative group border border-transparent dark:border-zinc-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors" />
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">{t('transactions.payment_method')}</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-lg"><CardIcon className="w-4 h-4" /></div>
                                        <span className="text-sm font-bold">{t('transactions.credit_card')}</span>
                                    </div>
                                    <span className="text-xs font-black text-gray-400">42%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-lg"><Wallet className="w-4 h-4" /></div>
                                        <span className="text-sm font-bold">{t('transactions.bank_transfer')}</span>
                                    </div>
                                    <span className="text-xs font-black text-gray-400">38%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Details Modal */}
            <AnimatePresence>
                {selectedTransaction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTransaction(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden border border-transparent dark:border-zinc-800"
                        >
                            <div className="bg-[#FAF9F6] dark:bg-zinc-800/50 p-10 text-center border-b border-gray-100 dark:border-zinc-800">
                                <div className={clsx(
                                    'w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl',
                                    selectedTransaction.type === 'receive' ? 'bg-green-500' : 'bg-black dark:bg-zinc-700'
                                )}>
                                    {selectedTransaction.type === 'receive' ? <ArrowDownLeft className="w-10 h-10 text-white" /> : <ArrowUpRight className="w-10 h-10 text-white" />}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedTransaction.description}</h3>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-2">{t(`dashboard.categories.${selectedTransaction.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`)}</p>
                                <div className="mt-6">
                                    <span className={clsx(
                                        'text-4xl font-black',
                                        selectedTransaction.type === 'receive' ? 'text-green-500' : 'text-gray-900 dark:text-white'
                                    )}>
                                        {selectedTransaction.type === 'receive' ? '+' : '-'}${parseFloat(selectedTransaction.amount).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 space-y-6">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('transactions.transaction_id')}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">#{selectedTransaction.transaction_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('transactions.status')}</p>
                                        <StatusBadge status={selectedTransaction.status} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('transactions.date')}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> {new Date(selectedTransaction.date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('transactions.payment_method')}</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                                            <CardIcon className="w-3 h-3" /> {t(`transactions.${selectedTransaction.payment_method.toLowerCase().replace(/ /g, '_')}`)}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                                    <button className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">
                                        {t('transactions.download_receipt')}
                                    </button>
                                    <button 
                                        onClick={() => setSelectedTransaction(null)}
                                        className="w-full text-sm font-bold text-gray-400 mt-4 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        {t('transactions.close_details')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
