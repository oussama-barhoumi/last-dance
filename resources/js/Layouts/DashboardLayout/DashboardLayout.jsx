import Sidebar from './Sidebar';
import Header from './Header';
import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#FAF9F6] to-[#F3E8FF] font-sans selection:bg-purple-500 selection:text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="pl-[240px] relative">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <Header user={auth.user} />

                <main className="px-10 pb-12 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
