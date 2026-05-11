import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    BarChart3, PieChart as PieIcon, TrendingUp, TrendingDown,
    Download, Calendar, Filter, FileText,
    ChevronRight, ArrowUpRight, ArrowDownLeft,
    Wallet, Target, Info, Search, MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
    LineChart, Line
} from 'recharts';
import clsx from 'clsx';

const monthlyComparison = [
    { name: 'Jan', income: 4500, expense: 3200 },
    { name: 'Feb', income: 5200, expense: 3800 },
    { name: 'Mar', income: 4800, expense: 4100 },
    { name: 'Apr', income: 6100, expense: 4200 },
    { name: 'May', income: 5900, expense: 4500 },
    { name: 'Jun', income: 6800, expense: 4800 },
];

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

export default function Index({ stats, categoryBreakdown, recentReports }) {
    const pieData = categoryBreakdown.map((item, i) => ({
        name: item.category,
        value: parseFloat(item.total)
    }));

    return (
        <DashboardLayout>
            <Head title="Financial Reports - HarborBank" />

            <div className="space-y-10 mt-8">
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Financial Insights</h2>
                        <p className="text-sm text-gray-500 mt-1">Deep dive into your spending habits and revenue streams.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-gray-100 p-1.5 rounded-2xl flex items-center shadow-sm">
                            <button className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-900">Monthly</button>
                            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-black">Yearly</button>
                        </div>
                        <button className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-400 hover:text-black transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-black/10">
                            <Download className="w-5 h-5" /> Generate Report
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">Net Cash Flow</p>
                        <p className="text-3xl font-black relative z-10">${stats.netFlow.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-1 text-green-400 font-bold text-[10px] relative z-10">
                            <ArrowUpRight className="w-3 h-3" /> +8.4% vs last month
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Income</p>
                        <p className="text-3xl font-black text-gray-900">${stats.totalIncome.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-1 text-green-500 font-bold text-[10px]">
                            <TrendingUp className="w-3 h-3" /> 12 New sources
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Expenses</p>
                        <p className="text-3xl font-black text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-1 text-red-500 font-bold text-[10px]">
                            <TrendingDown className="w-3 h-3" /> 4% Increase
                        </div>
                    </div>
                    <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Savings Rate</p>
                            <Target className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats.savingsRate.toFixed(1)}%</p>
                        <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${stats.savingsRate}%` }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bar Chart: Income vs Expenses */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <BarChart3 className="w-6 h-6" /> Income vs Expenses
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-black" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Income</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Expense</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyComparison} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#F9FAFB' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                                    />
                                    <Bar dataKey="income" fill="#0A0A0A" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="expense" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Spending Breakdown */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <PieIcon className="w-6 h-6" /> Spending Categories
                        </h3>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="h-[220px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={70}
                                            outerRadius={90}
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
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                    <p className="text-xl font-black text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3">
                                {pieData.map((data, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{data.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-900">${data.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    {/* Generated Reports Table */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <FileText className="w-6 h-6" /> Generated Reports
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                <input type="text" placeholder="Search reports..." className="pl-8 pr-4 py-1.5 bg-gray-50 border-none rounded-lg text-[10px] focus:ring-black w-40" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Report Name</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Format</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map((report) => (
                                        <tr key={report.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">{report.name}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase">ID: {report.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 text-center">
                                                <span className="px-3 py-1 rounded-lg bg-gray-100 text-[10px] font-black text-gray-600">{report.type}</span>
                                            </td>
                                            <td className="py-5 text-center">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(report.date).toLocaleDateString()}</span>
                                            </td>
                                            <td className="py-5 text-right">
                                                <button className="p-2 hover:bg-black hover:text-white rounded-xl transition-all">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Budget Tracking Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Wallet className="w-5 h-5" /> Budget Tracking
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entertainment</span>
                                        <span className="text-[10px] font-black text-gray-900">$850 / $1,000</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-black" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shopping</span>
                                        <span className="text-[10px] font-black text-gray-900">$2,400 / $2,000</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-red-500" />
                                    </div>
                                    <p className="mt-1 text-[9px] font-bold text-red-500">Over budget by $400</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white">
                            <h3 className="text-lg font-black mb-6">Savings Goal</h3>
                            <div className="flex items-center gap-6">
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path className="text-white/10" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className="text-purple-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-xs">75%</div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tesla Model S</p>
                                    <p className="text-lg font-black">$75,000 / $100k</p>
                                    <button className="mt-2 text-[10px] font-black text-purple-500 hover:text-white transition-colors">CONTRIBUTE</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
