"use client";

import { motion } from "framer-motion";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState, useRef, useEffect } from "react";

interface ChatInterfaceProps {
    onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hello! I'm EcoAI. How can I help improve your air quality today?" }
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages = [...messages, { role: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        // Mock response
        setTimeout(() => {
            let response = "I'm analyzing the sensor data... Air quality is stable.";
            if (input.toLowerCase().includes("aqi")) {
                response = "Current AQI is 50, which is good. You can keep windows open.";
            } else if (input.toLowerCase().includes("pollutant") || input.toLowerCase().includes("gas")) {
                response = "CO2 levels are slightly elevated but within safe limits.";
            }
            setMessages(prev => [...prev, { role: "assistant", text: response }]);
        }, 1000);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[350px] md:w-[400px] h-[500px]"
        >
            <GlassCard className="h-full flex flex-col overflow-hidden border-primary/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" intensity="high">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_var(--primary)] border border-white/20">
                            <Bot className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-display font-medium text-white flex items-center gap-2">
                                Eco Assistant
                                <Sparkles className="w-3 h-3 text-secondary" />
                            </h3>
                            <p className="text-[10px] text-primary uppercase tracking-widest animate-pulse">System Online</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-primary/20 text-white border border-primary/20 rounded-br-sm shadow-[0_0_10px_rgba(0,255,157,0.1)]"
                                    : "bg-white/10 text-white/90 border border-white/5 rounded-bl-sm backdrop-blur-sm"
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about air quality..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all placeholder:text-white/30"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2.5 bg-primary text-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
