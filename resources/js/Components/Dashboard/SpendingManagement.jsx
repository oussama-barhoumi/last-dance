import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Car, Home, Film, Utensils, Zap, Plus, MoreHorizontal, X, Wallet, Tag, Smartphone, Heart, Trash2, Info } from 'lucide-react';
import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import clsx from 'clsx';

const iconMap = {
    ShoppingBag, Car, Home, Film, Utensils, Zap, Smartphone, Heart
};

const BudgetItem = ({ icon, name, spent, budget, color, onDelete }) => {
    const Icon = iconMap[icon] || Tag;
    const percentage = Math.min((spent / budget) * 100, 100);
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-50 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={clsx("p-3 rounded-2xl text-white shadow-lg shadow-current/10", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={onDelete}
                        className="p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-300 hover:text-black transition-colors bg-white/50 p-2 rounded-xl">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-black text-gray-900">{name}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Monthly Budget</p>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-xl font-black text-gray-900">${Number(spent).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spent</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-sm font-black text-gray-900">${Number(budget).toLocaleString()}</p>
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
    const { budgets } = usePage().props;
    const [showAddModal, setShowAddModal] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        amount: '',
        category: 'Shopping',
        icon: 'ShoppingBag',
        color: 'bg-pink-500'
    });

    const categories = [
        { name: 'Shopping', iconName: 'ShoppingBag', icon: ShoppingBag, color: 'bg-pink-500' },
        { name: 'Services', iconName: 'Zap', icon: Zap, color: 'bg-yellow-500' },
        { name: 'Tech', iconName: 'Smartphone', icon: Smartphone, color: 'bg-gray-900' },
        { name: 'Health', iconName: 'Heart', icon: Heart, color: 'bg-red-500' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('budgets.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this activity?')) {
            router.delete(route('budgets.destroy', id));
        }
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
                <AnimatePresence mode="popLayout">
                    {budgets.map((budget) => (
                        <BudgetItem 
                            key={budget.id} 
                            name={budget.name}
                            spent={0} // To be linked with transaction aggregation later
                            budget={budget.amount}
                            icon={budget.icon}
                            color={budget.color}
                            onDelete={() => handleDelete(budget.id)}
                        />
                    ))}
                </AnimatePresence>
                {budgets.length === 0 && (
                    <div className="col-span-full py-12 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-50 p-4 rounded-2xl mb-4 text-gray-400">
                            <Tag className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900">No active budgets</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Start by creating your first spending limit</p>
                    </div>
                )}
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
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="e.g. Weekly Groceries"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all pl-12"
                                        />
                                        <Tag className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Monthly Budget ($)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            required
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all pl-12"
                                        />
                                        <Wallet className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.amount && <p className="text-[10px] text-red-500 mt-1">{errors.amount}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category & Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map((cat) => (
                                            <button 
                                                key={cat.name}
                                                type="button"
                                                onClick={() => setData({
                                                    ...data,
                                                    category: cat.name,
                                                    icon: cat.iconName,
                                                    color: cat.color
                                                })}
                                                className={clsx(
                                                    "p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left",
                                                    data.category === cat.name ? "border-black bg-black/5" : "border-gray-50 bg-gray-50/50"
                                                )}
                                            >
                                                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0", cat.color)}>
                                                    <cat.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 mt-4 disabled:opacity-50"
                                >
                                    {processing ? 'Creating Activity...' : 'Create Budget Activity'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
