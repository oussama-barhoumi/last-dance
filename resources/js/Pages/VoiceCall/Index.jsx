import { Head, router } from '@inertiajs/react';
import { 
    Mic, MicOff, PhoneOff, Volume2, 
    VolumeX, Sparkles, User, Bot, 
    ArrowLeft, MoreHorizontal, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function Index() {
    const [status, setStatus] = useState('idle'); // idle, listening, thinking, speaking
    const [isMuted, setIsMuted] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    
    const recognitionRef = useRef(null);
    const synthRef = window.speechSynthesis;
    const timerRef = useRef(null);

    // Call Timer
    useEffect(() => {
        if (status !== 'idle') {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setCallDuration(0);
        }
        return () => clearInterval(timerRef.current);
    }, [status]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Speech Recognition Setup
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                
                setTranscription(transcript);
                
                // If it's a final result, process it
                if (event.results[event.results.length - 1].isFinal) {
                    processVoiceCommand(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech Error:', event.error);
                if (event.error === 'no-speech' && status === 'listening') {
                    // Just restart if no speech detected
                    recognitionRef.current.stop();
                    setTimeout(() => recognitionRef.current.start(), 100);
                }
            };
        }
    }, [status]);

    const startCall = () => {
        setStatus('listening');
        recognitionRef.current?.start();
        speak("Harbor A I Assistant is active. How can I help you today?");
    };

    const endCall = () => {
        setStatus('idle');
        recognitionRef.current?.stop();
        synthRef.cancel();
        router.visit(route('dashboard'));
    };

    const processVoiceCommand = async (text) => {
        if (!text.trim() || status === 'thinking' || status === 'speaking') return;
        
        setStatus('thinking');
        recognitionRef.current?.stop();

        try {
            const response = await axios.post(route('voice-call.process'), { text });
            const botText = response.data.response;
            
            setAiResponse(botText);
            setTranscription('');
            speak(botText);
        } catch (error) {
            console.error('API Error:', error);
            speak("I'm sorry, I'm having trouble connecting.");
            setStatus('listening');
            recognitionRef.current?.start();
        }
    };

    const speak = (text) => {
        setStatus('speaking');
        synthRef.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            setStatus('listening');
            recognitionRef.current?.start();
        };

        // Preferred voice
        const voices = synthRef.getVoices();
        const voice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        if (voice) utterance.voice = voice;
        
        synthRef.speak(utterance);
    };

    return (
        <div className="fixed inset-0 bg-[#050505] text-white flex flex-col items-center justify-between py-16 px-8 z-[1000]">
            <Head title="Live Financial Call" />
            
            {/* Header */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full flex justify-between items-center max-w-lg"
            >
                <button onClick={endCall} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-400" />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Secure AI Line</span>
                    </div>
                    <span className="text-xl font-bold font-mono tracking-wider">{formatDuration(callDuration)}</span>
                </div>
                <button className="p-3 hover:bg-white/5 rounded-full transition-colors">
                    <Maximize2 className="w-5 h-5 text-gray-400" />
                </button>
            </motion.div>

            {/* Avatar & Waveform Area */}
            <div className="relative flex flex-col items-center justify-center">
                {/* Waveforms */}
                <AnimatePresence>
                    {(status === 'speaking' || status === 'listening') && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[1, 2, 3].map((i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ 
                                        scale: [0.8, 1.5 + (i * 0.2), 0.8],
                                        opacity: [0, 0.2 / i, 0]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        delay: i * 0.4,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute w-48 h-48 border border-blue-500/30 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* AI Avatar */}
                <motion.div 
                    layoutId="avatar"
                    className={clsx(
                        "w-48 h-48 rounded-[60px] flex items-center justify-center relative z-10 overflow-hidden group",
                        status === 'thinking' ? "animate-pulse bg-purple-500/10" : "bg-gradient-to-br from-blue-600 to-indigo-900 shadow-2xl shadow-blue-500/20"
                    )}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    {status === 'thinking' ? (
                        <Sparkles className="w-12 h-12 text-purple-400" />
                    ) : (
                        <Bot className="w-16 h-16 text-white" />
                    )}
                </motion.div>

                {/* Status Text */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 text-center"
                >
                    <h2 className="text-3xl font-black mb-2">HarborAI Assistant</h2>
                    <p className={clsx(
                        "text-xs font-black uppercase tracking-[0.3em] transition-colors",
                        status === 'listening' ? "text-green-500" : 
                        status === 'thinking' ? "text-purple-500" : 
                        status === 'speaking' ? "text-blue-500" : "text-gray-500"
                    )}>
                        {status === 'listening' ? "Listening..." : 
                         status === 'thinking' ? "Thinking..." : 
                         status === 'speaking' ? "Speaking..." : "Ready"}
                    </p>
                </motion.div>
            </div>

            {/* Transcription Subtitles */}
            <div className="w-full max-w-lg h-24 flex items-end justify-center px-4">
                <AnimatePresence mode="wait">
                    {transcription && (
                        <motion.p 
                            key="transcription"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm font-medium text-gray-400 text-center italic"
                        >
                            "{transcription}"
                        </motion.p>
                    )}
                    {!transcription && aiResponse && status === 'speaking' && (
                        <motion.p 
                            key="aiResponse"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-lg font-bold text-white text-center leading-relaxed"
                        >
                            {aiResponse}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md grid grid-cols-3 gap-8 items-center">
                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={clsx(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                            isMuted ? "bg-white/10 text-red-500" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        )}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                </div>
                <div className="flex justify-center">
                    {status === 'idle' ? (
                        <button 
                            onClick={startCall}
                            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95 transition-all"
                        >
                            <Volume2 className="w-8 h-8 text-white" />
                        </button>
                    ) : (
                        <button 
                            onClick={endCall}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95 transition-all"
                        >
                            <PhoneOff className="w-8 h-8 text-white" />
                        </button>
                    )}
                </div>
                <div className="flex justify-center">
                    <button className="w-16 h-16 bg-white/5 text-gray-400 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Floating Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: [0, 0.2, 0],
                            y: [0, -100],
                            x: [0, Math.random() * 50 - 25]
                        }}
                        transition={{ 
                            duration: 5 + Math.random() * 5, 
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute w-1 h-1 bg-blue-500 rounded-full"
                        style={{ 
                            left: `${Math.random() * 100}%`,
                            bottom: `${Math.random() * 50}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
