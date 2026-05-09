import { Send, Plus } from 'lucide-react';

export default function QuickTransfer() {
    const avatars = [
        "https://ui-avatars.com/api/?name=Alex&background=random",
        "https://ui-avatars.com/api/?name=Sarah&background=random",
        "https://ui-avatars.com/api/?name=Mike&background=random",
    ];

    return (
        <div className="bg-[#0A0A0A] p-8 rounded-[40px] shadow-sm text-white">
            <h3 className="text-xl font-bold mb-8">Quick Transfer</h3>

            <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Write Amount -&gt;</span>
                <div className="bg-[#10B981] px-5 py-2 rounded-full">
                    <span className="text-sm font-black">$152.00</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {avatars.map((url, i) => (
                            <img 
                                key={i} 
                                src={url} 
                                alt="avatar" 
                                className="w-10 h-10 rounded-full border-4 border-[#0A0A0A]"
                            />
                        ))}
                        <div className="w-10 h-10 rounded-full border-4 border-[#0A0A0A] bg-zinc-800 flex items-center justify-center text-[10px] font-black">
                            8+
                        </div>
                    </div>
                    <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors ml-2">
                        Add New
                    </button>
                </div>

                <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-white/10">
                    <Send className="w-6 h-6 text-black" />
                </button>
            </div>
        </div>
    );
}
