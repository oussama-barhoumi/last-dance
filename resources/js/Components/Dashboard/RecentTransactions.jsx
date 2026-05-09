import { MoreHorizontal, Plus, Send, ShoppingBag, Wrench, Wallet2, TrendingUp } from 'lucide-react';
import { Link } from '@inertiajs/react';

const TransactionItem = ({ icon: Icon, title, category, amount, color, isNegative }) => (
    <div className="flex items-center justify-between py-4 group">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">{title}</p>
                <p className="text-xs text-gray-400 font-medium">{category}</p>
            </div>
        </div>
        <p className={`font-black text-sm ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            {isNegative ? '-' : '+'}${Math.abs(amount).toLocaleString()}
        </p>
    </div>
);

export default function RecentTransactions() {
    return (
        <div className="bg-white p-8 rounded-[40px] shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-gray-400 hover:text-black transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <button className="w-full bg-[#0A0A0A] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm mb-10 hover:scale-[1.01] transition-transform">
                <div className="w-6 h-6 border border-dashed border-white/30 rounded-md flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                </div>
                Payment / Send Money
            </button>

            {/* Expense Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Expense</h4>
                    <Link href="#" className="text-xs font-bold text-gray-400 hover:text-black transition-colors underline decoration-gray-200">See all</Link>
                </div>
                <div className="space-y-2">
                    <TransactionItem 
                        icon={ShoppingBag} 
                        title="Spotify Subscription" 
                        category="Shopping" 
                        amount={25} 
                        color="bg-purple-500" 
                        isNegative 
                    />
                    <TransactionItem 
                        icon={Wrench} 
                        title="Mobile Service" 
                        category="Repair and Servicing" 
                        amount={150} 
                        color="bg-green-500" 
                        isNegative 
                    />
                    <TransactionItem 
                        icon={Send} 
                        title="Wilson" 
                        category="Send Money" 
                        amount={1330} 
                        color="bg-yellow-500" 
                        isNegative 
                    />
                </div>
            </div>

            {/* Receive Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Receive</h4>
                        <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-[10px] font-black">27</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <TransactionItem 
                        icon={TrendingUp} 
                        title="Freepik" 
                        category="Service Selling" 
                        amount={150} 
                        color="bg-pink-500" 
                    />
                    <TransactionItem 
                        icon={Wallet2} 
                        title="Emilly" 
                        category="Transfer" 
                        amount={1330} 
                        color="bg-purple-500" 
                    />
                </div>
            </div>
        </div>
    );
}
