import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Download, ArrowUpRight, 
    ArrowDownRight, ShieldAlert, AlertTriangle,
    CheckCircle, Clock, ChevronRight, Activity,
    Calendar, DollarSign, Users, ExternalLink,
    FilterX, MoreHorizontal, ShieldCheck
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
    PieChart, Pie
} from 'recharts';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const RiskBadge = ({ level }) => {
    const styles = {
        critical: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        low: "bg-green-500/10 text-green-500 border-green-500/20"
    };
    return (
        <div className={clsx("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5", styles[level])}>
            {level === 'critical' && <ShieldAlert className="w-3 h-3" />}
            {level} risk
        </div>
    );
};

export default function TransactionMonitoring({ transactions, analytics, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [localFilters, setLocalFilters] = useState(filters);
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('super-admin.transactions.index'), { ...localFilters, search: searchTerm }, { preserveState: true });
    };

    const updateFilter = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get(route('super-admin.transactions.index'), newFilters, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({});
        setSearchTerm('');
        router.get(route('super-admin.transactions.index'));
    };

    return (
        <DashboardLayout>
            <Head title="Institutional Transaction Monitoring" />

            <div className="mt-8 space-y-12 font-mono tracking-tighter">
                {/* Header & Intelligence Feed */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-1.5 rounded-full">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Surveillance Protocol v3.8</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter text-white uppercase">FLOW <br /> MONITOR.</h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a 
                            href={route('super-admin.transactions.export')} 
                            className="bg-white text-black px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </a>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={clsx(
                                "px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border transition-all",
                                showFilters ? "bg-white/10 border-white text-white" : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>
                </div>

                {/* Risk Intelligence Dash */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-[40px] p-10 space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tighter">NETWORK VOLUME</h3>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">7-Day Protocol Velocity</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white tracking-tighter">${Number(analytics.total_volume).toLocaleString()}</p>
                                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">+12.4% FROM PREV</p>
                            </div>
                        </div>
                        <div className="h-[250px] w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart data={analytics.volume_over_time}>
                                    <defs>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10, fontWeight: 900}} />
                                    <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '20px'}} itemStyle={{color: '#FFF', fontSize: '10px', fontWeight: 'bold'}} />
                                    <Area type="monotone" dataKey="total" stroke="#FFFFFF" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white text-black rounded-[40px] p-10 space-y-10 relative overflow-hidden">
                        <h3 className="text-sm font-black tracking-tighter uppercase relative z-10">Risk Distribution</h3>
                        <div className="space-y-6 relative z-10">
                            {['critical', 'high', 'medium', 'low'].map((level) => {
                                const count = transactions.data.filter(t => t.risk_level === level).length;
                                const percentage = (count / transactions.data.length) * 100 || 0;
                                return (
                                    <div key={level} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{level} RISK</span>
                                            <span className="text-[10px] font-black">{count} NODES</span>
                                        </div>
                                        <div className="h-1 bg-black/5 w-full rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className={clsx(
                                                    "h-full transition-all",
                                                    level === 'critical' ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                                                    level === 'high' ? 'bg-orange-500' :
                                                    level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                )}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-[40px]" />
                        <button className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest relative z-10 hover:invert transition-all">Generate Risk Report</button>
                    </div>
                </div>

                {/* Active Filtering System */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol Search</label>
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input 
                                            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Ref / Entity / Email..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:border-white transition-all"
                                        />
                                    </form>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Status Pipe</label>
                                    <select 
                                        onChange={e => updateFilter('status', e.target.value)} value={localFilters.status || 'all'}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="flagged">Flagged</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol Type</label>
                                    <select 
                                        onChange={e => updateFilter('type', e.target.value)} value={localFilters.type || 'all'}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white appearance-none cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="transfer">Direct Transfer</option>
                                        <option value="deposit">Inflow (Deposit)</option>
                                        <option value="withdrawal">Outflow (Withdrawal)</option>
                                        <option value="trade">Liquidity Trade</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-1">
                                    <button 
                                        onClick={clearFilters}
                                        className="w-full bg-white/5 text-gray-500 hover:text-white border border-white/10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                    >
                                        <FilterX className="w-4 h-4" />
                                        Clear Protocols
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Monitoring Table */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40">
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Sequence</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Entities (Sender → Receiver)</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Liquidity Flow</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">Risk Index</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                                                    tx.type === 'deposit' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                                    tx.type === 'withdrawal' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                    "bg-white/5 border-white/10 text-white"
                                                )}>
                                                    {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : 
                                                     tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> : 
                                                     <Activity className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white">{tx.transaction_id || tx.reference}</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{tx.category || tx.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-[11px] font-black text-white">{tx.sender?.name || 'ROOT'}</p>
                                                    <p className="text-[8px] text-gray-600 font-bold uppercase">{tx.sender?.email || 'SYSTEM'}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-800" />
                                                <div>
                                                    <p className="text-[11px] font-black text-white">{tx.receiver?.name || tx.user?.name}</p>
                                                    <p className="text-[8px] text-gray-600 font-bold uppercase">{tx.receiver?.email || tx.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-white">${Number(tx.amount).toLocaleString()}</p>
                                            <p className={clsx(
                                                "text-[9px] font-black uppercase tracking-widest mt-1",
                                                tx.status === 'completed' ? "text-green-500" : "text-yellow-500"
                                            )}>
                                                {tx.status}
                                            </p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <RiskBadge level={tx.risk_level} />
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all" title="View Trace">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-3 bg-white/5 text-gray-400 hover:text-green-400 rounded-xl transition-all" title="Approve Protocol">
                                                    <ShieldCheck className="w-4 h-4" />
                                                </button>
                                                <button className="p-3 bg-white/5 text-gray-400 hover:text-red-400 rounded-xl transition-all" title="Flag Breach">
                                                    <ShieldAlert className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-10 py-8 bg-black/20 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            Auditing sequences {transactions.from}-{transactions.to} of {transactions.total}
                        </p>
                        <div className="flex gap-2">
                            {transactions.links.map((link, idx) => (
                                <Link 
                                    key={idx}
                                    href={link.url || '#'}
                                    className={clsx(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        link.active ? "bg-white text-black" : "bg-white/5 text-gray-500 hover:text-white disabled:opacity-50"
                                    )}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
