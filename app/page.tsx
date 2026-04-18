"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AssistantOrb } from "@/components/assistant/AssistantOrb";
import { NeonButton } from "@/components/ui/NeonButton";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center selection:bg-primary selection:text-black">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative"
                >
                    <AssistantOrb />
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse" />
                </motion.div>

                <div className="space-y-6">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-8xl font-display font-medium text-white tracking-tighter"
                    >
                        Breathe <span className="text-primary italic">Smarter</span>.
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        EcoAir.ai blends industrial IoT precision with a stunning glassmorphism interface. 
                        Monitor air quality globally and control your environment in real-time.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link href="/login">
                        <NeonButton className="px-12 py-8 text-lg uppercase tracking-[0.2em] font-bold">
                            Enter Dashboard <ArrowRight className="w-5 h-5 ml-4" />
                        </NeonButton>
                    </Link>
                    <Link href="/signup">
                        <button className="px-12 py-4 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all uppercase tracking-widest text-xs flex items-center gap-3 font-bold group">
                            Start Genesis <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20"
                >
                    {[
                        { icon: Shield, title: "Hysteresis Logic", desc: "Hardware safety buffer prevents relay chattering." },
                        { icon: Zap, title: "Mailbox Sync", desc: "Instant bi-directional command processing." },
                        { icon: Globe, title: "Secure Fetch", desc: "Global AQI data via protected server actions." }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-white font-medium">{feature.title}</h3>
                            <p className="text-white/30 text-xs leading-relaxed max-w-[200px]">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
