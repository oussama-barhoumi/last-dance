import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BalanceHistoryChart() {
    const { t } = useTranslation();

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
        <div className="bg-white p-8 rounded-[40px] shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-gray-900">{t('dashboard.balance_history')}</h3>
                <button className="w-10 h-10 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center hover:border-black transition-colors text-gray-400 hover:text-black">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
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
                                backgroundColor: '#000', 
                                border: 'none', 
                                borderRadius: '12px',
                                color: '#fff' 
                            }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#000" 
                            strokeWidth={4} 
                            dot={false}
                            activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, fill: '#000' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
