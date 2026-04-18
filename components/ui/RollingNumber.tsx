"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface RollingNumberProps {
  value: number;
  className?: string;
}

export function RollingNumber({ value, className }: RollingNumberProps) {
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className={`flex overflow-hidden ${className}`}>
        <motion.span className="inline-block">
            {useTransform(springValue, (latest) => Math.round(latest))}
        </motion.span>
    </div>
  );
}

// Odometer style for individual digits (Advanced Vibe)
export function Odometer({ value, className }: { value: number; className?: string }) {
    const digits = value.toString().padStart(3, "0").split("");

    return (
        <div className={`flex gap-1 ${className}`}>
            {digits.map((digit, i) => (
                <Digit key={i} digit={parseInt(digit)} />
            ))}
        </div>
    );
}

function Digit({ digit }: { digit: number }) {
    const spring = useSpring(digit * 40, { stiffness: 50, damping: 15 });

    useEffect(() => {
        spring.set(digit * 40);
    }, [digit]);

    return (
        <div className="h-10 w-6 overflow-hidden relative">
            <motion.div
                style={{ y: useTransform(spring, (v) => -v) }}
                className="absolute inset-0 flex flex-col"
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <div key={n} className="h-10 flex items-center justify-center font-display text-4xl font-bold">
                        {n}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
