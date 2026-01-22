export default function AQICard() {
  const aqi = 162; // dummy data
  const status = "Poor";

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold">Air Quality Index</h3>
      <p className="text-4xl font-bold mt-2">{aqi}</p>
      <span className="inline-block mt-2 px-3 py-1 text-sm rounded bg-red-100 text-red-600">
        {status}
      </span>
    </div>
  );
}
