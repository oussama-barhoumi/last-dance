import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Calendar, MapPin, Clock, 
    CheckCircle, User, Landmark,
    ArrowUpRight, ShieldCheck, MoreVertical
} from 'lucide-react';
import clsx from 'clsx';

export default function AppointmentIndex({ appointments }) {
    const handleAction = (id, action) => {
        router.post(route(`admin.appointments.${action}`, id));
    };

    return (
        <DashboardLayout>
            <Head title="Institutional Appointment Queue" />

            <div className="space-y-12 py-10">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Ops <span className="text-gray-600">Queue.</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.4em]">Bank Appointment & Verification Terminal</p>
                </div>

                {/* Main Queue */}
                <div className="grid grid-cols-1 gap-6">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-[#0A0A0A] border border-white/10 rounded-[40px] p-8 hover:border-white/30 transition-all group">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                {/* Applicant & Loan Info */}
                                <div className="flex items-center gap-6 min-w-[300px]">
                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center font-black text-2xl text-white group-hover:bg-white group-hover:text-black transition-all">
                                        {apt.user?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white uppercase tracking-tighter">{apt.user?.name}</p>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Loan: <span className="text-white">{apt.loan?.type} (${Number(apt.loan?.amount).toLocaleString()})</span></p>
                                    </div>
                                </div>

                                {/* Appointment Specifics */}
                                <div className="flex flex-wrap gap-8 items-center">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Protocol Date</span>
                                        </div>
                                        <p className="text-sm font-black text-white">{new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Locked Slot</span>
                                        </div>
                                        <p className="text-sm font-black text-white uppercase">{apt.time_slot}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Institutional Node</span>
                                        </div>
                                        <p className="text-sm font-black text-white uppercase">{apt.branch?.name}</p>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-6 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                                    <div className={clsx(
                                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                                        apt.status === 'completed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                    )}>
                                        {apt.status}
                                    </div>

                                    {apt.status !== 'completed' && (
                                        <div className="flex gap-2 ml-auto">
                                            <button 
                                                onClick={() => handleAction(apt.id, 'confirm')}
                                                className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                                            >
                                                Confirm Visit
                                            </button>
                                            <button 
                                                onClick={() => handleAction(apt.id, 'complete')}
                                                className="px-6 py-4 bg-green-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:invert transition-all flex items-center gap-2"
                                            >
                                                Finalize Loan <CheckCircle className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="bg-[#0A0A0A] border border-dashed border-white/10 rounded-[50px] p-24 text-center">
                            <Landmark className="w-12 h-12 text-gray-600 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">No Scheduled Protocols</h3>
                            <p className="text-gray-500 text-sm mt-2">The institutional appointment queue is currently empty.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
