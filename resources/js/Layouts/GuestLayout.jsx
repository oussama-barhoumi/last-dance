import { Link } from '@inertiajs/react';
import { Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-950 relative overflow-hidden font-sans">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" 
                />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-white/10">
                            <Anchor className="w-8 h-8 text-blue-950" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">HarborBank</span>
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl"
                >
                    {children}
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-blue-300 text-xs font-medium uppercase tracking-[0.2em]">
                        Secure Financial Gateway
                    </p>
                </div>
            </div>
        </div>
    );
}
