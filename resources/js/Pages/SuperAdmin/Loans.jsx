import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, CheckCircle, XCircle, 
    MoreVertical, Eye, FileText, TrendingUp, 
    DollarSign, Clock, AlertCircle, Info,
    ChevronRight, ArrowUpRight, Shield, Calendar,
    User, Landmark, Briefcase, Download
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const StatCard = ({ icon: Icon, title, value, subtext, color = "white" }) => (
    <div className="bg-[#0D0D0D] border border-white/10 p-8 rounded-[40px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon className="w-16 h-16 text-white" />
        </div>
        <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
                <div className={clsx("p-2 rounded-xl", `text-${color}-500 bg-${color}-500/10`)}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{subtext}</span>
            </div>
        </div>
    </div>
);

export default function LoanManagement({ auth, loans, stats, filters }) {
    const isAdmin = auth.user.role === 'admin';
    const routePrefix = isAdmin ? 'admin.loans' : 'super-admin.loans';

    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const approveForm = useForm({
        interest_rate: 5.5,
        admin_notes: '',
    });

    const rejectForm = useForm({
        admin_notes: '',
    });

    const handleApprove = (e) => {
        e.preventDefault();
        approveForm.post(route(`${routePrefix}.approve`, selectedLoan.id), {
            onSuccess: () => {
                setIsApproveModalOpen(false);
                setSelectedLoan(null);
            }
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(route(`${routePrefix}.reject`, selectedLoan.id), {
            onSuccess: () => {
                setIsRejectModalOpen(false);
                setSelectedLoan(null);
            }
        });
    };

    const openApprove = (loan) => {
        setSelectedLoan(loan);
        setIsApproveModalOpen(true);
    };

    const openReject = (loan) => {
        setSelectedLoan(loan);
        setIsRejectModalOpen(true);
    };

    const openDetails = (loan) => {
        setSelectedLoan(loan);
        setIsDetailsModalOpen(true);
    };

    return (
        <DashboardLayout>
            <Head title="Institutional Credit Oversight" />

            <div className="space-y-10 py-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest">Protocol 77-B</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">System Online</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Credit <span className="text-gray-600">Oversight</span></h1>
                        <p className="text-sm text-gray-500 font-medium max-w-lg">Manage institutional liquidity injections and monitor node-level credit risk protocols across the network.</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-[#0D0D0D] border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Auth User</span>
                                <span className="text-xs font-black text-white">{auth.user.name}</span>
                            </div>
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <Shield className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Clock} title="Pending Protocol" value={stats.pending_count} subtext="Applications Awaiting Review" color="orange" />
                    <StatCard icon={DollarSign} title="Total Disbursed" value={`$${Number(stats.total_disbursed).toLocaleString()}`} subtext="Total Injected Capital" color="blue" />
                    <StatCard icon={AlertCircle} title="Avg Risk Score" value={`${stats.average_risk}%`} subtext="Institutional Health Index" color="purple" />
                    <StatCard icon={CheckCircle} title="Approval Rate" value={`${stats.approval_rate}%`} subtext="Network Trust Metric" color="green" />
                </div>

                {/* Table Section */}
                <div className="bg-[#0D0D0D] border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5">
                        <div className="relative w-full md:w-96 group">
                            <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by Node ID or Entity Name..." 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-white transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:invert transition-all">
                                <Download className="w-4 h-4" /> Export Audit
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40">
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Identified Entity</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Capital Request</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Risk Analysis</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status Protocol</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.data.map((loan) => (
                                    <tr key={loan.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black group-hover:bg-white group-hover:text-black transition-all">
                                                    {loan.user?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{loan.user?.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{loan.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white">${Number(loan.amount).toLocaleString()}</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{loan.duration} Months Term</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${loan.risk_score}%` }}
                                                        className={clsx(
                                                            "h-full rounded-full",
                                                            loan.risk_score > 70 ? "bg-red-500" : loan.risk_score > 40 ? "bg-yellow-500" : "bg-green-500"
                                                        )}
                                                    />
                                                </div>
                                                <span className={clsx(
                                                    "text-[10px] font-black",
                                                    loan.risk_score > 70 ? "text-red-500" : loan.risk_score > 40 ? "text-yellow-500" : "text-green-500"
                                                )}>
                                                    {loan.risk_score}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={clsx(
                                                "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border",
                                                loan.status === 'pending' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                loan.status === 'approved' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => openDetails(loan)}
                                                    className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all"
                                                    title="View Detailed Snapshot"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {loan.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => openApprove(loan)}
                                                            className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl border border-green-500/20 transition-all"
                                                            title="Authorize Disbursement"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => openReject(loan)}
                                                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all"
                                                            title="Suspend Protocol"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <AnimatePresence>
                {isApproveModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsApproveModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#0D0D0D] border border-white/10 w-full max-w-xl rounded-[40px] relative z-10 overflow-hidden shadow-2xl">
                            <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Authorize Disbursement</h3>
                                    <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1">Finalizing Credit Injection for Node {selectedLoan.user?.name}</p>
                                </div>
                                <Shield className="w-10 h-10 text-green-500/50" />
                            </div>
                            <form onSubmit={handleApprove} className="p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Institutional APR (%)</label>
                                        <input 
                                            type="number" 
                                            step="0.01" 
                                            value={approveForm.data.interest_rate} 
                                            onChange={e => approveForm.setData('interest_rate', e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Repayment Term</label>
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-400 text-sm">
                                            {selectedLoan.duration} Months
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Administrative Memo</label>
                                    <textarea 
                                        value={approveForm.data.admin_notes} 
                                        onChange={e => approveForm.setData('admin_notes', e.target.value)} 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-white transition-all h-32 outline-none resize-none" 
                                        placeholder="Outline the justification for this credit line..."
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setIsApproveModalOpen(false)} className="px-8 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                                    <button type="submit" disabled={approveForm.processing} className="flex-1 bg-white text-black py-5 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all">Execute Protocol</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && selectedLoan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0D0D0D] border border-white/10 w-full max-w-5xl rounded-[50px] relative z-10 overflow-hidden shadow-2xl h-[85vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="p-12 border-b border-white/5 flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">Application ID: {selectedLoan.id}</span>
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                            selectedLoan.status === 'pending' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                                        )}>
                                            {selectedLoan.status}
                                        </span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Credit <span className="text-gray-600">Snapshot</span></h3>
                                    <p className="text-sm text-gray-500 font-medium">Detailed financial analytics and risk metrics for Node {selectedLoan.user?.name}.</p>
                                </div>
                                <button onClick={() => setIsDetailsModalOpen(false)} className="p-4 bg-white/5 border border-white/10 rounded-3xl text-gray-500 hover:text-white transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    {/* Left: Applicant Details */}
                                    <div className="lg:col-span-1 space-y-10">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3">
                                                <User className="w-3 h-3" /> Applicant Profile
                                            </h4>
                                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Legal Entity</span>
                                                    <span className="text-sm font-black text-white">{selectedLoan.user?.name}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Network Email</span>
                                                    <span className="text-sm font-black text-white">{selectedLoan.user?.email}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Current Liquidity</span>
                                                    <span className="text-sm font-black text-green-500">${Number(selectedLoan.user?.balance).toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">KYC Validation</span>
                                                    <span className="text-sm font-black text-blue-500 uppercase tracking-widest">{selectedLoan.user?.kyc_status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3">
                                                <Landmark className="w-3 h-3" /> Loan Parameters
                                            </h4>
                                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Type</span>
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{selectedLoan.type}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Amount</span>
                                                    <span className="text-xs font-black text-white">${Number(selectedLoan.amount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Duration</span>
                                                    <span className="text-xs font-black text-white">{selectedLoan.duration} Months</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Purpose</span>
                                                    <span className="text-xs font-bold text-gray-400 text-right max-w-[150px]">{selectedLoan.purpose}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Repayment Schedule & Risk */}
                                    <div className="lg:col-span-2 space-y-12">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3">
                                                <Calendar className="w-3 h-3" /> Repayment Protocol (Simulated)
                                            </h4>
                                            <div className="bg-black/40 rounded-[32px] border border-white/10 overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-white/5 border-b border-white/10 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                                            <th className="px-8 py-4">Phase</th>
                                                            <th className="px-8 py-4">Execution Date</th>
                                                            <th className="px-8 py-4">Principal</th>
                                                            <th className="px-8 py-4">Interest</th>
                                                            <th className="px-8 py-4 text-right">Remaining Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedLoan.repayment_schedule?.slice(0, 6).map((step, idx) => (
                                                            <tr key={idx} className="border-b border-white/5 text-[10px]">
                                                                <td className="px-8 py-4 font-black text-gray-400">0{step.month}</td>
                                                                <td className="px-8 py-4 font-black text-white">{step.date}</td>
                                                                <td className="px-8 py-4 font-bold text-gray-300">${step.principal}</td>
                                                                <td className="px-8 py-4 font-bold text-blue-500">${step.interest}</td>
                                                                <td className="px-8 py-4 font-black text-white text-right">${step.balance}</td>
                                                            </tr>
                                                        ))}
                                                        {selectedLoan.duration > 6 && (
                                                            <tr>
                                                                <td colSpan="5" className="px-8 py-4 text-center text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                                    + {selectedLoan.duration - 6} Additional Phases Omitted for Optimization
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                                                <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">Financial Snapshot (At Request)</h5>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-[10px] font-bold text-gray-400">Initial Balance</span>
                                                        <span className="text-[10px] font-black text-white">${Number(selectedLoan.financial_snapshot?.balance).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[10px] font-bold text-gray-400">Tx Frequency</span>
                                                        <span className="text-[10px] font-black text-white">{selectedLoan.financial_snapshot?.total_transactions} Nodes</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[10px] font-bold text-gray-400">Risk Assessment</span>
                                                        <span className={clsx(
                                                            "text-[10px] font-black",
                                                            selectedLoan.risk_score > 70 ? "text-red-500" : "text-green-500"
                                                        )}>{selectedLoan.risk_score}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-center text-center">
                                                <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                                                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Institutional Yield</h5>
                                                <p className="text-2xl font-black text-white mt-2">+{((selectedLoan.amount * (selectedLoan.interest_rate || 5.5) / 100) / 12 * selectedLoan.duration).toFixed(2)} USD</p>
                                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Expected Protocol Return</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-12 bg-white/5 border-t border-white/10 flex justify-end gap-6">
                                <button onClick={() => setIsDetailsModalOpen(false)} className="px-10 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-all">Close Snapshot</button>
                                {selectedLoan.status === 'pending' && (
                                    <button 
                                        onClick={() => { setIsDetailsModalOpen(false); openApprove(selectedLoan); }}
                                        className="px-10 py-5 bg-white text-black rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all"
                                    >
                                        Proceed to Authorization
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
