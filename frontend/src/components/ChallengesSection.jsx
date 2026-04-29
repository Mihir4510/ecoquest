import React, { useState, useEffect } from "react";
import { Target, Flame, Calendar, Award, Clock, Star } from "lucide-react";

const ChallengesSection = () => {
  const [challenges, setChallenges] = useState([]);
  const [userStreaks, setUserStreaks] = useState([]);

  useEffect(() => {
    // Mock challenges data
    setChallenges([
      {
        id: 1,
        title: "🌱 7-Day Green Streak",
        description: "Complete an eco-activity for 7 consecutive days",
        points: 100,
        progress: 5,
        maxProgress: 7,
        type: "streak",
        icon: "🔥",
        color: "bg-orange-100 text-orange-800"
      },
      {
        id: 2,
        title: "♻️ Plastic-Free Week",
        description: "Avoid single-use plastic for 7 days",
        points: 75,
        progress: 3,
        maxProgress: 7,
        type: "sustainability",
        icon: "🚯",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: 3,
        title: "🚴 Bike to Campus",
        description: "Use bicycle for transportation 5 times this week",
        points: 50,
        progress: 2,
        maxProgress: 5,
        type: "transportation",
        icon: "🚲",
        color: "bg-green-100 text-green-800"
      },
      {
        id: 4,
        title: "🌳 Tree Planting Champion",
        description: "Plant 3 trees this month",
        points: 150,
        progress: 1,
        maxProgress: 3,
        type: "environmental",
        icon: "🌳",
        color: "bg-emerald-100 text-emerald-800"
      }
    ]);

    // Mock user streaks
    setUserStreaks([
      {
        type: "Daily Activities",
        days: 12,
        icon: "🔥",
        color: "text-orange-600"
      },
      {
        type: "Plastic-Free",
        days: 8,
        icon: "♻️",
        color: "text-blue-600"
      },
      {
        type: "Bike Commute",
        days: 5,
        icon: "🚴",
        color: "text-green-600"
      }
    ]);
  }, []);

  const getProgressPercentage = (progress, maxProgress) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  const getStreakEmoji = (days) => {
    if (days >= 30) return "🏆";
    if (days >= 14) return "🔥";
    if (days >= 7) return "⭐";
    return "🌱";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-green-800">Active Challenges</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{challenge.icon}</span>
                <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${challenge.color}`}>
                {challenge.points} pts
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {challenge.progress}/{challenge.maxProgress}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(challenge.progress, challenge.maxProgress)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Streaks */}
      <div className="border-t pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Your Streaks</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userStreaks.map((streak, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 text-center"
            >
              <div className="text-3xl mb-2">{getStreakEmoji(streak.days)}</div>
              <h4 className="font-semibold text-gray-800 mb-1">{streak.type}</h4>
              <div className={`text-2xl font-bold ${streak.color} mb-1`}>
                {streak.days} days
              </div>
              <p className="text-sm text-gray-600">Keep it up!</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-green-800">You're on fire! 🔥</span>
        </div>
        <p className="text-green-700 text-sm">
          Your dedication to sustainability is making a real difference. Keep up the amazing work!
        </p>
      </div>
    </div>
  );
};

export default ChallengesSection;
