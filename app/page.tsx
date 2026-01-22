import AQICard from "@/components/AQICard";
import SensorCard from "@/components/SensorCard";
import PurifierToggle from "@/components/PurifierToggle";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AQICard />
        <SensorCard />
        <PurifierToggle />
      </div>

      {/* Chart placeholder */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">AQI Trend</h2>
        <p className="text-gray-500">
          AQI graph will be displayed here.
        </p>
      </div>
    </div>
  );
}
