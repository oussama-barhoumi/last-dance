import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    Sparkles, ShieldCheck, AlertTriangle, TrendingUp, 
    PieChart, Wallet, CreditCard, CheckCircle2, 
    Info, ArrowRight, RefreshCcw, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

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

export default function Index({ financialData, analysis }) {
    const { t } = useTranslation();
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <DashboardLayout>
            <Head title={`${t('ai_assistant.title')} - HarborBank`} />

            <AnimatePresence mode="wait">
                {isScanning ? (
                    <motion.div 
                        key="scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[80vh] flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="relative">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl absolute inset-0"
                            />
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="relative z-10 w-24 h-24 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            />
                            <Sparkles className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-gray-900">{t('ai_assistant.scanning')}</h3>
                            <p className="text-sm text-gray-400 font-medium">{t('ai_assistant.scanning_desc')}</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="report"
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-10 py-10"
                    >
                        {/* Header Section */}
                        <motion.div variants={item} className="flex justify-between items-center bg-[#0A0A0A] p-10 rounded-[40px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-500/30 transition-colors" />
                            <div className="relative z-10 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500 p-2 rounded-xl">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black">{t('ai_assistant.health_report')}</h2>
                                </div>
                                <p className="text-gray-400 text-sm max-w-md">{t('ai_assistant.powered_by')} {new Date().toLocaleString('default', { month: 'long' })}.</p>
                            </div>
                            <div className="relative z-10 hidden md:block">
                                <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4" /> {t('ai_assistant.refresh_analysis')}
                                </button>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Financial Summary */}
                            <motion.div variants={item} className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 h-full">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <Info className="w-6 h-6 text-blue-500" /> {t('ai_assistant.executive_summary')}
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                        {analysis.summary}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('ai_assistant.monthly_income')}</p>
                                            <p className="text-xl font-black text-gray-900">${financialData.income.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('ai_assistant.monthly_expenses')}</p>
                                            <p className="text-xl font-black text-gray-900">${financialData.expenses.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('ai_assistant.total_assets')}</p>
                                            <p className="text-xl font-black text-gray-900">${financialData.savings.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Spending Analysis Card */}
                            <motion.div variants={item}>
                                <div className={clsx(
                                    "p-10 rounded-[40px] h-full flex flex-col justify-between border",
                                    analysis.spendingAnalysis.level === 'High Risk' ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"
                                )}>
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            {analysis.spendingAnalysis.level === 'High Risk' ? (
                                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                            ) : (
                                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                            )}
                                            <h3 className="text-xl font-black text-gray-900">{t('ai_assistant.spending_analysis')}</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                                analysis.spendingAnalysis.level === 'High Risk' ? "bg-red-500 text-white border-red-600" : "bg-green-500 text-white border-green-600"
                                            )}>
                                                {analysis.spendingAnalysis.level === 'High Risk' ? t('ai_assistant.high_risk') : t('ai_assistant.low_risk')}
                                            </span>
                                            <p className="text-sm font-bold text-gray-600 leading-relaxed">
                                                {analysis.spendingAnalysis.details}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-black/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('ai_assistant.efficiency_score')}</span>
                                            <span className="text-xl font-black text-gray-900">84/100</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Budget Recommendation */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <motion.div variants={item} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <PieChart className="w-6 h-6 text-purple-500" /> {analysis.budgetRecommendation.method} {t('ai_assistant.budget_recommendation')}
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-400">{t('dashboard.needs')} (50%)</span>
                                            <span className="text-gray-900">${analysis.budgetRecommendation.needs.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[50%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-400">{t('dashboard.wants')} (30%)</span>
                                            <span className="text-gray-900">${analysis.budgetRecommendation.wants.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[30%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-400">{t('dashboard.savings')} & Debt (20%)</span>
                                            <span className="text-gray-900">${analysis.budgetRecommendation.savings.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[20%]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-orange-500" /> {t('ai_assistant.responsible_credit')}
                                </h3>
                                <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('ai_assistant.debt_to_income')}</span>
                                        <span className="text-2xl font-black text-gray-900">{analysis.creditAssessment.debtToIncome}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-500 bg-green-50 p-4 rounded-2xl mb-6">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-xs font-bold">{analysis.creditAssessment.status}: {t('ai_assistant.credit_qualify')}</p>
                                    </div>
                                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-loose">
                                        {analysis.creditAssessment.advice}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Investment Suggestions */}
                        <motion.div variants={item} className="bg-[#FAF9F6] p-12 rounded-[48px] border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-3">
                                <TrendingUp className="w-7 h-7 text-green-600" /> {t('ai_assistant.investment_roadmap')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{t('ai_assistant.low_risk')}</span>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{analysis.investmentSuggestion.lowRisk}</p>
                                </div>
                                <div className="space-y-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{t('ai_assistant.medium_risk')}</span>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{analysis.investmentSuggestion.mediumRisk}</p>
                                </div>
                                <div className="space-y-4">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{t('ai_assistant.high_risk')}</span>
                                    <p className="text-sm font-bold text-gray-900 leading-relaxed">{analysis.investmentSuggestion.highRisk}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Actionable Tips */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-yellow-500" /> {t('ai_assistant.actionable_tips')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {analysis.tips.map((tip, i) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden group cursor-default"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
                                        <div className="relative z-10 space-y-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                0{i + 1}
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 leading-relaxed">{tip}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Disclaimer */}
                        <motion.div variants={item} className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Info className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{analysis.disclaimer}</span>
                            </div>
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">{t('ai_assistant.legal_disclosure')}</button>
                                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">{t('ai_assistant.terms_of_use')}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
