import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import StatsCard from '@/Components/Dashboard/StatsCard';
import BalanceHistoryChart from '@/Components/Dashboard/BalanceHistoryChart';
import RecentTransactions from '@/Components/Dashboard/RecentTransactions';
import QuickTransfer from '@/Components/Dashboard/QuickTransfer';
import InvestmentList from '@/Components/Dashboard/InvestmentList';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard - HarborBank" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10 mt-8"
            >
                {/* Row 1: Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={item} className="lg:col-span-1">
                        <StatsCard 
                            type="spending" 
                            label="Spending in Jul" 
                            value="1,250" 
                        />
                    </motion.div>
                    <motion.div variants={item} className="lg:col-span-1">
                        <StatsCard 
                            type="investment" 
                            label="Number of Invest" 
                            value="1,250" 
                            dark 
                        />
                    </motion.div>
                    {/* Placeholder for future stats */}
                    <div className="hidden lg:block lg:col-span-2" />
                </div>

                {/* Row 2: Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Balance History */}
                    <motion.div variants={item} className="lg:col-span-2">
                        <BalanceHistoryChart />
                        <div className="mt-10">
                            <InvestmentList />
                        </div>
                    </motion.div>

                    {/* Right: Side Panel */}
                    <motion.div variants={item} className="space-y-10">
                        <RecentTransactions />
                        <QuickTransfer />
                    </motion.div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
