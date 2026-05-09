import { Link } from '@inertiajs/react';
import { 
    LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, BarChart, 
    TrendingUp, Settings, LogOut, Globe, Anchor, ChevronDown 
} from 'lucide-react';
import { motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, active, badge, badgeColor }) => (
    <Link 
        href="#" 
        className={`flex items-center justify-between px-6 py-3 transition-all group ${
            active ? 'text-white border-l-4 border-purple-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
                {badge}
            </span>
        )}
    </Link>
);

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0A0A0A] flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
                <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-xl">
                    <Anchor className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">DoodlyBank</span>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto pt-4">
                <div className="px-6 mb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Navigation</span>
                </div>
                <nav className="space-y-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={ArrowLeftRight} label="Transactions" />
                    <NavItem icon={CreditCard} label="Accounts" />
                    <NavItem icon={CreditCard} label="Cards" badge="3" badgeColor="bg-[#8B5CF6]" />
                    <NavItem icon={Wallet} label="Investment" badge="14" badgeColor="bg-[#10B981]" />
                    <NavItem icon={BarChart} label="Reports" />
                    <NavItem icon={TrendingUp} label="Loan" />
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-6 mt-auto">
                <div className="bg-[#1F2937] rounded-full p-2 flex items-center justify-between mb-6">
                    <img 
                        src="https://ui-avatars.com/api/?name=John+Doe&background=8B5CF6&color=fff" 
                        alt="User" 
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="flex gap-2 pr-2">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs mb-6 px-2 hover:text-white cursor-pointer transition-colors">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                    <ChevronDown className="w-3 h-3 ml-auto" />
                </div>

                <div className="flex gap-4 px-2">
                    <Link href="#" className="text-[10px] text-gray-600 hover:text-gray-400">Privacy Policy</Link>
                    <Link href="#" className="text-[10px] text-gray-600 hover:text-gray-400">License</Link>
                    <Link href="#" className="text-[10px] text-gray-600 hover:text-gray-400">API</Link>
                </div>
            </div>
        </aside>
    );
}
