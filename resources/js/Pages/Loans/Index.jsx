import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    TrendingUp, DollarSign, Calendar, Target, 
    ArrowUpRight, ArrowDownLeft, ChevronRight, 
    Search, Bell, Calculator, Upload, FileText, 
    CreditCard, PieChart, ShieldCheck, Zap,
    Home, Car, Briefcase, GraduationCap, Info,
    CheckCircle2, Clock, AlertCircle, Sparkles,
    X, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
    LineChart, Line, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const chartData = [
    { name: 'Jan', payment: 2400 },
    { name: 'Feb', payment: 2450 },
    { name: 'Mar', payment: 2300 },
    { name: 'Apr', payment: 2600 },
    { name: 'May', payment: 2450 },
    { name: 'Jun', payment: 2500 },
];

const StatCard = ({ icon: Icon, title, value, trend, trendUp }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 group transition-all"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
            </div>
            <div className={clsx(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                trendUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                {trend}
            </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-black text-gray-900">{value}</h4>
    </motion.div>
);

const getLoanTypeKey = (type) => {
    const map = {
        'Home Loan': 'home',
        'Car Loan': 'car',
        'Business Loan': 'business',
        'Student Loan': 'student'
    };
    return map[type] || type;
};

export default function Index({ auth, stats, activeLoans, recentTransactions }) {
    const { t } = useTranslation();
    const [showPayModal, setShowPayModal] = useState(false);
    const [showCalcModal, setShowCalcModal] = useState(false);
    const [showStatementModal, setShowStatementModal] = useState(false);
    
    // EMI Calculator State
    const [calcData, setCalcData] = useState({
        amount: 100000,
        rate: 4.5,
        duration: 24
    });

    const calculateEMI = () => {
        const p = Number(calcData.amount);
        const r = (Number(calcData.rate) / 12) / 100;
        const n = Number(calcData.duration);
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return isFinite(emi) ? emi : 0;
    };

    const emi = calculateEMI();
    const totalPayment = emi * calcData.duration;
    const totalInterest = totalPayment - calcData.amount;

    const { data, setData, post, processing, errors, reset } = useForm({
        loan_id: '',
        amount: '',
    });

    const handlePaySubmit = (e) => {
        e.preventDefault();
        post(route('loans.pay'), {
            onSuccess: () => {
                setShowPayModal(false);
                reset();
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={`${t('loans.title')} - HarborBank`} />

            <div className="space-y-10 mt-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">{t('loans.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('loans.desc')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder={t('loans.search_placeholder')}
                                className="bg-white border-none rounded-2xl pl-11 pr-6 py-3 text-sm shadow-sm focus:ring-2 focus:ring-black w-64 transition-all"
                            />
                        </div>
                        <button className="bg-white p-3 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="bg-black text-white p-1 rounded-2xl flex items-center gap-3 pl-4 pr-1 shadow-xl">
                            <span className="text-xs font-black">${auth.user.balance}</span>
                            <img src={auth.user.profile_photo_url} className="w-8 h-8 rounded-xl object-cover" alt="" />
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={DollarSign} title={t('loans.total_balance')} value={`$${Number(stats.total_balance).toLocaleString()}`} trend="12.5%" trendUp={false} />
                    <StatCard icon={Calendar} title={t('loans.monthly_payment')} value={`$${Number(stats.monthly_payment).toLocaleString()}`} trend="2.4%" trendUp={true} />
                    <StatCard icon={Target} title={t('loans.remaining_amount')} value={`$${Number(stats.remaining_amount).toLocaleString()}`} trend="8.1%" trendUp={false} />
                    <StatCard icon={TrendingUp} title={t('loans.loan_score')} value={stats.loan_score} trend="+15" trendUp={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Active Loans Table */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900">{t('loans.active_loans')}</h3>
                                <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">{t('loans.view_all')}</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.type')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.provider')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.remaining')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.status')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.progress')}</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t('loans.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeLoans.map((loan) => (
                                            <tr key={loan.id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                            {loan.type === 'Home Loan' && <Home className="w-5 h-5 text-blue-600" />}
                                                            {loan.type === 'Car Loan' && <Car className="w-5 h-5 text-orange-600" />}
                                                            {loan.type === 'Business Loan' && <Briefcase className="w-5 h-5 text-purple-600" />}
                                                            {loan.type === 'Student Loan' && <GraduationCap className="w-5 h-5 text-green-600" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{t(`loans.types.${getLoanTypeKey(loan.type)}`)}</p>
                                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{loan.interest_rate}% {t('loans.rate')}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-bold text-gray-900">{loan.provider}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900">${Number(loan.remaining_amount).toLocaleString()}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{t('loans.total')}: ${Number(loan.amount).toLocaleString()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={clsx(
                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                                        loan.status === 'approved' ? "bg-green-100 text-green-600" : 
                                                        loan.status === 'pending' ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
                                                    )}>
                                                        {t(`common.status.${loan.status}`)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-24">
                                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1">
                                                            <span>{loan.progress}%</span>
                                                        </div>
                                                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }} 
                                                                animate={{ width: `${loan.progress}%` }} 
                                                                className={clsx(
                                                                    "h-full rounded-full",
                                                                    loan.status === 'approved' ? "bg-black" : "bg-gray-400"
                                                                )} 
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => {
                                                            setData('loan_id', loan.id);
                                                            setShowPayModal(true);
                                                        }}
                                                        className="text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-black hover:text-white px-4 py-2 rounded-xl transition-all"
                                                    >
                                                        {t('loans.pay_emi')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {activeLoans.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Info className="w-8 h-8 text-gray-200 mb-4" />
                                                        <p className="text-sm font-bold text-gray-400">{t('loans.no_active_loans')}</p>
                                                        <Link href={route('loans.apply')} className="text-xs text-black font-black uppercase mt-2 hover:underline">{t('loans.apply_first')}</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Analytics Chart */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">{t('loans.analytics')}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{t('loans.analytics_desc')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{t('loans.monthly')}</button>
                                    <button className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">{t('loans.yearly')}</button>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '20px', 
                                                border: 'none', 
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="payment" 
                                            stroke="#000" 
                                            strokeWidth={3} 
                                            fillOpacity={1} 
                                            fill="url(#colorPayment)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action & Info Panel */}
                    <div className="space-y-10">
                        {/* Quick Actions */}
                        <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white">
                            <h3 className="text-xl font-bold mb-8">{t('loans.quick_actions')}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link 
                                    href={route('loans.apply')}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                                >
                                    <Plus className="w-5 h-5" /> {t('loans.apply_loan')}
                                </Link>
                                <button 
                                    onClick={() => setShowPayModal(true)}
                                    className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                                >
                                    <CreditCard className="w-5 h-5" /> {t('loans.pay_emi')}
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setShowStatementModal(true)}
                                        className="bg-zinc-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-colors"
                                    >
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <span className="text-[10px] font-bold">{t('loans.statement')}</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowCalcModal(true)}
                                        className="bg-zinc-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-zinc-800 transition-colors"
                                    >
                                        <Calculator className="w-5 h-5 text-gray-500" />
                                        <span className="text-[10px] font-bold">{t('loans.calculator')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loan Eligibility Widget */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                            <h3 className="text-lg font-black text-gray-900 mb-6">{t('loans.eligibility')}</h3>
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="440" strokeLinecap="round" className="text-black" style={{ strokeDashoffset: 440 - (440 * 85) / 100 }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black">85%</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('loans.excellent')}</span>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-8 w-full">
                                    <div className="text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('loans.max_amount')}</p>
                                        <p className="text-sm font-black text-gray-900">$2.5M</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('loans.interest')}</p>
                                        <p className="text-sm font-black text-gray-900">3.2%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-[40px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors" />
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-200" />
                                <h3 className="text-lg font-bold">{t('loans.ai_insight')}</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-purple-100 mb-6">
                                {t('loans.ai_desc')}
                            </p>
                            <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors backdrop-blur-md">
                                {t('loans.explore_offer')}
                            </button>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                            <h3 className="text-lg font-black text-gray-900 mb-6">{t('loans.recent_activity')}</h3>
                            <div className="space-y-6">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 font-bold text-xs group-hover:bg-black group-hover:text-white transition-colors">
                                                {tx.type === 'debit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{tx.description}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={clsx(
                                                "text-xs font-black",
                                                tx.type === 'credit' ? "text-green-500" : "text-gray-900"
                                            )}>
                                                {tx.type === 'credit' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                                            </p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t(`common.status.${tx.status}`)}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentTransactions.length === 0 && (
                                    <p className="text-xs text-center text-gray-400 py-4">{t('loans.no_activity')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay EMI Modal */}
            <AnimatePresence>
                {showPayModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPayModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black p-2 rounded-xl text-white">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">{t('loans.pay_emi')}</h3>
                                </div>
                                <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handlePaySubmit} className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.select_loan')}</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {activeLoans.map((loan) => (
                                                <div 
                                                    key={loan.id}
                                                    onClick={() => setData('loan_id', loan.id)}
                                                    className={clsx(
                                                        "p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center",
                                                        data.loan_id === loan.id ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                            {loan.type === 'Home Loan' && <Home className="w-4 h-4 text-blue-600" />}
                                                            {loan.type === 'Car Loan' && <Car className="w-4 h-4 text-orange-600" />}
                                                            {loan.type === 'Business Loan' && <Briefcase className="w-4 h-4 text-purple-600" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900">{t(`loans.types.${getLoanTypeKey(loan.type)}`)}</p>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">EMI: ${Number(loan.monthly_payment).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    {data.loan_id === loan.id && <CheckCircle2 className="w-5 h-5 text-black" />}
                                                </div>
                                            ))}
                                        </div>
                                        {errors.loan_id && <p className="text-[10px] text-red-500 px-1">{errors.loan_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.payment_amount')}</label>
                                        <div className="relative">
                                            <input 
                                                type="number"
                                                value={data.amount}
                                                onChange={e => setData('amount', e.target.value)}
                                                placeholder={t('loans.amount_placeholder')}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-5 text-lg font-black text-gray-900 focus:ring-2 focus:ring-black transition-all"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const loan = activeLoans.find(l => l.id === data.loan_id);
                                                        if(loan) setData('amount', loan.monthly_payment);
                                                    }}
                                                    className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors"
                                                >
                                                    {t('loans.full_emi')}
                                                </button>
                                                <div className="h-4 w-[1px] bg-gray-200" />
                                                <span className="text-sm font-black text-gray-900">USD</span>
                                            </div>
                                        </div>
                                        {errors.amount && <p className="text-[10px] text-red-500 px-1">{errors.amount}</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>{t('loans.current_balance')}</span>
                                        <span className="text-gray-900">${auth.user.balance}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>{t('loans.processing_fee')}</span>
                                        <span className="text-green-600">{t('loans.free')}</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between text-xs font-black uppercase tracking-widest">
                                        <span className="text-gray-900">{t('loans.total_payable')}</span>
                                        <span className="text-gray-900">${data.amount || '0.00'}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-black text-white py-5 rounded-[20px] font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                                >
                                    {processing ? t('loans.processing_payment') : t('loans.confirm_payment')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Loan Calculator Modal */}
            <AnimatePresence>
                {showCalcModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCalcModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black p-2 rounded-xl text-white">
                                        <Calculator className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">{t('loans.loan_calculator')}</h3>
                                </div>
                                <button onClick={() => setShowCalcModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-8 space-y-6 border-r border-gray-50">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.loan_amount')}</label>
                                        <input 
                                            type="number"
                                            value={calcData.amount}
                                            onChange={e => setCalcData({...calcData, amount: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg font-black focus:ring-2 focus:ring-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.interest_rate')}</label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            value={calcData.rate}
                                            onChange={e => setCalcData({...calcData, rate: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg font-black focus:ring-2 focus:ring-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.duration')}</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[12, 24, 36, 60].map(m => (
                                                <button 
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setCalcData({...calcData, duration: m})}
                                                    className={clsx(
                                                        "py-2 rounded-xl text-[10px] font-black transition-all",
                                                        Number(calcData.duration) === m ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {m/12}Y
                                                </button>
                                            ))}
                                        </div>
                                        <input 
                                            type="number"
                                            value={calcData.duration}
                                            onChange={e => setCalcData({...calcData, duration: e.target.value})}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg font-black focus:ring-2 focus:ring-black transition-all mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50/30 flex flex-col justify-center space-y-8">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
                                        <h4 className="text-4xl font-black text-gray-900">${emi.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-black" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.principal')}</span>
                                            </div>
                                            <span className="text-sm font-black text-gray-900">${Number(calcData.amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.total_interest')}</span>
                                            </div>
                                            <span className="text-sm font-black text-gray-900">${totalInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest">{t('loans.total_payable')}</span>
                                            <span className="text-lg font-black text-gray-900">${totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        </div>
                                    </div>

                                    <Link 
                                        href={route('loans.apply')}
                                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm text-center hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {t('loans.apply_this_loan')}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Loan Statement Modal */}
            <AnimatePresence>
                {showStatementModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowStatementModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black p-2 rounded-xl text-white">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{t('loans.loan_statement')}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.activity_record')}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowStatementModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Statement Header */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-white fill-white" />
                                            </div>
                                            <span className="text-xl font-black tracking-tighter">HarborBank</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-gray-900">{auth.user.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">Account: **** **** {auth.user.id}42</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{t('loans.period')}: May 2026 - Present</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.outstanding')}</p>
                                            <p className="text-2xl font-black text-gray-900">${Number(stats.total_balance).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('loans.active_loans')}</p>
                                            <p className="text-sm font-black text-gray-900">{t('loans.portfolio_items', { count: activeLoans.length })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Transactions Table */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{t('loans.history')}</h4>
                                    <div className="space-y-1">
                                        {recentTransactions.map((tx) => (
                                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-xs">
                                                        {tx.type === 'debit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase">{tx.date}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                            <span className="text-[9px] font-black text-gray-400 uppercase">{t('loans.txid')}: {tx.id}1092</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-gray-900">-${Number(tx.amount).toLocaleString()}</p>
                                                    <p className="text-[8px] font-black text-green-600 uppercase tracking-widest">{t('loans.success')}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {recentTransactions.length === 0 && (
                                            <div className="py-10 text-center space-y-2">
                                                <Info className="w-6 h-6 text-gray-200 mx-auto" />
                                                <p className="text-xs font-bold text-gray-400">No loan transactions found for this period.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Note */}
                                <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                                    <p className="text-[9px] leading-relaxed text-gray-400 font-bold uppercase tracking-wide">
                                        {t('loans.statement_note')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50/50 flex gap-4">
                                <button className="flex-1 bg-white text-black border border-gray-200 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4" /> {t('loans.export_csv')}
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                                >
                                    <FileText className="w-4 h-4" /> {t('loans.download_pdf')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
