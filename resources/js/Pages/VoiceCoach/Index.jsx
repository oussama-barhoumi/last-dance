import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Mic, Send, User, Bot, Sparkles, 
    ArrowLeft, MoreHorizontal, ShoppingBag, 
    TrendingDown, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function Index({ financialData, initialMessage }) {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: initialMessage }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const response = await axios.post(route('voice-coach.ask'), {
                question: input
            });
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: response.data.response
            }]);
        } catch (error) {
            console.error('Error asking coach:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "I'm sorry, I'm having a little trouble connecting right now. Can you try asking me again in a moment?"
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <DashboardLayout>
            <Head title="Voice Financial Coach - HarborBank" />

            <div className="max-w-4xl mx-auto h-[85vh] flex flex-col py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Voice Coach</h2>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Analysis Active
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Chat Container */}
                <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar pb-10">
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={clsx(
                                    "flex items-start gap-4 max-w-[80%]",
                                    msg.type === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                    msg.type === 'user' ? "bg-gray-900" : "bg-red-500"
                                )}>
                                    {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>
                                <div className={clsx(
                                    "p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                                    msg.type === 'user' 
                                        ? "bg-black text-white rounded-tr-none" 
                                        : "bg-white text-gray-800 border border-gray-50 rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {isThinking && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-4 mr-auto"
                            >
                                <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-5 bg-white border border-gray-50 rounded-3xl rounded-tl-none flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="mt-6 px-4">
                    <form onSubmit={handleSend} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
                        <div className="relative bg-white border border-gray-100 rounded-[28px] p-2 flex items-center gap-2 shadow-xl shadow-black/5">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-focus-within:text-red-500 transition-colors">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your spending, saving, or credit..."
                                className="flex-1 border-none focus:ring-0 text-sm font-bold placeholder:text-gray-300 bg-transparent"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isThinking}
                                className="bg-black text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 flex justify-center gap-6">
                        <button onClick={() => setInput('How much did I spend this month?')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Spending Stats</button>
                        <button onClick={() => setInput('How can I save more?')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Saving Plan</button>
                        <button onClick={() => setInput('Can I take a credit?')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">Credit Check</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
