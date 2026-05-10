import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import StatsCard from '@/Components/Dashboard/StatsCard';
import BalanceHistoryChart from '@/Components/Dashboard/BalanceHistoryChart';
import RecentTransactions from '@/Components/Dashboard/RecentTransactions';
import QuickTransfer from '@/Components/Dashboard/QuickTransfer';
import InvestmentList from '@/Components/Dashboard/InvestmentList';
import SpendingManagement from '@/Components/Dashboard/SpendingManagement';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, X, QrCode, Scan, Camera, CheckCircle2, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ auth }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        receiver_email: '',
        amount: '',
        currency: 'USD',
        description: 'Direct Transfer',
    });

    const [showSendModal, setShowSendModal] = useState(false);
    const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' or 'qr'
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);

    const handleSendMoney = (e) => {
        e.preventDefault();
        post(route('transactions.send'), {
            onSuccess: () => {
                setShowSendModal(false);
                reset();
            },
        });
    };

    const startScanner = async () => {
        setIsScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
        }
    };

    const stopScanner = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setIsScanning(false);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard - HarborBank" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10 mt-8"
            >
                {/* Row 1: Financial Hub & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <motion.div variants={item} className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-zinc-800 p-8 rounded-[40px] text-gray-900 dark:text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group transition-colors">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2">{t('dashboard.financial_hub')}</h3>
                            <p className="text-gray-500 dark:text-zinc-400 text-xs font-medium max-w-[200px]">{t('dashboard.financial_hub_desc')}</p>
                            <div className="flex gap-4 mt-8">
                                <button 
                                    onClick={() => setShowSendModal(true)}
                                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/5"
                                >
                                    <Send className="w-3 h-3" /> {t('dashboard.send_money')}
                                </button>
                                <button className="bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2">
                                    <Plus className="w-3 h-3" /> {t('dashboard.add_payment')}
                                </button>
                            </div>
                        </div>
                        <div className="relative z-10 w-full md:w-auto bg-gray-50/80 dark:bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-zinc-800">
                            <p className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-1">{t('dashboard.your_balance')}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">${Number(auth.user.balance).toLocaleString()}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800" />)}
                                </div>
                                <span className="text-[8px] font-black text-gray-500 dark:text-zinc-500 uppercase">+12 {t('dashboard.recent')}</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-purple-600/20 dark:group-hover:bg-purple-600/30 transition-colors" />
                    </motion.div>

                    <motion.div variants={item} className="lg:col-span-1">
                        <StatsCard 
                            type="spending" 
                            label={t('dashboard.total_spending')} 
                            value="4,850" 
                        />
                    </motion.div>
                    <motion.div variants={item} className="lg:col-span-1">
                        <StatsCard 
                            type="investment" 
                            label={t('dashboard.net_portfolio')} 
                            value="124,500" 
                            dark 
                        />
                    </motion.div>
                </div>

                {/* Row 2: Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Balance History */}
                    <motion.div variants={item} className="lg:col-span-2 space-y-10">
                        <BalanceHistoryChart />
                        <SpendingManagement />
                        <InvestmentList />
                    </motion.div>

                    {/* Right: Side Panel */}
                    <motion.div variants={item} className="space-y-10">
                        <RecentTransactions />
                        <QuickTransfer />
                    </motion.div>
                </div>
            </motion.div>

            {/* Send Money Modal with QR Scanner */}
            <AnimatePresence>
                {showSendModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                stopScanner();
                                setShowSendModal(false);
                            }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-gray-100 dark:border-zinc-800"
                        >
                            <div className="p-8 flex justify-between items-center border-b border-gray-50 dark:border-zinc-800">
                                <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                    <div className="bg-purple-600 p-2 rounded-xl">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">{t('dashboard.send_money')}</h3>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{t('dashboard.global_secure_transfer')}</p>
                                    </div>
                                </div>
                                <button onClick={() => { stopScanner(); setShowSendModal(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-400 dark:text-zinc-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8">
                                {!isScanning ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => setActiveTab('transfer')}
                                                className={clsx(
                                                    "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                                                    activeTab === 'transfer' ? "bg-gray-50 dark:bg-zinc-800 border-purple-600" : "bg-gray-50/50 dark:bg-zinc-800/50 border-transparent text-gray-400 dark:text-zinc-500"
                                                )}
                                            >
                                                <Send className={clsx("w-6 h-6", activeTab === 'transfer' ? "text-purple-500" : "text-gray-400 dark:text-zinc-500")} />
                                                <span className={clsx("text-[10px] font-black uppercase tracking-widest", activeTab === 'transfer' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-zinc-500")}>{t('dashboard.transfer')}</span>
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab('qr')}
                                                className={clsx(
                                                    "p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all",
                                                    activeTab === 'qr' ? "bg-gray-50 dark:bg-zinc-800 border-purple-600" : "bg-gray-50/50 dark:bg-zinc-800/50 border-transparent text-gray-400 dark:text-zinc-500"
                                                )}
                                            >
                                                <QrCode className={clsx("w-6 h-6", activeTab === 'qr' ? "text-purple-500" : "text-gray-400 dark:text-zinc-500")} />
                                                <span className={clsx("text-[10px] font-black uppercase tracking-widest", activeTab === 'qr' ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-zinc-500")}>{t('dashboard.my_qr')}</span>
                                            </button>
                                        </div>

                                        {activeTab === 'transfer' ? (
                                            <form onSubmit={handleSendMoney} className="space-y-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest">{t('dashboard.recipient')}</label>
                                                        <button 
                                                            type="button"
                                                            onClick={startScanner}
                                                            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                                        >
                                                            <Scan className="w-3 h-3" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{t('dashboard.scan_qr')}</span>
                                                        </button>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={data.receiver_email}
                                                        onChange={e => setData('receiver_email', e.target.value)}
                                                        placeholder={t('dashboard.recipient_placeholder')}
                                                        className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-4 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-600 transition-all placeholder:text-gray-400"
                                                        required
                                                    />
                                                    {errors.receiver_email && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-widest">{errors.receiver_email}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest px-1">{t('dashboard.amount')}</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            value={data.amount}
                                                            onChange={e => setData('amount', e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-6 text-gray-900 dark:text-white text-2xl font-black focus:ring-2 focus:ring-purple-600 transition-all pr-32 placeholder:text-gray-300 dark:placeholder:text-zinc-700"
                                                            required
                                                            min="1"
                                                        />
                                                        <select 
                                                            value={data.currency}
                                                            onChange={e => setData('currency', e.target.value)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-none rounded-xl text-xs font-black focus:ring-0 cursor-pointer shadow-sm"
                                                        >
                                                            <option value="USD">USD</option>
                                                            <option value="MAD">MAD</option>
                                                            <option value="EUR">EUR</option>
                                                        </select>
                                                    </div>
                                                    {errors.amount && <p className="text-red-500 text-[10px] mt-1 font-black uppercase tracking-widest">{errors.amount}</p>}
                                                </div>

                                                <button 
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-[20px] font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/5 dark:shadow-white/5 disabled:opacity-50"
                                                >
                                                    {processing ? t('dashboard.processing') : t('dashboard.continue_transfer')} <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="space-y-8 flex flex-col items-center py-4">
                                                <div className="bg-white dark:bg-white p-6 rounded-[40px] shadow-[0_0_50px_rgba(168,85,247,0.15)] relative group overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <img 
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${auth.user.email}`} 
                                                        alt="User QR Code" 
                                                        className="w-48 h-48 relative z-10"
                                                    />
                                                </div>
                                                
                                                <div className="text-center space-y-2">
                                                    <h4 className="text-xl font-black text-gray-900 dark:text-white">{auth.user.name}</h4>
                                                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{auth.user.email}</p>
                                                </div>

                                                <div className="w-full grid grid-cols-2 gap-4">
                                                    <button className="bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                                        {t('dashboard.download_qr')}
                                                    </button>
                                                    <button className="bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                                                        {t('dashboard.share_profile')}
                                                    </button>
                                                </div>

                                                <div className="p-6 bg-gray-50/50 dark:bg-zinc-900/30 rounded-3xl border border-gray-100 dark:border-zinc-900 flex items-center gap-4 w-full">
                                                    <div className="bg-white dark:bg-zinc-900 shadow-sm p-2 rounded-lg">
                                                        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <p className="text-[9px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
                                                        {t('dashboard.scan_qr_desc')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="relative aspect-square bg-black rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800">
                                            <video 
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Scanning Animation */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <div className="w-48 h-48 border-2 border-white/20 rounded-[32px] relative overflow-hidden">
                                                    <motion.div 
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_20px_#A855F7]"
                                                    />
                                                </div>
                                                <div className="mt-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('dashboard.scanning_qr')}</p>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={stopScanner}
                                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl flex items-start gap-4 border border-gray-100 dark:border-zinc-900">
                                            <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                                            <p className="text-[10px] leading-relaxed text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wide">
                                                {t('dashboard.position_qr')}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                // Simulated Scan Result
                                                stopScanner();
                                            }}
                                            className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            {t('dashboard.back_to_manual')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
