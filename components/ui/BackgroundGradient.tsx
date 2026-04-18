"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundGradient() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505] pointer-events-none">
            {/* Drifting Emerald Orb - 5% subtle vibe */}
            <motion.div
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -40, 60, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/[0.05] blur-[200px] rounded-full"
            />

            {/* Mouse Following Glow - 3% even more subtle */}
            <motion.div
                animate={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                }}
                transition={{ type: "spring", damping: 40, stiffness: 40 }}
                className="absolute w-[500px] h-[500px] bg-primary/[0.03] blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
}
