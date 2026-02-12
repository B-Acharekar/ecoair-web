"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ChatInterface } from "./ChatInterface";

export function AssistantOrb() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            className="relative w-16 h-16 rounded-full flex items-center justify-center bg-transparent focus:outline-none group"
                        >
                            {/* Orb Core */}
                            <div className="absolute inset-0 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_var(--primary)] animate-pulse-glow" />

                            {/* Inner Swirls */}
                            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-80 blur-sm animate-[spin_4s_linear_infinite]" />

                            {/* Icon */}
                            <Sparkles className="relative z-10 w-6 h-6 text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] group-hover:rotate-12 transition-transform duration-300" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <ChatInterface onClose={() => setIsOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
