import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    CreditCard, ShieldCheck, Copy, ExternalLink, 
    Plus, MoreVertical, ArrowUpRight, ArrowDownLeft, 
    Lock, CheckCircle2, AlertCircle, Building2,
    Wallet, Landmark, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

const AccountCard = ({ account }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isMain = account.account_type === 'Main Account';

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={clsx(
                "p-8 rounded-[40px] shadow-sm border transition-all relative overflow-hidden group",
                isMain ? "bg-[#0A0A0A] text-white border-black" : "bg-white text-gray-900 border-gray-50"
            )}
        >
            {isMain && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/30 transition-colors" />
            )}
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        isMain ? "bg-white/10" : "bg-gray-100"
                    )}>
                        {account.account_type.includes('Savings') ? <Wallet className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="font-black text-lg">{account.account_type}</h3>
                        <div className="flex items-center gap-2">
                            <span className={clsx("w-2 h-2 rounded-full", account.status === 'active' ? "bg-green-500" : "bg-yellow-500")} />
                            <span className={clsx("text-[10px] font-bold uppercase tracking-widest", isMain ? "text-gray-500" : "text-gray-400")}>
                                {account.status}
                            </span>
                        </div>
                    </div>
                </div>
                <button className={clsx("p-2 rounded-xl transition-colors", isMain ? "hover:bg-white/10 text-gray-500" : "hover:bg-gray-50 text-gray-400")}>
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-8 relative z-10">
                <p className={clsx("text-[10px] font-black uppercase tracking-widest mb-1", isMain ? "text-gray-500" : "text-gray-400")}>Available Balance</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{account.currency === 'DH' ? '' : account.currency === 'EUR' ? '€' : '$'}{parseFloat(account.balance).toLocaleString()}</span>
                    {account.currency === 'DH' && <span className="text-xl font-bold">DH</span>}
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="p-4 rounded-2xl bg-opacity-50 border border-transparent transition-colors group/row" style={{ backgroundColor: isMain ? 'rgba(255,255,255,0.05)' : '#F9FAFB' }}>
                    <p className={clsx("text-[10px] font-black uppercase tracking-widest mb-1", isMain ? "text-gray-500" : "text-gray-400")}>Account Number</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold tracking-wider">{account.account_number}</span>
                        <button onClick={() => copyToClipboard(account.account_number)} className="text-purple-500 hover:scale-110 transition-transform">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-opacity-50 border border-transparent transition-colors group/row" style={{ backgroundColor: isMain ? 'rgba(255,255,255,0.05)' : '#F9FAFB' }}>
                    <p className={clsx("text-[10px] font-black uppercase tracking-widest mb-1", isMain ? "text-gray-500" : "text-gray-400")}>IBAN</p>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium tracking-tight opacity-80 truncate mr-4">{account.iban}</span>
                        <button onClick={() => copyToClipboard(account.iban)} className="text-purple-500 hover:scale-110 transition-transform flex-shrink-0">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t flex items-center justify-between relative z-10" style={{ borderColor: isMain ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }}>
                <div className="flex items-center gap-2">
                    {account.is_verified ? (
                        <>
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-[10px] font-bold text-green-500 uppercase">Securely Verified</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-500 uppercase">Verification Pending</span>
                        </>
                    )}
                </div>
                <button className={clsx("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", isMain ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black")}>
                    Manage <ExternalLink className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
};

export default function Index({ accounts, totalBalance, recentTransactions }) {
    const staggerContainer = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout>
            <Head title="Accounts - HarborBank" />

            <div className="space-y-10 mt-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Your Accounts</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and monitor all your linked bank accounts in one place.</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Balance</p>
                            <p className="text-2xl font-black text-gray-900">${totalBalance.toLocaleString()}</p>
                        </div>
                        <button className="bg-black text-white p-4 rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-black/10">
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Accounts Grid */}
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {accounts.map((account) => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-3 rounded-2xl">
                                    <History className="w-5 h-5 text-gray-900" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900">Recent Activity</h3>
                            </div>
                            <button className="text-xs font-bold text-purple-500 hover:underline">View All History</button>
                        </div>

                        <div className="space-y-6">
                            {recentTransactions.length === 0 ? (
                                <div className="py-12 text-center text-gray-400 font-medium">No recent activity found.</div>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                tx.type === 'receive' ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                                            )}>
                                                {tx.type === 'receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={clsx(
                                                "text-sm font-black",
                                                tx.type === 'receive' ? "text-green-500" : "text-gray-900"
                                            )}>
                                                {tx.type === 'receive' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Security & Linked Accounts */}
                    <div className="space-y-8">
                        <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Lock className="w-5 h-5" /> Security Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-50">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">2FA Enabled</p>
                                        <p className="text-[10px] text-gray-400">Your account is fully protected.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-50 opacity-60">
                                    <AlertCircle className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Identity Verified</p>
                                        <p className="text-[10px] text-gray-400">Level 2 Verification Active.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white">
                            <h3 className="text-lg font-black mb-6">Linked Accounts</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-gray-500" />
                                        <span className="text-xs font-bold">Chase Bank</span>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase">Primary</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-gray-500" />
                                        <span className="text-xs font-bold">Bank of America</span>
                                    </div>
                                    <button className="text-[10px] font-black text-purple-500 hover:text-white transition-colors">CONNECT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
