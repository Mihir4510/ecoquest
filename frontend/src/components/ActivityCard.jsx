// src/components/ActivityCard.jsx
import React from "react";

function ActivityCard({ title, description, points, icon }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl border border-transparent hover:border-green-400 flex flex-col justify-between">
      {/* Icon and Title */}
      <div className="flex items-center mb-4">
        <span className="text-green-600 text-3xl mr-3">{icon || "✅"}</span>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Points */}
      <div className="mt-auto">
        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-full">
          +{points || 0} pts
        </span>
      </div>
    </div>
  );
}

export default ActivityCard;
