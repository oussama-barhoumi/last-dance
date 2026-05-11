import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Calendar, MapPin, Clock, 
    ArrowRight, CheckCircle, Info,
    Building2, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Booking({ loan, branches }) {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        loan_id: loan.id,
        branch_id: '',
        date: '',
        time_slot: '',
        purpose: 'final_verification',
    });

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch);
        setData('branch_id', branch.id);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('loans.book.store'));
    };

    return (
        <DashboardLayout>
            <Head title="Institutional Appointment Protocol" />

            <div className="max-w-6xl mx-auto py-12 space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 bg-orange-500 text-black px-4 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Finalization Protocol Required</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Schedule <br /> <span className="text-gray-600">Verification.</span></h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl">To finalize your ${Number(loan.amount).toLocaleString()} credit protocol, you must select a branch and secure an appointment for on-site identity verification and contract signing.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Branch & Date Selection */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* 1. Select Branch */}
                        <div className="bg-[#0D0D0D] border border-white/10 rounded-[40px] p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Select Branch</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => handleBranchSelect(branch)}
                                        className={clsx(
                                            "p-8 rounded-[32px] border transition-all text-left group",
                                            data.branch_id === branch.id 
                                                ? "bg-white border-white text-black" 
                                                : "bg-white/5 border-white/10 text-white hover:border-white/30"
                                        )}
                                    >
                                        <Building2 className={clsx("w-6 h-6 mb-4 transition-all", data.branch_id === branch.id ? "text-black" : "text-gray-500 group-hover:text-white")} />
                                        <p className="text-sm font-black uppercase tracking-tight">{branch.name}</p>
                                        <p className={clsx("text-[10px] font-bold mt-1 uppercase tracking-widest", data.branch_id === branch.id ? "text-black/60" : "text-gray-500")}>{branch.location}</p>
                                    </button>
                                ))}
                            </div>
                            {errors.branch_id && <p className="text-red-500 text-[10px] font-black uppercase">{errors.branch_id}</p>}
                        </div>

                        {/* 2. Select Date & Slots */}
                        {selectedBranch && (
                            <div className="bg-[#0D0D0D] border border-white/10 rounded-[40px] p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Time Protocol</h3>
                                    </div>
                                    <input 
                                        type="date" 
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-white outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                    {selectedBranch.available_slots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setData('time_slot', slot)}
                                            className={clsx(
                                                "py-4 rounded-xl text-[10px] font-black border transition-all uppercase tracking-widest",
                                                data.time_slot === slot 
                                                    ? "bg-white border-white text-black" 
                                                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                            )}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                {errors.time_slot && <p className="text-red-500 text-[10px] font-black uppercase">{errors.time_slot}</p>}
                            </div>
                        )}
                    </div>

                    {/* Right: Confirmation Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white text-black p-10 rounded-[40px] space-y-8 sticky top-10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-black/10 pb-6">Protocol Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selected Branch</p>
                                    <p className="text-sm font-black uppercase">{selectedBranch?.name || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Scheduled Date</p>
                                    <p className="text-sm font-black uppercase">{data.date || 'Pending...'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Locked Slot</p>
                                    <p className="text-sm font-black uppercase">{data.time_slot || 'Pending...'}</p>
                                </div>
                            </div>

                            <div className="bg-black/5 p-6 rounded-2xl space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                                    <ShieldCheck className="w-4 h-4" /> Required Documents
                                </div>
                                <ul className="space-y-2">
                                    {['Government ID', 'Employment Contract', '2 Months Paystubs'].map(doc => (
                                        <li key={doc} className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-2">
                                            <div className="w-1 h-1 bg-black rounded-full" /> {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button 
                                disabled={!data.branch_id || !data.date || !data.time_slot || processing}
                                className="w-full bg-black text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:invert transition-all disabled:opacity-30 disabled:hover:invert-0 flex items-center justify-center gap-3"
                            >
                                Secure Appointment <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
