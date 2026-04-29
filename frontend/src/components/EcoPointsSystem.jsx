import React, { useState, useEffect } from "react";
import { Leaf, TreePine, Recycle, Droplets, Zap, Star, Award, TrendingUp } from "lucide-react";

const EcoPointsSystem = () => {
  const [pointsBreakdown, setPointsBreakdown] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Mock data for points breakdown
    setPointsBreakdown([
      {
        activity: "🌳 Planted 3 trees",
        points: 60,
        date: "2024-01-15",
        impact: "22kg CO₂ saved"
      },
      {
        activity: "🚴 Biked to campus (5 days)",
        points: 50,
        date: "2024-01-14",
        impact: "2.5kg CO₂ saved"
      },
      {
        activity: "♻️ Recycled 10kg waste",
        points: 30,
        date: "2024-01-13",
        impact: "5kg waste diverted"
      },
      {
        activity: "💧 Saved 50L water",
        points: 25,
        date: "2024-01-12",
        impact: "50L water conserved"
      },
      {
        activity: "🌱 Campus cleanup",
        points: 40,
        date: "2024-01-11",
        impact: "2kg waste collected"
      }
    ]);

    setRecentActivities([
      { type: "Tree Planting", count: 3, points: 60 },
      { type: "Cycling", count: 5, points: 50 },
      { type: "Recycling", count: 2, points: 30 },
      { type: "Water Saving", count: 1, points: 25 },
      { type: "Cleanup", count: 1, points: 40 }
    ]);
  }, []);

  const getTotalPoints = () => {
    return pointsBreakdown.reduce((sum, activity) => sum + activity.points, 0);
  };

  const getTotalImpact = () => {
    return {
      co2Saved: 24.5, // kg
      wasteRecycled: 15, // kg
      waterSaved: 50, // L
      treesPlanted: 3
    };
  };

  const getPointsLevel = (points) => {
    if (points >= 1000) return { level: "Forest Keeper", color: "text-green-800", icon: "🌲" };
    if (points >= 500) return { level: "Tree Guardian", color: "text-green-700", icon: "🌳" };
    if (points >= 200) return { level: "Eco Warrior", color: "text-green-600", icon: "🌿" };
    if (points >= 100) return { level: "Green Star", color: "text-green-500", icon: "⭐" };
    return { level: "Seed", color: "text-green-400", icon: "🌱" };
  };

  const totalPoints = getTotalPoints();
  const impact = getTotalImpact();
  const level = getPointsLevel(totalPoints);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Leaf className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-green-800">Your Eco-Points Journey</h2>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-4xl font-bold text-green-600 mb-2">{totalPoints}</div>
          <div className="text-sm text-green-700 font-medium">Total Eco-Points</div>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <span className="text-lg">{level.icon}</span>
            <span className={`text-sm font-semibold ${level.color}`}>{level.level}</span>
          </div>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
          <div className="text-4xl font-bold text-blue-600 mb-2">{impact.co2Saved}kg</div>
          <div className="text-sm text-blue-700 font-medium">CO₂ Saved</div>
          <div className="text-xs text-blue-600 mt-1">Environmental Impact</div>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="text-4xl font-bold text-purple-600 mb-2">{impact.treesPlanted}</div>
          <div className="text-sm text-purple-700 font-medium">Trees Planted</div>
          <div className="text-xs text-purple-600 mt-1">Nature Contribution</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>Recent Activities</span>
        </h3>
        
        <div className="space-y-3">
          {pointsBreakdown.slice(0, 5).map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{activity.activity.split(' ')[0]}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{activity.activity}</div>
                  <div className="text-sm text-gray-600">{activity.impact}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">+{activity.points}</div>
                <div className="text-xs text-gray-500">{activity.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Types Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-green-600" />
          <span>Activity Breakdown</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{activity.type}</span>
                <span className="text-sm text-green-600 font-bold">+{activity.points}</span>
              </div>
              <div className="text-sm text-gray-600">
                {activity.count} {activity.count === 1 ? 'activity' : 'activities'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Progress Bar */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-green-800">Progress to Next Level</span>
          <span className="text-sm text-green-700">
            {totalPoints}/1000 points
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((totalPoints / 1000) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-green-700 mt-2 text-center">
          {1000 - totalPoints} more points to become a Forest Keeper! 🌲
        </p>
      </div>
    </div>
  );
};

export default EcoPointsSystem;
