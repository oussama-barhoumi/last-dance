import DashboardLayout from '@/Layouts/DashboardLayout/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Mic, Send, User, Bot, Sparkles, 
    ArrowLeft, MoreHorizontal, ShoppingBag, 
    TrendingDown, Info, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export default function Index({ financialData, initialMessage }) {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: initialMessage }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, [i18n.language]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            setInput('');
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const speak = (text) => {
        if (isMuted || !window.speechSynthesis) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            (i18n.language === 'fr' && v.lang.includes('fr')) ||
            (i18n.language === 'ar' && v.lang.includes('ar')) ||
            (i18n.language === 'en' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    useEffect(() => {
        const timer = setTimeout(() => speak(initialMessage), 1000);
        return () => {
            clearTimeout(timer);
            window.speechSynthesis?.cancel();
        };
    }, []);

    const handleSend = async (e) => {
        const textToSend = typeof e === 'string' ? e : input;
        if (e && e.preventDefault) e.preventDefault();
        if (!textToSend.trim() || isThinking) return;

        const userMsg = { id: Date.now(), type: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const response = await axios.post(route('voice-coach.ask'), {
                question: textToSend
            });
            
            const botText = response.data.response;
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: botText
            }]);
            
            speak(botText);
        } catch (error) {
            console.error('Error asking coach:', error);
            const errorText = t('voice_coach.error_connecting');
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: errorText
            }]);
            speak(errorText);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <DashboardLayout>
            <Head title={`${t('voice_coach.title')} - HarborBank`} />

            <div className="max-w-4xl mx-auto h-[85vh] flex flex-col py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <motion.div 
                            animate={isRecording ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 1 }}
                            onClick={toggleRecording}
                            className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all cursor-pointer",
                                isRecording ? "bg-red-600 shadow-red-600/40" : "bg-red-500 shadow-red-500/20"
                            )}
                        >
                            <Mic className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">{t('voice_coach.title')}</h2>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                                <span className={clsx("w-1.5 h-1.5 rounded-full", isRecording ? "bg-red-500 animate-ping" : "bg-green-500 animate-pulse")} /> 
                                {isRecording ? t('voice_coach.listening') : t('voice_coach.live_active')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => router.visit(route('voice-call.index'))}
                            className="bg-black text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                        >
                            <Volume2 className="w-4 h-4" /> {t('voice_coach.start_ai_call')}
                        </button>
                        <button 
                            onClick={() => {
                                if (!isMuted) window.speechSynthesis.cancel();
                                setIsMuted(!isMuted);
                            }}
                            className={clsx(
                                "p-3 rounded-xl transition-all",
                                isMuted ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-500 shadow-sm"
                            )}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
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
                            <button 
                                type="button"
                                onClick={toggleRecording}
                                className={clsx(
                                    "p-3 rounded-2xl transition-colors",
                                    isRecording ? "bg-red-500 text-white" : "bg-gray-50 text-gray-400 hover:text-red-500"
                                )}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isRecording ? t('voice_coach.listening_placeholder') : t('voice_coach.placeholder')}
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
                        <button onClick={() => handleSend(t('voice_coach.prompt_spending'))} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">{t('voice_coach.spending_stats')}</button>
                        <button onClick={() => handleSend(t('voice_coach.prompt_saving'))} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">{t('voice_coach.saving_plan')}</button>
                        <button onClick={() => handleSend(t('voice_coach.prompt_credit'))} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">{t('voice_coach.credit_check')}</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
