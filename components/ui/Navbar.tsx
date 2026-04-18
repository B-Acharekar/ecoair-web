"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explorer", href: "/city", icon: Globe },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
];

function NavIcon({ item, isActive }: { item: typeof navItems[0], isActive: boolean }) {
    let mouseX = useMotionValue(Infinity);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <Link href={item.href}>
            <motion.div
                ref={ref}
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className={cn(
                    "relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-colors group",
                    isActive ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5"
                )}
                whileHover={{ y: -8, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                
                {/* Tooltip */}
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.name}
                </span>

                {isActive && (
                    <motion.div 
                        layoutId="active-dot"
                        className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                    />
                )}
            </motion.div>
        </Link>
    );
}

export function Navbar() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-auto">
            <motion.nav 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 p-2 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative"
            >
                {/* Sliding Selector Bubble */}
                <div className="absolute inset-0 p-2 pointer-events-none">
                    <div className="relative w-full h-full">
                        {navItems.map((item) => (
                            pathname === item.href && (
                                <motion.div
                                    key="bubble"
                                    layoutId="nav-bubble"
                                    className="absolute inset-y-0 rounded-[2rem] bg-primary/20 border border-primary/20 shadow-[0_0_20px_rgba(0,255,157,0.15)]"
                                    style={{ 
                                        width: `calc(100% / ${navItems.length})`,
                                        left: `${(navItems.findIndex(i => i.href === pathname) * 100) / navItems.length}%`
                                    }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )
                        ))}
                    </div>
                </div>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "flex items-center justify-center w-14 h-14 rounded-full transition-colors",
                                    isActive ? "text-primary" : "text-white/40 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.nav>
        </div>
    );
}
