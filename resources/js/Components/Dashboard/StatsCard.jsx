import { Banknote, PieChart } from 'lucide-react';

export default function StatsCard({ type, label, value, dark }) {
    const Icon = type === 'spending' ? Banknote : PieChart;
    
    return (
        <div className={`flex items-center gap-6 p-6 rounded-[32px] shadow-sm transition-transform hover:scale-[1.02] ${
            dark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'
        }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                dark ? 'bg-white/10' : 'bg-gray-100'
            }`}>
                <Icon className={`w-8 h-8 ${dark ? 'text-white' : 'text-gray-900'}`} />
            </div>
            <div>
                <p className={`text-sm font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                <p className="text-3xl font-black tracking-tight">{value}</p>
            </div>
        </div>
    );
}
