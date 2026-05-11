import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Clock, CheckCircle, XCircle, 
    ArrowRight, Shield, User,
    Calendar, TrendingUp, Info
} from 'lucide-react';
import clsx from 'clsx';

const StatusTimeline = ({ status, aiAnalysis, banker }) => {
    const steps = [
        { id: 'submitted', label: 'Submitted', active: true, done: true },
        { id: 'ai', label: 'AI Protocol', active: !!aiAnalysis, done: !!aiAnalysis },
        { id: 'review', label: 'Admin Review', active: status !== 'pending_review', done: status !== 'pending_review' && status !== 'under_review' },
        { id: 'final', label: 'Final Decision', active: status === 'approved' || status === 'rejected', done: status === 'approved' || status === 'rejected' },
    ];

    return (
        <div className="flex justify-between items-center relative py-10 px-4">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
            {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0D0D0D] transition-all duration-500",
                        step.done ? "bg-green-500 text-black" : step.active ? "bg-orange-500 text-black scale-110" : "bg-white/5 text-gray-600"
                    )}>
                        {step.done ? <CheckCircle className="w-5 h-5" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                    </div>
                    <span className={clsx(
                        "text-[8px] font-black uppercase tracking-widest",
                        step.active ? "text-white" : "text-gray-600"
                    )}>{step.label}</span>
                </div>
            ))}
        </div>
    );
};

export default function LoanIndex({ activeLoans, stats }) {
    return (
        <DashboardLayout>
            <Head title="Institutional Credit Tracking" />

            <div className="space-y-12 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Credit <span className="text-gray-600">Terminal</span></h1>
                        <p className="text-gray-500 font-medium text-lg mt-4">Monitor your institutional capital requests and AI protocol feedback in real-time.</p>
                    </div>
                    <Link 
                        href={route('loans.apply')} 
                        className="px-8 py-5 bg-white text-black rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:invert transition-all"
                    >
                        Initiate Application
                    </Link>
                </div>

                {/* Active Loans / Tracking */}
                <div className="grid grid-cols-1 gap-10">
                    {activeLoans.map((loan) => (
                        <div key={loan.id} className="bg-[#0D0D0D] border border-white/10 rounded-[50px] overflow-hidden group">
                            <div className="p-12">
                                <div className="flex flex-col lg:flex-row justify-between gap-12">
                                    {/* Left: Info */}
                                    <div className="flex-1 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                                                <TrendingUp className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{loan.type}</h3>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Requested Amount: <span className="text-white">${Number(loan.amount).toLocaleString()}</span></p>
                                            </div>
                                        </div>

                                        <StatusTimeline status={loan.status} aiAnalysis={loan.ai_analysis} />

                                        {/* AI Feedback Section */}
                                        {loan.ai_analysis && (
                                            <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-4 h-4 text-purple-400" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Protocol Feedback</span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-medium italic">"{loan.ai_analysis.summary_feedback}"</p>
                                                <div className="flex flex-wrap gap-2 pt-4">
                                                    {loan.ai_analysis.reasoning.map((r, i) => (
                                                        <span key={i} className="px-3 py-1 bg-black/40 border border-white/5 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">{r}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Assigned Banker & Status */}
                                    <div className="w-full lg:w-96 space-y-6">
                                        <div className="bg-white/5 rounded-[40px] p-10 border border-white/10 h-full flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Status</span>
                                                    <span className={clsx(
                                                        "px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border",
                                                        loan.status === 'approved' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                    )}>{loan.status.replace('_', ' ')}</span>
                                                </div>

                                                {loan.banker && (
                                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
                                                                <User className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-white">{loan.banker.name}</p>
                                                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Assigned Institutional Banker</p>
                                                            </div>
                                                        </div>
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                                            <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-2">Protocol Status</p>
                                                            <p className="text-[10px] text-white font-medium">Your assigned banker will contact you within 24 hours.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {loan.status === 'approved' && (
                                                <button className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:invert transition-all mt-8">
                                                    View Repayment Schedule
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeLoans.length === 0 && (
                        <div className="bg-[#0D0D0D] border border-dashed border-white/10 rounded-[50px] p-24 text-center">
                            <Info className="w-12 h-12 text-gray-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">No Active Protocols</h3>
                            <p className="text-gray-500 text-sm mt-2">You haven't initiated any capital requests yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
