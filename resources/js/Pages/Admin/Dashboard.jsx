import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Users, FileText, Landmark, ShieldCheck, 
    AlertCircle, ArrowUpRight, BarChart3,
    Activity, Clock, ChevronRight
} from 'lucide-react';

const AdminStatCard = ({ label, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white text-black p-10 border border-white space-y-6">
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">{label}</p>
            <p className="text-4xl font-black tracking-tighter">{value}</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4">{subtext}</p>
        </div>
    </div>
);

export default function AdminDashboard({ stats }) {
    return (
        <DashboardLayout>
            <Head title="Admin Operations Terminal" />

            <div className="mt-8 space-y-12 font-mono uppercase tracking-tighter">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Oversight Protocol</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter">ADMIN <br /> CONSOLE.</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:invert transition-all">Export Report</button>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStatCard 
                        label="Registered Nodes" 
                        value={stats.total_users} 
                        subtext="Total unique user identifiers"
                        icon={Users}
                        trend="+12% VS LAST MONTH"
                    />
                    <AdminStatCard 
                        label="Identity Backlog" 
                        value={stats.pending_kyc} 
                        subtext="KYC documents awaiting audit"
                        icon={FileText}
                    />
                    <AdminStatCard 
                        label="Credit Requests" 
                        value={stats.total_loans} 
                        subtext="Active loan applications"
                        icon={Landmark}
                    />
                </div>

                {/* Quick Actions & Audit Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xl font-black tracking-tighter">PROTOCOL TASKS</h3>
                        <div className="space-y-4">
                            <Link href={route('admin.kyc.index')} className="block bg-white/5 border border-white/10 p-8 group hover:bg-white hover:text-black transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">IDENTITY VERIFICATION</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-black/60 transition-colors">Audit pending KYC documents for network access.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                            </Link>

                            <div className="bg-white/5 border border-white/10 p-8 group hover:bg-white hover:text-black transition-all cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors">
                                            <Landmark className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">LOAN DISBURSEMENT</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-black/60 transition-colors">Review and approve credit requests from protocol nodes.</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-white/20 p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black tracking-tighter">SYSTEM LOGS</h3>
                            <Activity className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="space-y-6">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex gap-4 border-l-2 border-white/10 pl-6 py-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white">NODE_EVENT: KYC_UPLOAD</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">User #1029 uploaded ID_FRONT.PNG</p>
                                        <div className="flex items-center gap-2 text-[8px] font-black text-gray-600 mt-2">
                                            <Clock className="w-3 h-3" />
                                            <span>2M AGO</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full border border-white/20 py-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">Open Full Audit Trail</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
