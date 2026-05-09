import { Search, Bell, ChevronDown } from 'lucide-react';

export default function Header({ user }) {
    return (
        <header className="sticky top-0 z-40 bg-transparent/50 backdrop-blur-sm px-10 py-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 text-gray-500">
                    <button className="hover:text-black transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="relative hover:text-black transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                </div>

                <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                    <div className="bg-white rounded-[15px] px-6 py-2.5 flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">My Balance</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900 leading-none">
                                    ${parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">USD</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
