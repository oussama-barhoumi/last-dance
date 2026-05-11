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
                        <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter text-white">ADMIN <br /> CONSOLE.</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:invert transition-all">Export Report</button>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AdminStatCard 
                        label="Nodes" 
                        value={stats.total_users} 
                        subtext="Network Identifiers"
                        icon={Users}
                        trend="+12%"
                    />
                    <AdminStatCard 
                        label="Active" 
                        value={stats.total_users} 
                        subtext="Live Sessions"
                        icon={Activity}
                    />
                    <AdminStatCard 
                        label="Loans" 
                        value={stats.total_loans} 
                        subtext="Pending Review"
                        icon={Landmark}
                    />
                    <AdminStatCard 
                        label="Alerts" 
                        value="3" 
                        subtext="Fraud Anomalies"
                        icon={AlertCircle}
                    />
                </div>

                {/* Intelligence & Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Revenue Performance */}
                        <div className="bg-white/5 border border-white/10 p-10 space-y-8">
                            <h3 className="text-xl font-black tracking-tighter text-white">REVENUE PERFORMANCE</h3>
                            <div className="flex gap-10">
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-gray-500">Transaction Fees</span>
                                        <span className="text-sm font-black text-white">$12,450.00</span>
                                    </div>
                                    <div className="h-1 bg-white/10 w-full"><div className="h-full bg-white w-[65%]" /></div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-gray-500">Loan Interest</span>
                                        <span className="text-sm font-black text-white">$45,200.00</span>
                                    </div>
                                    <div className="h-1 bg-white/10 w-full"><div className="h-full bg-purple-500 w-[80%]" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Protocol Tasks */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black tracking-tighter text-white">PROTOCOL TASKS</h3>
                            <div className="space-y-4">
                                <Link href={route('admin.kyc.index')} className="block bg-white/5 border border-white/10 p-8 group hover:bg-white hover:text-black transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase">Identity Verification</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Audit pending KYC documents for network access.</p>
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
                                                <p className="text-sm font-black uppercase">Loan Disbursement</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Review and approve credit requests from protocol nodes.</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Support Analytics */}
                        <div className="bg-white text-black p-8 border border-white space-y-6">
                            <h3 className="text-sm font-black tracking-tighter">SUPPORT QUEUE</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase">Open Tickets</span>
                                    <span className="text-sm font-black">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-500">Avg Response Time</span>
                                    <span className="text-sm font-black">1.4H</span>
                                </div>
                            </div>
                            <button className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">Manage Help Desk</button>
                        </div>

                        <div className="bg-black border border-white/20 p-8 space-y-8">
                            <div className="flex justify-between items-center text-white">
                                <h3 className="text-sm font-black tracking-tighter uppercase">Audit Feed</h3>
                                <Activity className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="space-y-6">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="flex gap-4 border-l-2 border-white/10 pl-6 py-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white uppercase">Node_Event: KYC_Upload</p>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">User #1029 uploaded ID_FRONT.PNG</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
