"use client";

import { useState } from "react";

export default function PurifierToggle() {
  const [status, setStatus] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold">Air Purifier</h3>

      <p className="mt-4">
        Status:{" "}
        <strong className={status ? "text-green-600" : "text-gray-500"}>
          {status ? "ON" : "OFF"}
        </strong>
      </p>

      <button
        onClick={() => setStatus(!status)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Toggle Purifier
      </button>
    </div>
  );
}
