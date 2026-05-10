import { Banknote, PieChart } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';
import clsx from 'clsx';

export default function StatsCard({ type, label, value, dark: darkOverride }) {
    const { theme } = useTheme();
    const isDark = darkOverride || theme === 'dark';
    const Icon = type === 'spending' ? Banknote : PieChart;
    
    return (
        <div className={clsx(
            "flex items-center gap-6 p-6 rounded-[32px] shadow-sm transition-all hover:scale-[1.02] border",
            isDark ? "border-zinc-800 bg-zinc-900 text-white" : "border-gray-50 bg-white text-gray-900"
        )}>
            <div className={clsx("w-16 h-16 rounded-full flex items-center justify-center", isDark ? "bg-zinc-800" : "bg-gray-100")}>
                <Icon className={clsx("w-8 h-8", isDark ? "text-zinc-100" : "text-gray-900")} />
            </div>
            <div>
                <p className={clsx("text-sm font-medium mb-1", isDark ? "text-zinc-400" : "text-gray-500")}>{label}</p>
                <p className="text-3xl font-black tracking-tight">{value}</p>
            </div>
        </div>
    );
}
