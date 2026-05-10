import Sidebar from './Sidebar';
import Header from './Header';
import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#FAF9F6] dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 selection:bg-purple-500 selection:text-white transition-colors duration-500">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="pl-[240px] relative">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <Header user={auth.user} />

                <main className="px-10 pb-12 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
