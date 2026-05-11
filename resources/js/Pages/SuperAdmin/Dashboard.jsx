import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ShieldAlert, ShieldCheck, Lock, Unlock, 
    MoreHorizontal, ArrowUpRight, TrendingUp,
    Activity, Shield, AlertTriangle, Zap,
    Search, Bell, Info, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import clsx from 'clsx';

const AdminStatCard = ({ label, value, type, icon: Icon }) => (
    <div className="bg-white text-black p-10 flex items-center justify-between group border border-white">
        <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">{label}</p>
            <p className="text-4xl font-black tracking-tighter">{value}</p>
        </div>
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center">
            <Icon className="w-8 h-8" />
        </div>
    </div>
);

export default function SuperAdminDashboard({ recentUsers, recentTransactions, stats, chartData, blockedUsers, flash }) {
    const handleToggleBlock = (user) => {
        if (confirm(`INITIATE PROTOCOL: ${user.is_blocked ? 'RESTORE' : 'BLOCK'} ACCESS FOR ${user.name}?`)) {
            router.post(route('super-admin.users.toggle-block', user.id));
        }
    };

    return (
        <DashboardLayout>
            <Head title="Super Admin Terminal" />

            {/* Protocol Alerts (Flash Messages) */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed top-24 right-10 z-[100] bg-white text-black p-6 border border-white shadow-2xl flex items-center gap-4"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-10 font-mono uppercase tracking-tighter">
                {/* Main Content Area (3 Columns) */}
                <div className="lg:col-span-3 space-y-12">
                    
                    {/* 1. Header Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <AdminStatCard label="Total Nodes" value={stats.total_users} icon={Users} />
                        <AdminStatCard label="Global Cap" value={`$${(stats.total_capital / 1000000).toFixed(1)}M`} icon={TrendingUp} />
                        <AdminStatCard label="System Health" value="99.9%" icon={Zap} />
                        <AdminStatCard label="Sessions" value="1,284" icon={Activity} />
                    </div>

                    {/* 2. Intelligence Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Global Capital Flow (Chart) */}
                        <div className="bg-black border border-white/10 p-10 space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-black tracking-tighter text-white">REVENUE FLOW</h3>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Global Transaction Yield</p>
                                </div>
                            </div>
                            <div className="h-[250px] w-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                        <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '0px'}} itemStyle={{color: '#FFF', fontSize: '10px', fontWeight: 'bold'}} />
                                        <Area type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorVol)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Fraud Detection AI */}
                        <div className="bg-white text-black p-10 space-y-8 border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full" />
                            </div>
                            <h3 className="text-xl font-black tracking-tighter">FRAUD AI PROTOCOL</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Monitoring</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">ENABLED</span>
                                </div>
                                <div className="p-4 bg-gray-50 border border-black/5 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black">SCAN_EFFICIENCY</span>
                                        <span className="text-[9px] font-black">98.2%</span>
                                    </div>
                                    <div className="h-1 bg-gray-200 w-full">
                                        <div className="h-full bg-black w-[98.2%]" />
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-gray-500 leading-relaxed">AI is currently analyzing 429 pending transactions. No high-risk anomalies detected in the last 15 minutes.</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Global Audit Log */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black tracking-tighter text-white">GLOBAL AUDIT LOG (DIRECT TRANSFERS)</h3>
                        {/* ... Table Content ... */}
                        <div className="overflow-x-auto border border-white/10 bg-white/5">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black">
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol Reference</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-white">{tx.reference || tx.transaction_id}</span>
                                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                                                        {tx.sender?.name || 'SYSTEM'} → {tx.receiver?.name || tx.user?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={clsx(
                                                    "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                                                    tx.category === 'Transfer' ? "bg-white text-black border-white" : "text-gray-500 border-white/10"
                                                )}>
                                                    {tx.category || tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black text-white">${Number(tx.amount).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-none shadow-[0_0_8px_#22c55e]" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Completed</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-[9px] font-black text-gray-500 uppercase">
                                                    {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. Recent Node Activity (List) */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black tracking-tighter">RECENT NODE REGISTRATION</h3>
                        <div className="space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="bg-white/5 border border-white/10 p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black">{user.name}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-6">
                                        <div>
                                            <p className="text-xs font-black">${Number(user.balance).toLocaleString()}</p>
                                            <p className="text-[8px] text-gray-500 font-black mt-1">CAPITAL ASSETS</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleToggleBlock(user)}
                                                className="p-3 border border-white/10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group/btn"
                                                title="Initiate Block Protocol"
                                            >
                                                <Lock className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 border border-white/10 hover:bg-white hover:text-black transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (1 Column) */}
                <div className="space-y-10">
                    
                    {/* 4. Suspended Protocols (Blocked Users) */}
                    <div className="bg-white text-black p-8 border border-white space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black tracking-tighter">SUSPENDED NODES</h3>
                            <MoreHorizontal className="w-4 h-4" />
                        </div>
                        
                        <div className="space-y-6">
                            {blockedUsers.length > 0 ? blockedUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between border-b border-black/10 pb-4 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-[10px] font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black">{user.name}</p>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Blocked</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggleBlock(user)}
                                        className="p-2 hover:bg-black hover:text-white transition-all"
                                    >
                                        <Unlock className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest py-10 text-center">No Suspended Nodes</p>
                            )}
                        </div>

                        <button className="w-full border-2 border-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                            View All Blocked
                        </button>
                    </div>

                    {/* 5. System Actions */}
                    <div className="bg-black border border-white/20 p-8 space-y-8">
                        <h3 className="text-sm font-black tracking-tighter">ADMIN ACTIONS</h3>
                        
                        <div className="space-y-4">
                            <div className="p-6 bg-white/5 border border-white/10 hover:border-white transition-colors cursor-pointer group">
                                <Shield className="w-6 h-6 mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Global Audit</p>
                                <p className="text-[8px] text-gray-500 leading-relaxed font-bold">Initiate full system check of all transaction logs.</p>
                            </div>
                            
                            <div className="p-6 bg-white/5 border border-white/10 hover:border-white transition-colors cursor-pointer group">
                                <AlertTriangle className="w-6 h-6 mb-4 text-red-500" />
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-red-500">Emergency Lock</p>
                                <p className="text-[8px] text-gray-500 leading-relaxed font-bold">Freeze all network activity immediately.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <div className="flex gap-2">
                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 bg-white/10 border border-white/20" />)}
                                <div className="w-8 h-8 flex items-center justify-center bg-white text-black text-[8px] font-black">+4</div>
                            </div>
                            <button className="bg-white p-3 text-black"><Zap className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
