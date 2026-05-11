import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, ShieldAlert, Shield, 
    CheckCircle, XCircle, Clock,
    Eye, Filter, Search, MoreVertical,
    TrendingUp, User, DollarSign, Briefcase
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const RiskBadge = ({ level, score }) => {
    const colors = {
        low: "bg-green-500/10 text-green-500 border-green-500/20",
        medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        high: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
        <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest", colors[level])}>
            {level === 'low' && <ShieldCheck className="w-3 h-3" />}
            {level === 'medium' && <Shield className="w-3 h-3" />}
            {level === 'high' && <ShieldAlert className="w-3 h-3" />}
            {level} Risk ({score})
        </div>
    );
};

export default function LoanManagement({ loans, stats, filters }) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAction = (id, action, notes = "") => {
        router.post(route(`admin.loans.${action}`, id), { admin_notes: notes });
    };

    return (
        <DashboardLayout>
            <Head title="Institutional Credit Queue" />

            <div className="space-y-10 py-10">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Credit <span className="text-gray-600">Queue</span></h1>
                    <div className="flex gap-4">
                        <div className="bg-[#0D0D0D] border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Protocol</p>
                                <p className="text-xl font-black text-white">{stats.pending}</p>
                            </div>
                        </div>
                        <div className="bg-[#0D0D0D] border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-4">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">High Risk Alerts</p>
                                <p className="text-xl font-black text-white">{stats.high_risk}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#0D0D0D] border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="p-8 flex justify-between items-center border-b border-white/5">
                        <div className="relative w-96">
                            <Search className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search applications..." 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Applicant Node</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Analysis</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Financials</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Decision Protocol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.data.map((loan) => (
                                <tr key={loan.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-white">
                                                {loan.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{loan.user?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">{loan.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <RiskBadge level={loan.ai_analysis?.risk_level} score={loan.ai_analysis?.risk_score} />
                                        {loan.ai_analysis?.risk_score < 40 && (
                                            <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-2 animate-pulse">Low Risk - Fast Approval Suggested</p>
                                        )}
                                        {loan.ai_analysis?.risk_score > 70 && (
                                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mt-2 animate-pulse">High Risk - Recommended Rejection</p>
                                        )}
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-white">${Number(loan.amount).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">DTI: {loan.ai_analysis?.debt_to_income_ratio}%</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAction(loan.id, 'approve')}
                                                className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                                                title="Approve Protocol"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(loan.id, 'review')}
                                                className="p-3 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all"
                                                title="Request Manual Review"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(loan.id, 'reject', "Failed risk protocol assessment")}
                                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                title="Reject Protocol"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
