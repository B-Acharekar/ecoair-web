"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Shield, User, Cpu, Globe } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    try {
      setError("");
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-medium text-white mb-2">Register Device</h1>
                    <p className="text-white/40 text-sm tracking-widest uppercase">Initialize New Node</p>
                </div>

                <GlassCard className="p-10 flex flex-col gap-6" intensity="high">
                    <div className="space-y-4 w-full">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block ml-4">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-secondary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Operator Name"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-secondary/20 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-secondary transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="operator@ecoair.ai"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-secondary/20 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block ml-4">Device ID (Optional)</label>
                            <div className="relative group">
                                <Cpu className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-secondary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="ESP32_XXXXXX"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-secondary/20 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold block ml-4">Access Code</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-secondary transition-colors" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 ring-secondary/20 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <NeonButton variant="secondary" className="w-full py-8 text-sm uppercase tracking-[0.2em]" onClick={() => {/* Standard signup logic here */}}>
                        Initialize Node
                    </NeonButton>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/20"><span className="bg-[#0b0b0b] px-2 font-bold">Quick Initialization</span></div>
                    </div>

                    <button 
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                        <Globe className="w-4 h-4 text-white/40 group-hover:text-secondary transition-colors" />
                        <span className="text-xs font-bold text-white/60">Register with Google</span>
                    </button>

                    {error && <p className="text-red-400 text-[10px] text-center uppercase tracking-widest font-bold">{error}</p>}

                    <div className="text-center">
                        <p className="text-white/20 text-xs">
                            Already have an account? 
                            <Link href="/login" className="text-secondary hover:underline ml-2">Secure Login</Link>
                        </p>
                    </div>
                </GlassCard>

                <div className="mt-8 flex items-center justify-center gap-2 text-white/10">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.3em]">Hardware Level Security Protocols</span>
                </div>
            </motion.div>
        </main>
    );
}
