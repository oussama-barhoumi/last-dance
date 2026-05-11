import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    User, Briefcase, Landmark, FileText, 
    ArrowLeft, Check, Upload, Info, 
    Home, Car, ShoppingBag, GraduationCap,
    ShieldCheck, MapPin, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function Apply({ user }) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        full_name: user.name,
        cin: '',
        dob: '',
        phone: '',
        email: user.email,
        address: '',
        city: '',
        job_title: '',
        employer: '',
        salary: '',
        rib: '',
        loan_type: '',
        amount: '',
        duration: '',
        purpose: ''
    });

    const [files, setFiles] = useState({});

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loans.store'));
    };

    const handleFileChange = (name, file) => {
        setFiles(prev => ({ ...prev, [name]: file }));
    };

    const FormInput = ({ label, name, type = "text", placeholder }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
            <input 
                type={type}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black transition-all"
            />
            {errors[name] && <p className="text-[10px] text-red-500 mt-1">{errors[name]}</p>}
        </div>
    );

    const DocumentUpload = ({ title, desc, name }) => (
        <div 
            onClick={() => document.getElementById(`file-${name}`).click()}
            className={clsx(
                "p-6 rounded-3xl flex items-center justify-between group transition-all border cursor-pointer",
                files[name] 
                    ? "bg-green-50 border-green-100 shadow-xl shadow-green-900/5" 
                    : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:border-gray-100"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                    files[name] ? "bg-green-500 text-white" : "bg-white text-gray-400 group-hover:text-black"
                )}>
                    {files[name] ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="max-w-[150px]">
                    <h4 className={clsx(
                        "text-xs font-black uppercase tracking-widest truncate",
                        files[name] ? "text-green-700" : "text-gray-900 dark:text-zinc-100"
                    )}>
                        {files[name] ? files[name].name : title}
                    </h4>
                    <p className={clsx(
                        "text-[9px] font-bold truncate",
                        files[name] ? "text-green-600/70" : "text-gray-400"
                    )}>
                        {files[name] ? `${(files[name].size / 1024).toFixed(1)} KB` : desc}
                    </p>
                </div>
            </div>
            <input 
                type="file" 
                id={`file-${name}`} 
                className="hidden" 
                onChange={(e) => handleFileChange(name, e.target.files[0])}
            />
            {files[name] ? (
                <div className="bg-green-500/10 p-2 rounded-full">
                    <Check className="w-4 h-4 text-green-600" />
                </div>
            ) : (
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <Head title={`${t('loans.apply.title')} - HarborBank`} />

            <div className="max-w-4xl mx-auto py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href={route('loans.index')} className="flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4 font-bold text-sm">
                            <ArrowLeft className="w-4 h-4" /> {t('loans.apply.back_to_loans')}
                        </Link>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-100">{t('loans.apply.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('loans.apply.subtitle')}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all",
                                    step >= s ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                {s < 4 && <div className={clsx("w-8 h-0.5 rounded-full", step > s ? "bg-black" : "bg-gray-100")} />}
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
                            className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-zinc-800 space-y-10 transition-colors"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100">{t('loans.apply.personal.title')}</h3>
                                    <p className="text-xs text-gray-400">{t('loans.apply.personal.desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label={t('loans.apply.personal.full_name')} name="full_name" placeholder="John Doe" />
                                <FormInput label={t('loans.apply.personal.cin')} name="cin" placeholder="AE123456" />
                                <FormInput label={t('loans.apply.personal.dob')} name="dob" type="date" />
                                <FormInput label={t('loans.apply.personal.phone')} name="phone" placeholder="+212 6..." />
                                <FormInput label={t('loans.apply.personal.email')} name="email" type="email" placeholder="john@example.com" />
                                <FormInput label={t('loans.apply.personal.city')} name="city" placeholder="Casablanca" />
                                <div className="md:col-span-2">
                                    <FormInput label={t('loans.apply.personal.address')} name="address" placeholder="Rue de la Liberté, No. 12" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t border-gray-50">
                                <button onClick={handleNext} className="bg-black text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform">{t('loans.apply.next_step')}</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-zinc-800 space-y-10 transition-colors"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100">{t('loans.apply.professional.title')}</h3>
                                    <p className="text-xs text-gray-400">{t('loans.apply.professional.desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label={t('loans.apply.professional.job_title')} name="job_title" placeholder="Software Engineer" />
                                <FormInput label={t('loans.apply.professional.employer')} name="employer" placeholder="Tech Solutions Inc." />
                                <FormInput label={t('loans.apply.professional.salary')} name="salary" type="number" placeholder="15000" />
                                <FormInput label={t('loans.apply.professional.rib')} name="rib" placeholder="MA64 0000..." />
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors">{t('loans.apply.back')}</button>
                                <button onClick={handleNext} className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">{t('loans.apply.next_step')}</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-zinc-800 space-y-10 transition-colors"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100">{t('loans.apply.details.title')}</h3>
                                    <p className="text-xs text-gray-400">{t('loans.apply.details.desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('loans.apply.details.type')}</label>
                                    <select 
                                        value={data.loan_type}
                                        onChange={(e) => setData('loan_type', e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black appearance-none"
                                    >
                                        <option value="">{t('loans.apply.details.select_type')}</option>
                                        <option value="home">{t('loans.types.home')}</option>
                                        <option value="car">{t('loans.types.car')}</option>
                                        <option value="business">{t('loans.types.business')}</option>
                                        <option value="student">{t('loans.types.student')}</option>
                                    </select>
                                    {errors.loan_type && <p className="text-[10px] text-red-500 mt-1">{errors.loan_type}</p>}
                                </div>
                                <FormInput label={t('loans.apply.details.amount')} name="amount" type="number" placeholder="100000" />
                                <FormInput label={t('loans.apply.details.duration')} name="duration" type="number" placeholder="24" />
                                <div className="md:col-span-2">
                                    <FormInput label={t('loans.apply.details.purpose')} name="purpose" placeholder={t('loans.apply.details.purpose_placeholder')} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors">{t('loans.apply.back')}</button>
                                <button onClick={handleNext} className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">{t('loans.apply.continue_docs')}</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-zinc-800 space-y-10 transition-colors"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100">{t('loans.apply.documents.title')}</h3>
                                    <p className="text-xs text-gray-400">{t('loans.apply.documents.desc')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentUpload title={t('loans.apply.documents.cin_copy')} desc={t('loans.apply.documents.cin_desc')} name="cin_copy" />
                                <DocumentUpload title={t('loans.apply.documents.salary_cert')} desc={t('loans.apply.documents.salary_desc')} name="salary_cert" />
                                <DocumentUpload title={t('loans.apply.documents.bank_statements')} desc={t('loans.apply.documents.bank_desc')} name="bank_statements" />
                                <DocumentUpload title={t('loans.apply.documents.work_contract')} desc={t('loans.apply.documents.work_desc')} name="work_contract" />
                                <DocumentUpload title={t('loans.apply.documents.proof_address')} desc={t('loans.apply.documents.proof_desc')} name="proof_address" />
                                <DocumentUpload title={t('loans.apply.documents.payslips')} desc={t('loans.apply.documents.payslips_desc')} name="payslips" />
                                {data.job_title?.toLowerCase().includes('self') && (
                                    <DocumentUpload title={t('loans.apply.documents.business_docs')} desc={t('loans.apply.documents.business_desc')} name="business_docs" />
                                )}
                                {data.loan_type === 'home' && (
                                    <DocumentUpload title={t('loans.apply.documents.property_docs')} desc={t('loans.apply.documents.property_desc')} name="property_docs" />
                                )}
                            </div>

                            <div className="p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
                                <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <p className="text-[10px] leading-relaxed text-blue-700 font-medium font-bold">
                                    {t('loans.apply.documents.legal_note')}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors">{t('loans.apply.back')}</button>
                                <button 
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-black/10 disabled:opacity-50"
                                >
                                    {processing ? t('loans.apply.processing') : t('loans.apply.submit')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
