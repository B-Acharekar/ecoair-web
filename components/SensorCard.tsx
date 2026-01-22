export default function SensorCard() {
  const temperature = 28.4;
  const humidity = 61;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold">Environment</h3>

      <p className="mt-4">
        🌡 Temperature: <strong>{temperature}°C</strong>
      </p>

      <p className="mt-2">
        💧 Humidity: <strong>{humidity}%</strong>
      </p>
    </div>
  );
}
