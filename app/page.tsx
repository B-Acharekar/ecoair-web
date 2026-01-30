"use client";

import { themeByAQI } from "@/lib/theme";
import { data as mockData } from "@/lib/mock";
import MiniStats from "@/components/MiniStats";
import Link from "next/link";

export default function LandingPage() {
  const activeAQI = mockData.aqi;
  const theme = themeByAQI(activeAQI);

  return (
    <main className={`min-h-screen text-white bg-gradient-to-br ${theme.bg} font-sans`}>
      {/* ---------------- Navbar ---------------- */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-6">
        <h1 className={`text-2xl font-bold ${theme.accent}`}>EcoAir</h1>
        <div className="flex gap-4 items-center">
          <Link href="/auth" className="px-4 py-2 rounded-lg hover:bg-white/20 transition">
            Login
          </Link>
          <Link href="/auth" className="px-4 py-2 rounded-lg bg-emerald-400/30 hover:bg-emerald-400/50 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 pt-20 pb-32 gap-12 md:gap-24">
        {/* Left: Text */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme.accent}`}>
            Smart Indoor Air Management
          </h1>
          <p className="text-neutral-200 text-lg sm:text-xl md:text-2xl">
            Monitor, purify, and control your air quality from anywhere. Keep your home safe and fresh.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a
              href="#features"
              className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 transition"
            >
              Explore Features
            </a>
            <a
              href="#setup"
              className="px-6 py-3 rounded-xl bg-emerald-400/30 hover:bg-emerald-400/50 transition"
            >
              Setup Your Device
            </a>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/images/Landing-hero.jpg"
            alt="EcoAir Hero"
            className="rounded-2xl shadow-2xl w-full max-w-lg md:max-w-full object-cover"
          />
        </div>
      </section>

      {/* ---------------- Stats Section ---------------- */}
      <section className="px-6 md:px-16 py-16">
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center ${theme.accent}`}>
          Live Air Stats
        </h2>
        <div className="mt-12 max-w-5xl mx-auto">
          <MiniStats data={mockData} />
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="px-6 md:px-16 py-16 grid gap-8 md:grid-cols-3 text-center">
        <Feature
          title="Multi-Gas Sensing"
          desc="Monitor CO, NO₂, O₃, VOCs in real time with high accuracy."
        />
        <Feature
          title="Remote Control"
          desc="Adjust purifier modes, fan speed, and receive notifications from your device."
        />
        <Feature
          title="Trends & Insights"
          desc="Track AQI, temperature, humidity, and gas levels over time."
        />
      </section>

      {/* ---------------- Setup / CTA ---------------- */}
      <section
        id="setup"
        className="px-6 md:px-16 py-20 text-center rounded-2xl bg-white/10 backdrop-blur-xl mx-6 md:mx-16 mt-12"
      >
        <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme.accent}`}>
          Connect Your Device
        </h2>
        <p className="mt-4 text-neutral-200 max-w-lg mx-auto text-lg sm:text-xl">
          Configure, monitor, and control your EcoAir device easily. Enjoy safe, fresh air at home.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/signup"
            className="px-8 py-4 rounded-xl bg-emerald-400/30 hover:bg-emerald-400/50 transition text-lg sm:text-xl"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="px-8 py-4 rounded-xl bg-white/20 hover:bg-white/30 transition text-lg sm:text-xl"
          >
            Login
          </a>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="px-6 md:px-16 py-8 mt-12 text-center text-neutral-400">
        &copy; {new Date().getFullYear()} EcoAir. All rights reserved.
      </footer>
    </main>
  );
}

/* ---------- Feature Card ---------- */
function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/10 hover:scale-105 transform transition duration-300">
      <h3 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-300 text-sm sm:text-base">{desc}</p>
    </div>
  );
}
