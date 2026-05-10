import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Car, Home, Film, Utensils, Zap, Plus, MoreHorizontal, X, Wallet, Tag, Smartphone, Heart } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const BudgetItem = ({ icon: Icon, name, spent, budget, color }) => {
    const percentage = Math.min((spent / budget) * 100, 100);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-50 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
        >
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
        </motion.div>
    );
};

export default function SpendingManagement() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [budgets, setBudgets] = useState([
        { icon: Utensils, name: "Food & Dining", spent: 850, budget: 1200, color: "bg-orange-500" },
        { icon: Car, name: "Transport", spent: 320, budget: 500, color: "bg-blue-500" },
        { icon: Film, name: "Entertainment", spent: 450, budget: 400, color: "bg-purple-500" },
        { icon: Home, name: "Rent & Utilities", spent: 2100, budget: 2200, color: "bg-green-600" },
    ]);

    const [newActivity, setNewActivity] = useState({
        name: '',
        budget: '',
        category: 'Shopping'
    });

    const categories = [
        { name: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500' },
        { name: 'Services', icon: Zap, color: 'bg-yellow-500' },
        { name: 'Tech', icon: Smartphone, color: 'bg-gray-900' },
        { name: 'Health', icon: Heart, color: 'bg-red-500' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedCat = categories.find(c => c.name === newActivity.category);
        setBudgets([...budgets, {
            name: newActivity.name,
            spent: 0,
            budget: Number(newActivity.budget),
            icon: selectedCat.icon,
            color: selectedCat.color
        }]);
        setShowAddModal(false);
        setNewActivity({ name: '', budget: '', category: 'Shopping' });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-gray-900">Pricing Management</h3>
                    <p className="text-sm text-gray-400 mt-1">Monitor your monthly activity budgets and spending limits.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-black text-white p-3 rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget, idx) => (
                    <BudgetItem key={idx} {...budget} />
                ))}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900">Add New Activity</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Activity Name</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            required
                                            value={newActivity.name}
                                            onChange={e => setNewActivity({...newActivity, name: e.target.value})}
                                            placeholder="e.g. Weekly Groceries"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all pl-12"
                                        />
                                        <Tag className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Monthly Budget ($)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            required
                                            value={newActivity.budget}
                                            onChange={e => setNewActivity({...newActivity, budget: e.target.value})}
                                            placeholder="0.00"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all pl-12"
                                        />
                                        <Wallet className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category & Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map((cat) => (
                                            <button 
                                                key={cat.name}
                                                type="button"
                                                onClick={() => setNewActivity({...newActivity, category: cat.name})}
                                                className={clsx(
                                                    "p-4 rounded-2xl border-2 transition-all flex items-center gap-3",
                                                    newActivity.category === cat.name ? "border-black bg-black/5" : "border-gray-50 bg-gray-50/50"
                                                )}
                                            >
                                                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white", cat.color)}>
                                                    <cat.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 mt-4"
                                >
                                    Create Budget Activity
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
