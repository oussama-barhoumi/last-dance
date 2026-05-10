import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export default function QuickTransfer() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        amount: '',
        description: 'Quick Transfer',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transactions.send'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                reset();
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm text-gray-900 dark:text-white border border-gray-50 dark:border-zinc-800 relative overflow-hidden transition-colors">
            <h3 className="text-xl font-bold mb-8">{t('dashboard.quick_transfer')}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{t('dashboard.recipient_email')}</label>
                    <input 
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="example@email.com"
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">{t('dashboard.amount')} ($)</label>
                    <div className="relative">
                        <input 
                            type="number"
                            value={data.amount}
                            onChange={e => setData('amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all pr-24 placeholder:text-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#10B981] text-white px-4 py-1.5 rounded-full shadow-sm">
                            <span className="text-[10px] font-black">USD</span>
                        </div>
                    </div>
                    {errors.amount && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.amount}</p>}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex -space-x-3">
                        {["Alex", "Sarah", "Mike"].map((name, i) => (
                            <img 
                                key={i} 
                                src={`https://ui-avatars.com/api/?name=${name}&background=random`} 
                                alt={name} 
                                className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 transition-colors shadow-sm"
                            />
                        ))}
                    </div>

                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl shadow-black/10 dark:shadow-white/10 disabled:opacity-50 disabled:scale-100"
                    >
                        <Send className={clsx("w-6 h-6 text-white dark:text-black", processing && "animate-pulse")} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10"
                    >
                        <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{t('dashboard.sent_successfully')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('dashboard.transfer_processed', { amount: `$${data.amount}` })}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
