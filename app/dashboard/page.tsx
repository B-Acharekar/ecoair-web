"use client";

import { useState } from "react";
import { data as initialData } from "@/lib/mock";
import { themeByAQI } from "@/lib/theme";

import HeroAQI from "@/components/HeroAQI";
import InsightPanel from "@/components/InsightPanel";
import MiniStats from "@/components/MiniStats";
import AQIFlow from "@/components/AQIFlow";
import AssistantOrb from "@/components/AssistantOrb";

export default function Dashboard() {
  const [purifierOn, setPurifierOn] = useState(initialData.purifierOn);
  const [activeIndex, setActiveIndex] = useState(
    initialData.trend.length - 1
  );

  // Compute AQI dynamically from gas readings
  const activePoint = initialData.trend[activeIndex];
  const activeAQI = activePoint.gases
    ? Math.max(...Object.values(activePoint.gases))
    : activePoint.aqi || 0;

  const theme = themeByAQI(activeAQI);

  return (
    <main
      className={`
        min-h-screen
        bg-gradient-to-br
        ${theme.bg}
        flex
        justify-center
        py-8
      `}
    >
      <div
        className="
          relative
          w-full
          max-w-6xl
          px-4 sm:px-6
          space-y-10
        "
      >
        {/* HERO – System Status */}
        <section className="text-center">
          <HeroAQI
            data={{
              ...initialData,
              aqi: activeAQI,
              gases: activePoint.gases,
              level:
                activeAQI <= 50
                  ? "Air Quality Good"
                  : activeAQI <= 100
                  ? "Moderate Air Quality"
                  : "Poor Air Quality",
            }}
          />
        </section>

        {/* DASHBOARD GRID */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* AQI FLOW */}
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
            <AQIFlow
              data={initialData}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>

          {/* INSIGHT PANEL */}
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
            <InsightPanel
              data={{
                ...initialData,
                aqi: activeAQI,
                gases: activePoint.gases,
              }}
            />
          </div>
        </section>

        {/* MINI STATS / CONTROLS */}
        <section className="rounded-2xl bg-white/5 p-6 backdrop-blur-md">
          <MiniStats
            data={{
              ...initialData,
              purifierOn,
              gases: activePoint.gases,
            }}
          />
        </section>

        {/* ASSISTANT ORB */}
        <AssistantOrb
          gases={activePoint.gases || {}}
          purifierOn={purifierOn}
          onToggle={() => setPurifierOn((v) => !v)}
        />
      </div>
    </main>
  );
}
