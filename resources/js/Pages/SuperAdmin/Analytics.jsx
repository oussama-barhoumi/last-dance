import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, PieChart as PieIcon, BarChart3, 
    ArrowUpRight, ArrowDownRight, Globe, 
    Zap, Activity, ShieldCheck, Target
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, 
    Cell, BarChart, Bar, Legend 
} from 'recharts';
import clsx from 'clsx';

const COLORS = ['#FFFFFF', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

const AnalyticsCard = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="bg-[#0D0D0D] border border-white/10 p-10 rounded-[40px] relative overflow-hidden group">
        <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={clsx(
                "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}%
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{value}</h3>
        </div>
    </div>
);

export default function Analytics({ loanStats, typeData, statusData, volumeData }) {
    return (
        <DashboardLayout>
            <Head title="Network Analytics Protocol" />

            <div className="space-y-12 py-10">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-[1px] bg-white/20" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Institutional Intelligence</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Credit <span className="text-gray-600">Analytics</span></h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl mt-4">Real-time visualization of capital flow, risk distribution, and institutional yield metrics across the global network.</p>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnalyticsCard 
                        title="Total Volume" 
                        value={`$${(loanStats.total_volume / 1000).toFixed(1)}k`} 
                        change="12.4" 
                        isPositive={true} 
                        icon={Globe} 
                    />
                    <AnalyticsCard 
                        title="Active Capital" 
                        value={`$${(loanStats.active_capital / 1000).toFixed(1)}k`} 
                        change="8.2" 
                        isPositive={true} 
                        icon={Zap} 
                    />
                    <AnalyticsCard 
                        title="Interest Yield" 
                        value={`$${Number(loanStats.interest_yield).toLocaleString()}`} 
                        change="5.1" 
                        isPositive={true} 
                        icon={TrendingUp} 
                    />
                    <AnalyticsCard 
                        title="Default Rate" 
                        value={`${loanStats.default_rate}%`} 
                        change="0.2" 
                        isPositive={false} 
                        icon={ShieldCheck} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Volume Chart */}
                    <div className="lg:col-span-2 bg-[#0D0D0D] border border-white/10 p-12 rounded-[50px]">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h4 className="text-2xl font-black text-white tracking-tighter uppercase">Disbursement Volume</h4>
                                <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1">Monthly capital injection history</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Monthly</button>
                                <button className="px-4 py-2 bg-white/5 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Quarterly</button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={volumeData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff30" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis 
                                        stroke="#ffffff30" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tick={{ fill: '#666' }}
                                        tickFormatter={(val) => `$${val/1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}
                                        itemStyle={{ color: '#FFF', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#FFF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Type Distribution */}
                    <div className="bg-[#0D0D0D] border border-white/10 p-12 rounded-[50px] flex flex-col">
                        <div className="mb-12">
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase">Distribution</h4>
                            <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1">Allocation by loan type</p>
                        </div>
                        <div className="flex-1 h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {typeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4 mt-8">
                            {typeData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white">${(item.value / 1000).toFixed(1)}k</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Status Performance */}
                    <div className="bg-[#0D0D0D] border border-white/10 p-12 rounded-[50px]">
                        <div className="mb-12">
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase">Protocol Status</h4>
                            <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1">Success and failure metrics</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff30" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#ffffff30" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }}
                                    />
                                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Approved' ? '#22c55e' : entry.name === 'Pending' ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operational Health */}
                    <div className="bg-[#0D0D0D] border border-white/10 p-12 rounded-[50px] relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 opacity-5">
                            <Activity className="w-80 h-80 text-white" />
                        </div>
                        <div className="mb-12">
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase">Network Health</h4>
                            <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1">Operational integrity report</p>
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                                        <ShieldCheck className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-white">KYC Compliance</h5>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">System-wide Verification</p>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter uppercase">98.4%</span>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                        <Target className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-white">Recovery Target</h5>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Monthly Principal Recalls</p>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter uppercase">104.2%</span>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                                        <Activity className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-white">Audit Frequency</h5>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time Node Monitoring</p>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter uppercase">Continuous</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
