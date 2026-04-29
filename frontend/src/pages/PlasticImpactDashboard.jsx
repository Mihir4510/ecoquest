import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Recycle, Users, TrendingUp, Medal, 
  Crown, Star, Sparkles, Award, Leaf
} from "lucide-react";
import api from "../api";

function PlasticImpactDashboard() {
  const [champions, setChampions] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [championsRes, impactRes] = await Promise.all([
        api.get("/plastic-buyback/champions"),
        api.get("/plastic-buyback/impact")
      ]);

      setChampions(championsRes.data);
      setImpactStats(impactRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 0) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (rank === 1) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-orange-600" />;
    return <Star className="w-6 h-6 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 font-semibold text-lg">Loading Impact Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Recycle className="w-12 h-12 text-green-600 animate-spin-slow" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Plastic Buy-Back Impact
          </h1>
          <Sparkles className="w-12 h-12 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600">
          Our collective effort in making the planet cleaner! 🌍
        </p>
      </motion.div>

      {/* Global Impact Stats */}
      {impactStats && (
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🌍 Global Impact Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <Recycle className="w-12 h-12 mb-4" />
              <p className="text-sm opacity-90 mb-1">Total Plastic Recycled</p>
              <p className="text-4xl font-bold">{impactStats.totalPlasticRecycled.toFixed(2)} kg</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <TrendingUp className="w-12 h-12 mb-4" />
              <p className="text-sm opacity-90 mb-1">Total Submissions</p>
              <p className="text-4xl font-bold">{impactStats.totalSubmissions}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <Trophy className="w-12 h-12 mb-4" />
              <p className="text-sm opacity-90 mb-1">Total Points Awarded</p>
              <p className="text-4xl font-bold">{impactStats.totalPointsAwarded.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <Users className="w-12 h-12 mb-4" />
              <p className="text-sm opacity-90 mb-1">Eco Champions</p>
              <p className="text-4xl font-bold">{impactStats.ecoChampions}</p>
            </motion.div>
          </div>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span>Environmental Impact</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">
                  {(impactStats.totalPlasticRecycled * 2.5).toFixed(1)} kg
                </p>
                <p className="text-sm text-gray-600 mt-1">CO₂ Emissions Prevented</p>
                <p className="text-xs text-gray-500 mt-1">~2.5 kg CO₂ per kg plastic</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">
                  {(impactStats.totalPlasticRecycled * 0.5).toFixed(0)} L
                </p>
                <p className="text-sm text-gray-600 mt-1">Oil Saved</p>
                <p className="text-xs text-gray-500 mt-1">~0.5L oil per kg plastic</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">
                  {(impactStats.totalPlasticRecycled * 10).toFixed(0)} items
                </p>
                <p className="text-sm text-gray-600 mt-1">Ocean Pollution Prevented</p>
                <p className="text-xs text-gray-500 mt-1">Est. plastic items diverted</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Plastic Champions Leaderboard */}
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          🏆 Plastic Champions Leaderboard
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {champions.map((champion, index) => (
            <motion.div
              key={champion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                index < 3 ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="text-center">
                    {getMedalIcon(index)}
                    <p className="text-sm font-bold text-gray-600 mt-1">#{index + 1}</p>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                      <span>{champion.name}</span>
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500 animate-pulse" />}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Recycle className="w-4 h-4 text-green-600" />
                        <span>{champion.totalSubmissions} submissions</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span>{champion.totalPoints} pts</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    {champion.totalWeight.toFixed(2)} kg
                  </p>
                  <p className="text-sm text-gray-500">Plastic Recycled</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((champion.totalWeight / (champions[0]?.totalWeight || 1)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {champions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Champions Yet!</h3>
            <p className="text-gray-500">Be the first to submit plastic and claim the top spot!</p>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center"
      >
        <Sparkles className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Join the Movement!</h2>
        <p className="text-lg mb-6">
          Every piece of plastic you recycle makes a difference. Start today and become an Eco Champion!
        </p>
        <a
          href="/plastic-buyback"
          className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
        >
          Submit Plastic Now →
        </a>
      </motion.div>
    </div>
  );
}

export default PlasticImpactDashboard;

