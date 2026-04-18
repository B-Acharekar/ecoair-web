"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Zap, Activity, Award, LogOut, X, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfileSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileSlideOver({ isOpen, onClose }: ProfileSlideOverProps) {
    const [user] = useAuthState(auth);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const creationDate = user?.metadata.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : "N/A";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[200] bg-black/40 backdrop-blur-3xl border-l border-white/10 p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-display font-medium text-white">Elite Profile</h2>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6 text-white/40" />
                            </button>
                        </div>

                        <div className="space-y-12">
                            {/* User Identity */}
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(0,255,157,0.1)] overflow-hidden">
                                    {user?.photoURL ? (
                                        <Image src={user.photoURL} alt="User" width={80} height={80} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl text-white font-medium">{user?.displayName || "Operator Alpha"}</h3>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{user?.email}</p>
                                </div>
                            </div>

                            {/* Rapid Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <GlassCard className="p-4 bg-white/[0.02]" intensity="low">
                                    <Activity className="w-4 h-4 text-primary mb-2" />
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">ESP32 Signal</p>
                                    <p className="text-lg text-white font-medium mt-1">-64 dBm</p>
                                </GlassCard>
                                <GlassCard className="p-4 bg-white/[0.02]" intensity="low">
                                    <Zap className="w-4 h-4 text-primary mb-2" />
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Filter Life</p>
                                    <p className="text-lg text-white font-medium mt-1">82%</p>
                                </GlassCard>
                            </div>

                            {/* System Status */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">Node Infrastructure</h4>
                                <div className="space-y-4">
                                    <StatusItem icon={Activity} label="Mesh Network" status="Stable" color="text-primary" />
                                    <StatusItem icon={Award} label="Safety Rating" status="Apex" color="text-primary" />
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between mb-8 opacity-40">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Active Since</span>
                                    </div>
                                    <span className="text-xs text-white">{creationDate}</span>
                                </div>
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] text-center mb-6">Linked Node: ESP32_V2_PRO</p>
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest group"
                                >
                                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    Terminate Session
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function StatusItem({ icon: Icon, label, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-white/20" />
                <span className="text-sm text-white/60">{label}</span>
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{status}</span>
        </div>
    );
}
