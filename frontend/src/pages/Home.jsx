import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TreePine, Recycle, Users, RefreshCw, Trophy, Star, 
  Award, Target, Zap, Sparkles, Crown, Shield
} from "lucide-react";
import api from "../api"; // your axios instance

function Home() {
  const [stats, setStats] = useState({
    treesPlanted: 0,
    wasteRecycled: 0,
    studentsInvolved: 0,
  });

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Levels and Badges Data
  const levels = [
    {
      name: "🌱 Seed",
      points: "0 – 99 pts",
      description: "Beginner stage — start your eco journey",
      icon: "🌱",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      name: "🌿 Small Plant",
      points: "100 – 299 pts",
      description: "You're growing strong! Keep going!",
      icon: "🌿",
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      name: "🌳 Forest Keeper",
      points: "300 – 599 pts",
      description: "You're protecting nature!",
      icon: "🌳",
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      name: "🌎 Eco Guardian",
      points: "600+ pts",
      description: "True environmental hero!",
      icon: "🌎",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  const badges = [
    { name: "First Steps", icon: "👶", description: "Complete your first activity", color: "from-blue-400 to-blue-600" },
    { name: "Tree Hugger", icon: "🌳", description: "Plant 5 trees", color: "from-green-400 to-green-600" },
    { name: "Cycle Master", icon: "🚴", description: "Use bicycle 10 times", color: "from-yellow-400 to-yellow-600" },
    { name: "Recycle King", icon: "♻️", description: "Recycle 20 items", color: "from-emerald-400 to-emerald-600" },
    { name: "Eco Warrior", icon: "⚔️", description: "Earn 500 points", color: "from-red-400 to-red-600" },
    { name: "Nature Guardian", icon: "🛡️", description: "Reach Eco Guardian level", color: "from-purple-400 to-purple-600" }
  ];

  useEffect(() => {
    // Fetch stats from backend
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats"); // backend route: GET /api/stats
        setStats({
          treesPlanted: res.data.treesPlanted || 0,
          wasteRecycled: res.data.wasteRecycled || 0,
          studentsInvolved: res.data.studentsInvolved || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Set fallback stats
        setStats({
          treesPlanted: 0,
          wasteRecycled: 0,
          studentsInvolved: 0,
        });
      }
    };

    // Fetch eco tips from backend
    const fetchTips = async () => {
      try {
        const res = await api.get("/stats/tips"); // backend route: GET /api/stats/tips
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

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchTips()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const refreshStats = () => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/stats");
        setStats({
          treesPlanted: res.data.treesPlanted || 0,
          wasteRecycled: res.data.wasteRecycled || 0,
          studentsInvolved: res.data.studentsInvolved || 0,
        });
      } catch (error) {
        console.error("Failed to refresh stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 py-20 text-center relative overflow-hidden"
      >
        {/* Floating Background Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 left-10 text-white/20"
        >
          <TreePine className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-10 right-10 text-white/20"
        >
          <Recycle className="w-16 h-16" />
        </motion.div>

        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Trophy className="w-16 h-16 text-white mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to EcoQuest 🌱
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Track, Earn & Compete by being eco-friendly! Level up and earn badges for your environmental actions.
          </p>
        </div>
      </motion.header>

      {/* Campus Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl mx-4 mt-8 border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="w-6 h-6 text-green-600" />
            <span>Campus Statistics</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={refreshStats}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await api.post('/stats/recalculate');
                  await refreshStats();
                  alert('User stats recalculated successfully!');
                } catch (error) {
                  console.error('Recalculation failed:', error);
                  alert('Failed to recalculate stats');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Fix Stats</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
            />
            <span className="ml-4 text-gray-600 text-lg">Loading campus stats...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trees Planted */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <TreePine className="w-12 h-12 mx-auto text-green-600 mb-3" />
              <h3 className="text-3xl font-bold text-green-700 mb-2">
                {stats.treesPlanted}
              </h3>
              <p className="text-gray-600 font-medium">Trees Planted</p>
            </motion.div>

            {/* Waste Recycled */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <Recycle className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
              <h3 className="text-3xl font-bold text-emerald-700 mb-2">
                {stats.wasteRecycled}
              </h3>
              <p className="text-gray-600 font-medium">Kg Waste Recycled</p>
            </motion.div>

            {/* Students Involved */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <Users className="w-12 h-12 mx-auto text-teal-600 mb-3" />
              <h3 className="text-3xl font-bold text-teal-700 mb-2">
                {stats.studentsInvolved}%
              </h3>
              <p className="text-gray-600 font-medium">Students Involved</p>
            </motion.div>
          </div>
        )}
      </motion.section>

      {/* Levels & Progression Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-12 px-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <span>Levels & Progression</span>
            <Crown className="w-8 h-8 text-yellow-500" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Progress through different levels by earning eco points. Each level unlocks new achievements and recognition!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`${level.bgColor} border-2 ${level.borderColor} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                className="text-6xl mb-4"
              >
                {level.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{level.name}</h3>
              <p className="text-sm font-semibold text-gray-600 mb-3">{level.points}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{level.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Badges Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-16 px-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
            <Award className="w-8 h-8 text-purple-500" />
            <span>Earnable Badges</span>
            <Award className="w-8 h-8 text-purple-500" />
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete specific challenges to earn unique badges and showcase your environmental achievements!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-purple-300"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                className="text-5xl mb-4"
              >
                {badge.icon}
              </motion.div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
              <div className="mt-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`inline-block px-4 py-2 bg-gradient-to-r ${badge.color} text-white rounded-full text-sm font-semibold shadow-lg`}
                >
                  Earn Badge
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Eco Tips Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-16 mb-12 px-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-3">
            <Sparkles className="w-8 h-8 text-green-500" />
            <span>Eco Tips</span>
            <Sparkles className="w-8 h-8 text-green-500" />
          </h2>
          <p className="text-lg text-gray-600">Simple ways to make a big environmental impact!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-green-400"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                className="text-4xl mb-4"
              >
                🌍
              </motion.div>
              <p className="font-medium text-green-900 text-lg leading-relaxed">{tip}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="text-center mb-12 px-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🚀
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Eco Journey?</h3>
          <p className="text-white/90 text-lg mb-6">
            Join thousands of students making a difference! Every action counts towards a greener future.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Get Started Now</span>
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
