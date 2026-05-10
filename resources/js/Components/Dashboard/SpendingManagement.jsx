import { motion } from 'framer-motion';
import { ShoppingBag, Car, Home, Film, Utensils, Zap, Plus, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

const BudgetItem = ({ icon: Icon, name, spent, budget, color }) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    
    return (
        <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-50 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className={clsx("p-3 rounded-2xl text-white shadow-lg shadow-current/10", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <button className="text-gray-300 hover:text-black transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-black text-gray-900">{name}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Monthly Budget</p>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-xl font-black text-gray-900">${spent.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spent</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-sm font-black text-gray-900">${budget.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Limit</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={clsx("h-full rounded-full", percentage > 90 ? "bg-red-500" : "bg-black")}
                        />
                    </div>
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className={clsx(percentage > 90 ? "text-red-500" : "text-gray-400")}>
                            {percentage.toFixed(0)}% Consumed
                        </span>
                        <span className="text-gray-400">${(budget - spent).toLocaleString()} Left</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SpendingManagement() {
    const budgets = [
        { icon: Utensils, name: "Food & Dining", spent: 850, budget: 1200, color: "bg-orange-500" },
        { icon: Car, name: "Transport", spent: 320, budget: 500, color: "bg-blue-500" },
        { icon: Film, name: "Entertainment", spent: 450, budget: 400, color: "bg-purple-500" },
        { icon: Home, name: "Rent & Utilities", spent: 2100, budget: 2200, color: "bg-green-600" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">Pricing Management</h3>
                    <p className="text-sm text-gray-400 mt-1">Monitor your monthly activity budgets and spending limits.</p>
                </div>
                <button className="bg-black text-white p-3 rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget, idx) => (
                    <BudgetItem key={idx} {...budget} />
                ))}
            </div>
        </div>
    );
}
