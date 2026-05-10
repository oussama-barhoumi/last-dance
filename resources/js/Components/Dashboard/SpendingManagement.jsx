import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, Car, Home, Film, Utensils, Zap, Plus, 
    MoreHorizontal, X, Wallet, Tag, Smartphone, Heart, 
    Trash2, Info, CheckCircle2, Sparkles 
} from 'lucide-react';
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
    const [showAiPlanner, setShowAiPlanner] = useState(false);
    const [salary, setSalary] = useState('');
    const [isAutoMatched, setIsAutoMatched] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        amount: '',
        category: 'Shopping',
        icon: 'ShoppingBag',
        color: 'bg-pink-500'
    });

    const handleAiPlan = () => {
        if (!salary || isNaN(salary)) return;
        
        const sal = parseFloat(salary);
        const plan = [
            { name: 'Housing & Utilities', amount: sal * 0.35, category: 'Home', icon: 'Home', color: 'bg-green-600' },
            { name: 'Groceries & Dining', amount: sal * 0.15, category: 'Dining', icon: 'Utensils', color: 'bg-orange-500' },
            { name: 'Shopping & Style', amount: sal * 0.10, category: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500' },
            { name: 'Savings & Growth', amount: sal * 0.20, category: 'Tech', icon: 'Smartphone', color: 'bg-gray-900' },
            { name: 'Health & Wellness', amount: sal * 0.10, category: 'Health', icon: 'Heart', color: 'bg-red-500' },
            { name: 'Fun & Entertainment', amount: sal * 0.10, category: 'Entertainment', icon: 'Film', color: 'bg-purple-500' },
        ];

        router.post(route('budgets.bulk-store'), { budgets: plan }, {
            onSuccess: () => {
                setShowAiPlanner(false);
                setSalary('');
            }
        });
    };

    const categories = [
        { name: 'Shopping', iconName: 'ShoppingBag', icon: ShoppingBag, color: 'bg-pink-500', keywords: ['shop', 'clothes', 'zara', 'amazon', 'mall', 'gift'] },
        { name: 'Dining', iconName: 'Utensils', icon: Utensils, color: 'bg-orange-500', keywords: ['food', 'restaurant', 'pizza', 'burger', 'cafe', 'coffee', 'starbucks', 'dinner', 'lunch'] },
        { name: 'Travel', iconName: 'Car', icon: Car, color: 'bg-blue-500', keywords: ['uber', 'bolt', 'flight', 'trip', 'hotel', 'taxi', 'gas', 'car', 'travel'] },
        { name: 'Home', iconName: 'Home', icon: Home, color: 'bg-green-600', keywords: ['rent', 'furniture', 'ikea', 'house', 'cleaning', 'repair'] },
        { name: 'Bills', iconName: 'Zap', icon: Zap, color: 'bg-yellow-500', keywords: ['electricity', 'water', 'internet', 'bill', 'phone', 'subscription', 'netflix'] },
        { name: 'Tech', iconName: 'Smartphone', icon: Smartphone, color: 'bg-gray-900', keywords: ['apple', 'phone', 'software', 'laptop', 'gadget', 'digital'] },
        { name: 'Health', iconName: 'Heart', icon: Heart, color: 'bg-red-500', keywords: ['doctor', 'pharmacy', 'medicine', 'hospital', 'clinic', 'workout', 'gym', 'fitness'] },
        { name: 'Entertainment', iconName: 'Film', icon: Film, color: 'bg-purple-500', keywords: ['movie', 'cinema', 'game', 'spotify', 'netflix', 'fun'] }
    ];

    const handleNameChange = (val) => {
        setData('name', val);
        
        // Auto-select category based on keywords
        const lowerVal = val.toLowerCase();
        const matchedCat = categories.find(cat => 
            cat.keywords.some(keyword => lowerVal.includes(keyword))
        );

        if (matchedCat) {
            setData(d => ({
                ...d,
                name: val,
                category: matchedCat.name,
                icon: matchedCat.iconName,
                color: matchedCat.color
            }));
            setIsAutoMatched(true);
        } else {
            setIsAutoMatched(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('budgets.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                setIsAutoMatched(false);
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
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAiPlanner(true)}
                        className="bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-purple-600/20 hover:scale-105 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Sparkles className="w-4 h-4" /> AI Planner
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-black text-white p-3 rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {budgets.map((budget) => (
                        <BudgetItem 
                            key={budget.id} 
                            name={budget.name}
                            spent={0} 
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
                                            onChange={e => handleNameChange(e.target.value)}
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
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {isAutoMatched ? 'Detected Category' : 'Select Category & Theme'}
                                        </label>
                                        {(isAutoMatched || data.name.length > 0) && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setData('name', '');
                                                    setIsAutoMatched(false);
                                                }}
                                                className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {categories
                                                .filter(cat => {
                                                    if (!isAutoMatched) return true;
                                                    return cat.name === data.category;
                                                })
                                                .map((cat) => (
                                                    <motion.button 
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        key={cat.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setData({
                                                                ...data,
                                                                category: cat.name,
                                                                icon: cat.iconName,
                                                                color: cat.color
                                                            });
                                                            setIsAutoMatched(false);
                                                        }}
                                                        className={clsx(
                                                            "p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left",
                                                            data.category === cat.name ? "border-black bg-black/5" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0", cat.color)}>
                                                                <cat.icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-black uppercase tracking-widest leading-tight block">{cat.name}</span>
                                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                                    {isAutoMatched && data.category === cat.name ? 'Recommended Theme' : 'Theme Active'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={clsx(
                                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                            data.category === cat.name ? "border-black bg-black text-white" : "border-gray-200"
                                                        )}>
                                                            {data.category === cat.name && <CheckCircle2 className="w-3 h-3" />}
                                                        </div>
                                                    </motion.button>
                                                ))}
                                        </AnimatePresence>
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
            <AnimatePresence>
                {showAiPlanner && (
                    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAiPlanner(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-purple-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">AI Budget Planner</h3>
                                </div>
                                <button onClick={() => setShowAiPlanner(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Monthly Salary ($)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={salary}
                                            onChange={e => setSalary(e.target.value)}
                                            placeholder="Enter your monthly income..."
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 transition-all pl-12"
                                        />
                                        <Wallet className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold italic px-1">We will use this to calculate an optimal 50/30/20 plan.</p>
                                </div>

                                {salary > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Planned Allocation</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-600">Needs (50%)</span>
                                                    <span className="text-black">${(salary * 0.5).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-600">Wants (30%)</span>
                                                    <span className="text-black">${(salary * 0.3).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-600">Savings (20%)</span>
                                                    <span className="text-black text-green-600">${(salary * 0.2).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <button 
                                    onClick={handleAiPlan}
                                    disabled={!salary || salary <= 0}
                                    className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-600/20 mt-4 disabled:opacity-50"
                                >
                                    Generate & Apply Plan
                                </button>
                                <p className="text-[8px] text-gray-400 text-center font-black uppercase tracking-[0.2em]">Note: This will overwrite your current activity limits</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
