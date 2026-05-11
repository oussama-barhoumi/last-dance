import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/Contexts/ThemeContext';

export default function BalanceHistoryChart() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const data = [
        { name: t('dashboard.months.jul'), value: 300 },
        { name: t('dashboard.months.aug'), value: 500 },
        { name: t('dashboard.months.sep'), value: 450 },
        { name: t('dashboard.months.oct'), value: 800 },
        { name: t('dashboard.months.nov'), value: 200 },
        { name: t('dashboard.months.dec'), value: 600 },
        { name: t('dashboard.months.jan'), value: 750 },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-zinc-800 transition-colors">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{t('dashboard.balance_history')}</h3>
                <button onClick={() => alert('Advanced chart settings coming soon!')} className="w-10 h-10 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl flex items-center justify-center hover:border-black dark:hover:border-white transition-colors text-gray-400 hover:text-black dark:hover:text-white">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" className="dark:stroke-zinc-800" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                            ticks={[0, 200, 400, 600, 800]}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: theme === 'dark' ? 'rgb(24 24 27)' : '#fff', 
                                border: theme === 'dark' ? '1px solid rgb(39 39 42)' : '1px solid rgb(243 244 246)', 
                                borderRadius: '16px',
                                color: theme === 'dark' ? '#fff' : '#000',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}
                            cursor={{ stroke: theme === 'dark' ? '#27272a' : '#f3f4f6', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8B5CF6" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, fill: '#8B5CF6' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
