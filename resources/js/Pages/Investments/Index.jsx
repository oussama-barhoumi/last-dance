import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import { 
    TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, 
    ArrowUpRight, ArrowDownLeft, Plus, Filter,
    Briefcase, Globe, Zap, History, ChevronRight,
    Search, AlertCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import clsx from 'clsx';

const chartData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 59000 },
    { name: 'Jun', value: 68000 },
    { name: 'Jul', value: 75000 },
];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6'];

const AssetCard = ({ asset }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 group transition-all"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    asset.return_percentage >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                    {asset.category === 'Crypto' ? <Zap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{asset.company_name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.sector}</p>
                </div>
            </div>
            <div className={clsx(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                asset.return_percentage >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
                {asset.return_percentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(asset.return_percentage)}%
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Value</p>
                    <p className="text-xl font-black text-gray-900">${parseFloat(asset.value).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Risk</p>
                    <span className={clsx(
                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase border",
                        asset.risk_level === 'Low' ? "border-green-200 text-green-600 bg-green-50" : 
                        asset.risk_level === 'Medium' ? "border-yellow-200 text-yellow-600 bg-yellow-50" : 
                        "border-red-200 text-red-600 bg-red-50"
                    )}>
                        {asset.risk_level}
                    </span>
                </div>
            </div>
            
            <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Buy</button>
                <button className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Sell</button>
            </div>
        </div>
    </motion.div>
);

export default function Index({ investments, stats, recentTransactions }) {
    const pieData = investments.reduce((acc, inv) => {
        const existing = acc.find(item => item.name === inv.category);
        if (existing) {
            existing.value += parseFloat(inv.value);
        } else {
            acc.push({ name: inv.category, value: parseFloat(inv.value) });
        }
        return acc;
    }, []);

    return (
        <DashboardLayout>
            <Head title="Investment Portfolio - DoodlyBank" />

            <div className="space-y-8 mt-8">
                {/* Header Stats */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Investment Portfolio</h2>
                        <p className="text-sm text-gray-500 mt-1">Track and manage your global asset distribution.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-400 hover:text-black transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-black/10">
                            <Plus className="w-5 h-5" /> New Investment
                        </button>
                    </div>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Total Portfolio Value</p>
                        <p className="text-3xl font-black relative z-10">${stats.totalValue.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-1 text-green-400 font-bold text-[10px] relative z-10">
                            <ArrowUpRight className="w-3 h-3" /> +12.4% this month
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Profit</p>
                        <p className="text-3xl font-black text-gray-900">${stats.totalProfit.toLocaleString()}</p>
                        <div className={clsx(
                            "mt-4 flex items-center gap-1 font-bold text-[10px]",
                            stats.profitPercentage >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                            {stats.profitPercentage >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stats.profitPercentage.toFixed(2)}% ROI
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Assets</p>
                        <p className="text-3xl font-black text-gray-900">{investments.length}</p>
                        <div className="mt-4 flex -space-x-2">
                            {investments.map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Earning</p>
                            <Info className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">$2,450.00</p>
                        <span className="text-[10px] font-bold text-gray-400">Next payout in 12 days</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6" /> Performance Analysis
                            </h3>
                            <div className="flex bg-gray-50 p-1 rounded-xl">
                                <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">Value</button>
                                <button className="px-4 py-1.5 text-gray-400 text-xs font-bold">Return</button>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        hide 
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#8B5CF6" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Allocation Chart */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <PieIcon className="w-6 h-6" /> Allocation
                        </h3>
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global</p>
                                    <p className="text-xl font-black text-gray-900">100%</p>
                                </div>
                            </div>
                            <div className="w-full mt-8 grid grid-cols-2 gap-4">
                                {pieData.map((data, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{data.name}</span>
                                        <span className="text-[10px] font-black text-gray-900 ml-auto">{((data.value / stats.totalValue) * 100).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assets Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-900">Your Assets</h3>
                        <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">View All Assets</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {investments.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
                    </div>
                </div>

                {/* History & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <History className="w-6 h-6" /> Investment History
                            </h3>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-900">
                                                        {tx.description.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900">{tx.description}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">{tx.category}</span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={clsx(
                                                    "text-xs font-black",
                                                    tx.type === 'receive' ? "text-green-500" : "text-gray-900"
                                                )}>
                                                    {tx.type === 'receive' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(tx.date).toLocaleDateString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] p-10 rounded-[40px] text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-black mb-6">Market Overview</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-400" />
                                        <span className="text-xs font-bold">Global Stocks</span>
                                    </div>
                                    <span className="text-[10px] font-black text-green-400">+2.45%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        <span className="text-xs font-bold">Crypto Index</span>
                                    </div>
                                    <span className="text-[10px] font-black text-red-400">-1.12%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-10 p-6 rounded-3xl bg-purple-600 shadow-xl shadow-purple-600/20">
                            <p className="text-xs font-black uppercase tracking-widest mb-2">Pro Insights</p>
                            <p className="text-[10px] font-medium leading-relaxed opacity-90">
                                Your portfolio is performing 4.2% better than the market average. Consider diversifying into Bonds to lower your risk profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
