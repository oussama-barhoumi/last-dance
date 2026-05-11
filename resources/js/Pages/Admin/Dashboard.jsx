import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, FileText, Landmark, ShieldCheck, 
    AlertCircle, ArrowUpRight, BarChart3,
    Activity, Clock, ChevronRight, TrendingUp,
    ArrowDownRight, ShieldAlert, Zap, Search,
    MoreHorizontal, Filter
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { useState } from 'react';
import clsx from 'clsx';

const AdminStatCard = ({ label, value, subtext, icon: Icon, trend, trendType = 'up' }) => (
    <div className="bg-[#0A0A0A] text-white p-8 border border-white/10 rounded-[32px] space-y-6 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl group-hover:bg-white group-hover:text-black transition-all duration-500">
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className={clsx(
                    "text-[10px] font-black uppercase tracking-widest flex items-center gap-1 px-3 py-1 rounded-full border",
                    trendType === 'up' ? "text-green-400 border-green-400/20 bg-green-400/5" : "text-red-400 border-red-400/20 bg-red-400/5"
                )}>
                    {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </span>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">{label}</p>
            <p className="text-4xl font-black tracking-tighter">{value}</p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-4">{subtext}</p>
        </div>
        {/* Glow Decor */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors" />
    </div>
);

export default function AdminDashboard({ stats, revenueData, growthData, recentTransactions, recentUsers, fraudAlerts }) {
    const [activeChart, setActiveChart] = useState('revenue');

    return (
        <DashboardLayout>
            <Head title="Admin Operations Terminal" />

            <div className="mt-8 space-y-12 font-mono tracking-tighter">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Oversight Protocol v2.4</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter text-white">OPS <br /> CENTER.</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex gap-1">
                            <button className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Live Feed</button>
                            <button className="px-6 py-3 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">History</button>
                        </div>
                    </div>
                </div>

                {/* Primary Intelligence Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AdminStatCard 
                        label="Total Nodes" 
                        value={stats.total_users.toLocaleString()} 
                        subtext="Cumulative unique user IDs"
                        icon={Users}
                        trend="+12.5%"
                    />
                    <AdminStatCard 
                        label="Protocol Volume" 
                        value={`$${(stats.total_transactions / 1000).toFixed(1)}K`} 
                        subtext="Total network transactions"
                        icon={Activity}
                        trend="+8.2%"
                    />
                    <AdminStatCard 
                        label="Net Inflow" 
                        value={`$${(stats.total_deposits / 1000000).toFixed(1)}M`} 
                        subtext="Cumulative deposit assets"
                        icon={TrendingUp}
                        trend="+15.4%"
                    />
                    <AdminStatCard 
                        label="Net Outflow" 
                        value={`$${(stats.total_withdrawals / 1000000).toFixed(1)}M`} 
                        subtext="Cumulative withdrawal assets"
                        icon={ArrowDownRight}
                        trend="-2.1%"
                        trendType="down"
                    />
                    <AdminStatCard 
                        label="Credit Backlog" 
                        value={stats.pending_loans} 
                        subtext="Loans awaiting approval"
                        icon={Landmark}
                    />
                    <AdminStatCard 
                        label="Risk Anomalies" 
                        value={stats.suspicious_transactions} 
                        subtext="Flagged protocol activities"
                        icon={ShieldAlert}
                        trendType="down"
                        trend="CRITICAL"
                    />
                </div>

                {/* Data Intelligence Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* 1. Performance Analytics */}
                        <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[40px] space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tighter">PROTOCOL ANALYTICS</h3>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Institutional Data Monitoring</p>
                                </div>
                                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                                    <button 
                                        onClick={() => setActiveChart('revenue')}
                                        className={clsx(
                                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeChart === 'revenue' ? "bg-white text-black" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        Revenue
                                    </button>
                                    <button 
                                        onClick={() => setActiveChart('growth')}
                                        className={clsx(
                                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeChart === 'growth' ? "bg-white text-black" : "text-gray-500 hover:text-white"
                                        )}
                                    >
                                        Growth
                                    </button>
                                </div>
                            </div>

                            <div className="h-[400px] w-full min-h-[400px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    {activeChart === 'revenue' ? (
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                            <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '20px'}} itemStyle={{color: '#FFF', fontSize: '10px', fontWeight: 'bold'}} />
                                            <Area type="monotone" dataKey="value" stroke="#FFFFFF" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                        </AreaChart>
                                    ) : (
                                        <BarChart data={growthData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                            <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '20px'}} itemStyle={{color: '#FFF', fontSize: '10px', fontWeight: 'bold'}} cursor={{fill: '#222'}} />
                                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                                {growthData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === growthData.length - 1 ? '#FFFFFF' : '#333'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. Audit Watchlist (Transactions) */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase">Protocol Audit Log</h3>
                                <div className="flex gap-4">
                                    <button className="text-gray-500 hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
                                    <button className="text-gray-500 hover:text-white transition-colors"><Filter className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto border border-white/10 rounded-[32px] bg-white/5 backdrop-blur-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/40">
                                            <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol ID</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">Entities</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-6 text-[10px] font-black text-white">{tx.transaction_id || tx.reference}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-white">{tx.sender?.name || 'ROOT'}</span>
                                                        <ChevronRight className="w-3 h-3 text-gray-600" />
                                                        <span className="text-[10px] font-black text-gray-400">{tx.receiver?.name || tx.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] font-black text-white">${Number(tx.amount).toLocaleString()}</td>
                                                <td className="px-8 py-6">
                                                    <span className={clsx(
                                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                        tx.status === 'completed' ? "bg-green-500/10 text-green-400 border-green-400/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-400/20"
                                                    )}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right text-[10px] font-black text-gray-500 uppercase">
                                                    {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Operational Sidebar */}
                    <div className="space-y-10">
                        {/* 3. Fraud Watchlist */}
                        <div className="bg-white text-black p-8 rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center relative z-10">
                                <h3 className="text-sm font-black tracking-tighter uppercase">Risk Surveillance</h3>
                                <ShieldAlert className="w-5 h-5 text-red-600" />
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                                {fraudAlerts.map(alert => (
                                    <div key={alert.id} className="p-4 bg-black/5 rounded-2xl border border-black/5 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol Breach</span>
                                            <span className="text-[8px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">HIGH RISK</span>
                                        </div>
                                        <p className="text-[10px] font-black">Transfer from {alert.sender?.name || 'Unknown'}</p>
                                        <p className="text-[11px] font-black">${Number(alert.amount).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest relative z-10 hover:invert transition-all">Review All Threats</button>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px]" />
                        </div>

                        {/* 4. Network Nodes (Recent Users) */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white tracking-tighter uppercase">Recent Nodes</h3>
                                <Users className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="space-y-6">
                                {recentUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 border border-white/10 text-white flex items-center justify-center rounded-xl font-black text-xs group-hover:bg-white group-hover:text-black transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white">{user.name}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user.role}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Support Analytics */}
                        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[40px] space-y-8 relative overflow-hidden group">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white tracking-tighter uppercase">System Health</h3>
                                <Zap className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Server Load</span>
                                        <span className="text-[10px] font-black text-white">42%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "42%" }}
                                            className="h-full bg-white" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Threads</span>
                                        <span className="text-[10px] font-black text-white">128</span>
                                    </div>
                                    <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "65%" }}
                                            className="h-full bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
