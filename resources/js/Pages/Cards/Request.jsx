import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    CreditCard, User, Landmark, Briefcase, 
    ChevronRight, ArrowLeft, ShieldCheck, 
    Upload, PenTool, Check, Info, FileText,
    Crown, Zap, ShoppingBag, GraduationCap, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const cardTypes = [
    { id: 'debit', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'credit', icon: Zap, color: 'bg-purple-500' },
    { id: 'prepaid', icon: ShoppingBag, color: 'bg-green-500' },
    { id: 'international', icon: Globe, color: 'bg-indigo-500' },
    { id: 'virtual', icon: ShieldCheck, color: 'bg-cyan-500' },
    { id: 'gold', icon: Crown, color: 'bg-yellow-500' },
    { id: 'platinum', icon: Crown, color: 'bg-slate-900' },
    { id: 'e-shopping', icon: ShoppingBag, color: 'bg-pink-500' },
    { id: 'young', icon: GraduationCap, color: 'bg-orange-500' },
];

export default function Request({ user }) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState({
        full_name: user.name,
        cin: '',
        dob: '',
        phone: '',
        email: user.email,
        address: '',
        rib: '',
        employment_status: '',
        monthly_income: '',
        signature: null,
        income_proof: null,
        bank_statement: null,
    });

    const isCredit = selectedType === 'credit' || selectedType === 'gold' || selectedType === 'platinum';
    const isPrepaid = selectedType === 'prepaid';

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const FormInput = ({ label, name, type = "text", placeholder, required = true }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
            <input 
                type={type}
                required={required}
                value={formData[name] || ''}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black transition-all"
            />
        </div>
    );

    return (
        <DashboardLayout>
            <Head title={`${t('cards.request.title')} - HarborBank`} />

            <div className="max-w-4xl mx-auto py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href={route('cards.index')} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 font-bold text-sm">
                            <ArrowLeft className="w-4 h-4" /> {t('cards.request.back_to_cards')}
                        </Link>
                        <h2 className="text-3xl font-black text-gray-900">{t('cards.request.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('cards.request.desc')}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all",
                                    step >= s ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                {s < 3 && <div className={clsx("w-8 h-0.5 rounded-full", step > s ? "bg-black" : "bg-gray-100")} />}
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cardTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => { setSelectedType(type.id); handleNext(); }}
                                        className={clsx(
                                            "p-6 rounded-[32px] text-left transition-all border-2 group relative overflow-hidden",
                                            selectedType === type.id ? "border-black bg-black text-white shadow-xl" : "border-gray-50 bg-white hover:border-gray-200"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                            selectedType === type.id ? "bg-white/10" : type.color + " text-white"
                                        )}>
                                            <type.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-black text-sm mb-1">{t(`cards.request.types.${type.id}`)}</h4>
                                        <p className={clsx(
                                            "text-[10px] leading-relaxed",
                                            selectedType === type.id ? "text-gray-400" : "text-gray-500"
                                        )}>{t(`cards.request.types.${type.id}_desc`)}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-10"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">{t('cards.request.step_personal')}</h3>
                                    <p className="text-xs text-gray-400">{t('cards.request.step_personal_desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label={t('cards.request.full_name')} name="full_name" placeholder="John Doe" />
                                <FormInput label={t('cards.request.cin')} name="cin" placeholder="AE123456" />
                                <FormInput label={t('cards.request.dob')} name="dob" type="date" />
                                <FormInput label={t('cards.request.phone')} name="phone" placeholder="+212 6..." />
                                <FormInput label={t('cards.request.email')} name="email" type="email" placeholder="john@example.com" />
                                <FormInput label={t('cards.request.address')} name="address" placeholder="Rue de la Liberté, Casablanca" />
                                
                                {!isPrepaid && (
                                    <>
                                        <FormInput label={t('cards.request.rib')} name="rib" placeholder="MA64 0000..." />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('cards.request.employment_status')}</label>
                                            <select 
                                                value={formData.employment_status || ''}
                                                onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black appearance-none"
                                            >
                                                <option value="">{t('cards.request.select_status')}</option>
                                                <option value="employed">{t('cards.request.employed')}</option>
                                                <option value="self-employed">{t('cards.request.self_employed')}</option>
                                                <option value="student">{t('cards.request.student')}</option>
                                                <option value="retired">{t('cards.request.retired')}</option>
                                            </select>
                                        </div>
                                        <FormInput label={t('cards.request.monthly_income')} name="monthly_income" type="number" placeholder="5000" />
                                    </>
                                )}
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black transition-colors">{t('dashboard.common.back') || 'Back'}</button>
                                <button onClick={handleNext} className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">{t('cards.request.continue_to_docs') || 'Continue to Documents'}</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-10"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">{t('cards.request.step_documents')}</h3>
                                    <p className="text-xs text-gray-400">{t('cards.request.step_documents_desc')}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Always required: Signature */}
                                <div className="p-8 border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center text-center group hover:border-black transition-colors cursor-pointer">
                                    <PenTool className="w-10 h-10 text-gray-300 group-hover:text-black mb-4 transition-colors" />
                                    <h4 className="font-bold text-sm text-gray-900">{t('cards.request.digital_signature')}</h4>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">{t('cards.request.signature_desc')}</p>
                                </div>

                                {/* Conditional: Income Proof for Credit Cards */}
                                {isCredit && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{t('cards.request.proof_income')}</h4>
                                                <p className="text-[9px] text-gray-400">{t('cards.request.proof_income_desc')}</p>
                                            </div>
                                            <Upload className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <Landmark className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{t('cards.request.bank_statement')}</h4>
                                                <p className="text-[9px] text-gray-400">{t('cards.request.bank_statement_desc')}</p>
                                            </div>
                                            <Upload className="w-5 h-5 text-gray-300" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
                                    <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <p className="text-[10px] leading-relaxed text-blue-700 font-medium">
                                        {t('cards.request.terms_agreement')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black transition-colors">{t('dashboard.common.back') || 'Back'}</button>
                                <button className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-black/10">{t('cards.request.submit_request')}</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
