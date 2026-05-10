import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    User, Briefcase, Landmark, FileText, 
    ArrowLeft, Check, Upload, Info, 
    Home, Car, ShoppingBag, GraduationCap,
    ShieldCheck, MapPin, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';

export default function Apply({ user }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
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

    const handleFileChange = (name, file) => {
        setFiles(prev => ({ ...prev, [name]: file }));
    };

    const FormInput = ({ label, name, type = "text", placeholder }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
            <input 
                type={type}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black transition-all"
            />
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
                        files[name] ? "text-green-700" : "text-gray-900"
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
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <Head title="Apply for Loan - HarborBank" />

            <div className="max-w-4xl mx-auto py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href={route('loans.index')} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 font-bold text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back to Loans
                        </Link>
                        <h2 className="text-3xl font-black text-gray-900">Loan Application</h2>
                        <p className="text-sm text-gray-500 mt-1">Fill out the form below to start your financial journey.</p>
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
                            className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-10"
                        >
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-8">
                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                                    <p className="text-xs text-gray-400">Basic details for your application.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="Full Name" name="full_name" placeholder="John Doe" />
                                <FormInput label="National ID (CIN)" name="cin" placeholder="AE123456" />
                                <FormInput label="Date of Birth" name="dob" type="date" />
                                <FormInput label="Phone Number" name="phone" placeholder="+212 6..." />
                                <FormInput label="Email Address" name="email" type="email" placeholder="john@example.com" />
                                <FormInput label="City" name="city" placeholder="Casablanca" />
                                <div className="md:col-span-2">
                                    <FormInput label="Home Address" name="address" placeholder="Rue de la Liberté, No. 12" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t border-gray-50">
                                <button onClick={handleNext} className="bg-black text-white px-10 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform">Next Step</button>
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
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Professional & Bank</h3>
                                    <p className="text-xs text-gray-400">Employment and financial details.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="Job Title / Profession" name="job_title" placeholder="Software Engineer" />
                                <FormInput label="Employer Name" name="employer" placeholder="Tech Solutions Inc." />
                                <FormInput label="Monthly Salary (DH)" name="salary" type="number" placeholder="15000" />
                                <FormInput label="Bank Account Number (RIB)" name="rib" placeholder="MA64 0000..." />
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black transition-colors">Back</button>
                                <button onClick={handleNext} className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">Next Step</button>
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
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Loan Details</h3>
                                    <p className="text-xs text-gray-400">Information about the loan you need.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Type of Loan</label>
                                    <select 
                                        value={formData.loan_type}
                                        onChange={(e) => setFormData({ ...formData, loan_type: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black appearance-none"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="home">Home Loan</option>
                                        <option value="car">Car Loan</option>
                                        <option value="business">Business Loan</option>
                                        <option value="student">Student Loan</option>
                                    </select>
                                </div>
                                <FormInput label="Loan Amount Requested (DH)" name="amount" type="number" placeholder="100000" />
                                <FormInput label="Loan Duration (Months)" name="duration" type="number" placeholder="24" />
                                <div className="md:col-span-2">
                                    <FormInput label="Purpose of Loan" name="purpose" placeholder="e.g., Buying a new apartment" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black transition-colors">Back</button>
                                <button onClick={handleNext} className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform">Continue to Documents</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step4"
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
                                    <h3 className="text-xl font-black text-gray-900">Supporting Documents</h3>
                                    <p className="text-xs text-gray-400">Required files to process your request.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DocumentUpload title="Copy of CIN" desc="Both sides of your national ID" name="cin_copy" />
                                <DocumentUpload title="Salary Certificate" desc="Recent certificate from employer" name="salary_cert" />
                                <DocumentUpload title="Bank Statements" desc="Last 3–6 months of activity" name="bank_statements" />
                                <DocumentUpload title="Work Contract" desc="Signed employment contract" name="work_contract" />
                                <DocumentUpload title="Proof of Address" desc="Electricity or water bill" name="proof_address" />
                                <DocumentUpload title="Recent Payslips" desc="Last 3 monthly payslips" name="payslips" />
                                {formData.job_title?.toLowerCase().includes('self') && (
                                    <DocumentUpload title="Business Documents" desc="Company registration / status" name="business_docs" />
                                )}
                                {formData.loan_type === 'home' && (
                                    <DocumentUpload title="Property Documents" desc="Title deed or sales agreement" name="property_docs" />
                                )}
                            </div>

                            <div className="p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
                                <Info className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                <p className="text-[10px] leading-relaxed text-blue-700 font-medium font-bold">
                                    By submitting this application, you confirm that all provided information is accurate. HarborBank will perform a credit check and review your documents. This process may take up to 3 business days.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-gray-50">
                                <button onClick={handleBack} className="px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-black transition-colors">Back</button>
                                <button className="flex-1 bg-black text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl shadow-black/10">Submit Loan Application</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
