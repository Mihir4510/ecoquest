import React, { useEffect, useState } from "react";
import { TreePine, Recycle, Users } from "lucide-react";
import api from "../api"; // your axios instance

function Home() {
  const [stats, setStats] = useState({
    treesPlanted: 0,
    wasteRecycled: 0,
    studentsInvolved: 0,
  });

  const [tips, setTips] = useState([]);

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats"); // backend route: GET /stats
        setStats({
          treesPlanted: res.data.treesPlanted,
          wasteRecycled: res.data.wasteRecycled,
          studentsInvolved: res.data.studentsInvolved,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    // Fetch eco tips from backend
    const fetchTips = async () => {
      try {
        const res = await api.get("/tips"); // backend route: GET /tips
        setTips(res.data); // array of tips
      } catch (error) {
        console.error("Failed to fetch tips:", error);
        // fallback
        setTips([
          "Use bicycles instead of motorbikes",
          "Plant at least one tree each month",
          "Recycle and reuse materials",
        ]);
      }
    };

    fetchStats();
    fetchTips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <header className="bg-green-100 py-16 text-center">
        <h1 className="text-4xl font-bold text-green-800">
          Welcome to EcoQuest 🌱
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Track, Earn & Compete by being eco-friendly!
        </p>
      </header>

      {/* Stats Section */}
      <section className="flex justify-around p-8 bg-white shadow-md rounded-lg mx-4 mt-8">
        {/* Trees Planted */}
        <div className="text-center p-4 border rounded-lg transition duration-300 hover:border-green-500 hover:shadow-lg">
          <TreePine className="w-10 h-10 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold text-green-700 mt-2">
            {stats.treesPlanted}
          </h2>
          <p className="text-gray-600">Trees Planted</p>
        </div>

        {/* Waste Recycled */}
        <div className="text-center p-4 border rounded-lg transition duration-300 hover:border-green-500 hover:shadow-lg">
          <Recycle className="w-10 h-10 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold text-green-700 mt-2">
            {stats.wasteRecycled}
          </h2>
          <p className="text-gray-600">Kg Waste Recycled</p>
        </div>

        {/* Students Involved */}
        <div className="text-center p-4 border rounded-lg transition duration-300 hover:border-green-500 hover:shadow-lg">
          <Users className="w-10 h-10 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold text-green-700 mt-2">
            {stats.studentsInvolved}%
          </h2>
          <p className="text-gray-600">Students Involved</p>
        </div>
      </section>

      {/* Eco Tips Section */}
      <section className="mt-10 mb-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">Eco Tips 🌍</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-xl p-6 w-72 text-center 
                         transition-all duration-300 hover:border-green-400 hover:shadow-lg"
            >
              <p className="font-medium text-green-900">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
