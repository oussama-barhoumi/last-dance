import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { 
    TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, 
    ArrowUpRight, ArrowDownLeft, Plus, Filter,
    Briefcase, Globe, Zap, History, ChevronRight,
    Search, AlertCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

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

const AssetCard = ({ asset }) => {
    const { t } = useTranslation();
    return (
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
                        {asset.type === 'stock' ? <Briefcase className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{asset.company_name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.symbol || asset.sector}</p>
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.holdings')}</p>
                        <p className="text-xl font-black text-gray-900">{parseFloat(asset.shares || 0).toFixed(4)} {t('investments.shares')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.value')}</p>
                        <p className="text-sm font-black text-gray-900">${parseFloat(asset.value).toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">{t('investments.buy_more')}</button>
                    <button className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">{t('investments.sell')}</button>
                </div>
            </div>
        </motion.div>
    );
};

const StockMarket = ({ userBalance }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shares, setShares] = useState(1);

    const suggestedStocks = [
        { name: 'Attijariwafa Bank', symbol: 'ATW.MA', price: '450.20', change: '+1.45%', up: true },
        { name: 'Maroc Telecom', symbol: 'IAM.MA', price: '102.50', change: '-0.32%', up: false },
        { name: 'OCP Group', symbol: 'OCP.MA', price: '2,840.00', change: '+2.10%', up: true },
        { name: 'Bank of Africa', symbol: 'BOA.MA', price: '185.00', change: '+0.15%', up: true },
        { name: 'TAQA Morocco', symbol: 'TQM.MA', price: '1,120.00', change: '-1.25%', up: false },
        { name: 'LabelVie', symbol: 'LBV.MA', price: '4,560.00', change: '+0.85%', up: true },
        { name: 'Cosumar', symbol: 'CSM.MA', price: '198.40', change: '-0.45%', up: false },
        { name: 'HPS', symbol: 'HPS.MA', price: '6,200.00', change: '+3.40%', up: true }
    ];

    const fetchQuote = async (symbol = search) => {
        if (!symbol) return;
        setLoading(true);
        try {
            const response = await fetch(`/stocks/${symbol}`);
            const data = await response.json();
            setQuote(data);
        } catch (error) {
            console.error('Error fetching quote:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestClick = (symbol) => {
        setSearch(symbol);
        fetchQuote(symbol);
    };

    const handleTrade = (type) => {
        if (!quote || !search) return;
        
        router.post(route(`trade.${type}`), {
            symbol: search.toUpperCase(),
            shares: shares,
            price: quote.c,
            company_name: search.toUpperCase() 
        });
    };

    return (
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Globe className="w-6 h-6 text-blue-500" /> {t('investments.stock_market')}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{t('investments.trading_terminal')}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t('investments.available_cash')}</span>
                        <span className="text-sm font-black text-gray-900">${parseFloat(userBalance).toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-8">
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchQuote()}
                                    placeholder={t('investments.search_placeholder')}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-black transition-all pl-14"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
                                <button 
                                    onClick={() => fetchQuote()}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    {loading ? '...' : t('investments.value')}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('investments.market_highlights')}</p>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar scroll-smooth">
                                    {suggestedStocks.map((stock) => (
                                        <button 
                                            key={stock.symbol}
                                            onClick={() => handleSuggestClick(stock.symbol)}
                                            className={clsx(
                                                "flex-shrink-0 w-48 p-4 rounded-3xl border transition-all flex items-center gap-3 text-left group",
                                                search === stock.symbol ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm",
                                                search === stock.symbol ? "bg-white/10" : "bg-gray-50"
                                            )}>
                                                {stock.symbol.substring(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-black uppercase tracking-widest block truncate">{stock.symbol}</span>
                                                    <span className={clsx(
                                                        "text-[9px] font-black",
                                                        stock.up ? "text-green-500" : "text-red-500"
                                                    )}>
                                                        {stock.change}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end mt-0.5">
                                                    <span className={clsx(
                                                        "text-[8px] font-bold uppercase tracking-tight truncate",
                                                        search === stock.symbol ? "text-gray-400" : "text-gray-400"
                                                    )}>{stock.name}</span>
                                                    <span className="text-[10px] font-black ml-auto">${stock.price}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {quote && quote.c > 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 rounded-[32px] p-6 border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.current_price')}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-gray-900">${quote.c}</span>
                                            <span className={clsx(
                                                "text-[10px] font-black",
                                                quote.dp >= 0 ? "text-green-500" : "text-red-500"
                                            )}>
                                                {quote.dp >= 0 ? '+' : ''}{quote.dp.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.asset')}</p>
                                        <span className="bg-white px-3 py-1 rounded-lg text-xs font-black border border-gray-200">{search}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('investments.high')}</p>
                                        <p className="text-xs font-black text-gray-900">${quote.h}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('investments.low')}</p>
                                        <p className="text-xs font-black text-gray-900">${quote.l}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t('investments.open')}</p>
                                        <p className="text-xs font-black text-gray-900">${quote.o}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('investments.shares_to_trade')}</label>
                                        <div className="flex items-center gap-4 bg-white rounded-xl p-1 border border-gray-200">
                                            <button onClick={() => setShares(Math.max(1, shares - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors font-black">-</button>
                                            <input 
                                                type="number" 
                                                value={shares} 
                                                onChange={(e) => setShares(parseFloat(e.target.value) || 0)}
                                                className="w-12 text-center border-none p-0 text-xs font-black focus:ring-0 bg-transparent"
                                            />
                                            <button onClick={() => setShares(shares + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors font-black">+</button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleTrade('buy')}
                                            className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                                        >
                                            {t('investments.confirm_buy')}
                                        </button>
                                        <button 
                                            onClick={() => handleTrade('sell')}
                                            className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                                        >
                                            {t('investments.confirm_sell')}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-gray-400 text-center font-bold">
                                        {t('investments.estimated_total')}: <span className="text-gray-900">${(shares * quote.c).toLocaleString()}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ) : search && !loading && (
                            <div className="py-12 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('investments.search_placeholder')}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-purple-600 p-8 rounded-[32px] text-white shadow-xl shadow-purple-600/20">
                            <h4 className="text-lg font-black mb-4">{t('investments.trading_tips')}</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">1</div>
                                    <p className="text-[11px] font-medium leading-relaxed opacity-90">{t('investments.tip1')}</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">2</div>
                                    <p className="text-[11px] font-medium leading-relaxed opacity-90">{t('investments.tip2')}</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">3</div>
                                    <p className="text-[11px] font-medium leading-relaxed opacity-90">{t('investments.tip3')}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-[32px] border border-gray-100 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('investments.market_status')}</h4>
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {t('investments.market_open')}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                                {t('investments.market_active_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, investments, stats, recentTransactions }) {
    const { t } = useTranslation();
    const pieData = investments.reduce((acc, inv) => {
        const category = inv.type === 'stock' ? 'Stocks' : (inv.category || 'Other');
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += parseFloat(inv.value);
        } else {
            acc.push({ name: category, value: parseFloat(inv.value) });
        }
        return acc;
    }, []);

    return (
        <DashboardLayout>
            <Head title={`${t('investments.title')} - HarborBank`} />

            <div className="space-y-8 mt-8">
                {/* Header Stats */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">{t('investments.title')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{t('investments.desc')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-400 hover:text-black transition-colors shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-black/10">
                            <Plus className="w-5 h-5" /> {t('investments.new_investment')}
                        </button>
                    </div>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#0A0A0A] p-8 rounded-[40px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">{t('investments.total_value')}</p>
                        <p className="text-3xl font-black relative z-10">${stats.totalValue.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-1 text-green-400 font-bold text-[10px] relative z-10">
                            <ArrowUpRight className="w-3 h-3" /> +12.4% this month
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.total_profit')}</p>
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('investments.active_assets')}</p>
                        <p className="text-3xl font-black text-gray-900">{investments.length}</p>
                        <div className="mt-4 flex -space-x-2">
                            {investments.map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#FAF9F6] p-8 rounded-[40px] border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('investments.monthly_earning')}</p>
                            <Info className="w-4 h-4 text-gray-300" />
                        </div>
                        <p className="text-3xl font-black text-gray-900">$2,450.00</p>
                        <span className="text-[10px] font-bold text-gray-400">{t('investments.payout_desc', { days: 12 })}</span>
                    </div>
                </div>

                {/* Stock Market Section */}
                <StockMarket userBalance={auth.user.balance} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6" /> {t('investments.performance')}
                            </h3>
                            <div className="flex bg-gray-50 p-1 rounded-xl">
                                <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">{t('investments.value')}</button>
                                <button className="px-4 py-1.5 text-gray-400 text-xs font-bold">{t('investments.return')}</button>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Allocation Chart */}
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <PieIcon className="w-6 h-6" /> {t('investments.allocation')}
                        </h3>
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="h-[200px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                                        <span className="text-[10px] font-black text-gray-900 ml-auto">{stats.totalValue > 0 ? ((data.value / stats.totalValue) * 100).toFixed(0) : 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assets Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-gray-900">{t('investments.your_assets')}</h3>
                        <button className="text-sm font-bold text-gray-400 hover:text-black transition-colors">{t('investments.view_all_assets')}</button>
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
                                <History className="w-6 h-6" /> {t('investments.history')}
                            </h3>
                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('investments.asset')}</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{t('accounts.type')}</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{t('investments.amount')}</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t('investments.date')}</th>
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
                                                    tx.type === 'credit' ? "text-green-500" : "text-gray-900"
                                                )}>
                                                    {tx.type === 'credit' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(tx.transaction_date).toLocaleDateString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] p-10 rounded-[40px] text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-black mb-6">{t('investments.market_overview')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-400" />
                                        <span className="text-xs font-bold">{t('investments.global_stocks')}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-green-400">+2.45%</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        <span className="text-xs font-bold">{t('investments.crypto_index')}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-red-400">-1.12%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-10 p-6 rounded-3xl bg-purple-600 shadow-xl shadow-purple-600/20">
                            <p className="text-xs font-black uppercase tracking-widest mb-2">{t('investments.pro_insights')}</p>
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
