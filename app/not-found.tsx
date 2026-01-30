"use client";

import { themeByAQI } from "@/lib/theme";
import { data as mockData } from "@/lib/mock";
import Link from "next/link";

export default function NotFound() {
  // Use current AQI to determine theme
  const theme = themeByAQI(mockData.aqi);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-6 md:px-16 text-white bg-gradient-to-br ${theme.bg}`}
    >
      <div className="text-center space-y-6">
        <h1 className={`text-6xl md:text-8xl font-bold ${theme.accent}`}>
          404
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300">
          Oops! The page you are looking for does not exist.
        </p>

        <Link
          href="/dashboard"
          className={`inline-block mt-6 px-8 py-4 rounded-xl bg-emerald-400/30 hover:bg-emerald-400/50 transition text-lg md:text-xl`}
        >
          Go to Dashboard
        </Link>

        <p className="text-sm text-neutral-400 mt-4">
          Check your URL or navigate back to the main dashboard.
        </p>
      </div>
    </main>
  );
}
