import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Star, 
  TrendingUp, 
  Target,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  XCircle
} from "lucide-react";
import api from "../api";

function EnhancedLeaderboard() {
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get level info
  const getLevelInfo = (points) => {
    if (points >= 600) return { name: "🌎 Eco Guardian", color: "text-purple-600", bgColor: "bg-purple-100" };
    if (points >= 300) return { name: "🌳 Forest Keeper", color: "text-green-700", bgColor: "bg-green-100" };
    if (points >= 100) return { name: "🌿 Small Plant", color: "text-emerald-600", bgColor: "bg-emerald-100" };
    return { name: "🌱 Seed", color: "text-lime-600", bgColor: "bg-lime-100" };
  };

  // Get rank medal
  const getRankMedal = (index) => {
    if (index === 0) return { emoji: "🥇", color: "text-yellow-500" };
    if (index === 1) return { emoji: "🥈", color: "text-gray-400" };
    if (index === 2) return { emoji: "🥉", color: "text-orange-600" };
    return { emoji: `#${index + 1}`, color: "text-gray-600" };
  };

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setLeaderboardUsers(res.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Fetch current user data
  const fetchCurrentUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get user profile
      const userRes = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(userRes.data);

      // Get user activities
      const activitiesRes = await api.get("/activities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserActivities(activitiesRes.data);

      // Get user challenges
      const challengesRes = await api.get("/challenges/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserChallenges(challengesRes.data);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLeaderboard();
      await fetchCurrentUserData();
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const isCurrentUser = (user) => {
    return currentUser && (user._id === currentUser._id || user.email === currentUser.email);
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-700 font-semibold text-lg">Loading Eco Champions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Eco Champions Leaderboard
          </h1>
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <p className="text-gray-600 text-lg">
          Real-time rankings of our sustainability heroes 🌍
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Leaderboard */}
        <div className="space-y-4">
          {leaderboardUsers.map((user, index) => {
            const rank = getRankMedal(index);
            const level = getLevelInfo(user.points);
            const isCurrent = isCurrentUser(user);
            const isExpanded = expandedUserId === user._id;

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative ${
                  isCurrent 
                    ? 'ring-4 ring-green-500 shadow-2xl' 
                    : 'shadow-lg hover:shadow-xl'
                } bg-white rounded-2xl overflow-hidden transition-all duration-300`}
              >
                {/* Main Card */}
                <div 
                  className={`p-6 ${isCurrent ? 'bg-gradient-to-r from-green-50 to-emerald-50' : ''}`}
                  onClick={() => isCurrent && toggleExpand(user._id)}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Rank & User Info */}
                    <div className="flex items-center space-x-6">
                      {/* Rank */}
                      <div className="flex flex-col items-center">
                        <span className={`text-4xl ${rank.color}`}>{rank.emoji}</span>
                        <span className="text-sm font-bold text-gray-600">Rank</span>
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                          {isCurrent && (
                            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                              YOU
                            </span>
                          )}
                        </div>
                        
                        {/* Level Badge */}
                        <div className={`inline-flex items-center space-x-2 px-4 py-1 rounded-full ${level.bgColor}`}>
                          <span className={`font-semibold ${level.color}`}>{level.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center space-x-8">
                      {/* Points */}
                      <div className="text-center">
                        <div className="flex items-center space-x-2 mb-1">
                          <Star className="w-6 h-6 text-yellow-500" />
                          <span className="text-3xl font-bold text-green-600">{user.points}</span>
                        </div>
                        <span className="text-sm text-gray-600">Eco Points</span>
                      </div>

                      {/* Streak */}
                      {user.streakCount > 0 && (
                        <div className="text-center">
                          <div className="flex items-center space-x-2 mb-1">
                            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                            <span className="text-3xl font-bold text-orange-600">{user.streakCount}</span>
                          </div>
                          <span className="text-sm text-gray-600">Day Streak</span>
                        </div>
                      )}

                      {/* Expand Button (for current user) */}
                      {isCurrent && (
                        <button className="p-2 hover:bg-green-100 rounded-full transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-green-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-green-600" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Section (Only for Current User) */}
                <AnimatePresence>
                  {isCurrent && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t-2 border-green-200 bg-gradient-to-br from-white to-green-50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Activities Section */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span>Your Recent Activities</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {userActivities.slice(0, 6).map((activity, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-xl">✅</span>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-800">{activity.type}</p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(activity.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">+{activity.points}</p>
                                    <p className="text-xs text-gray-500">points</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {userActivities.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No activities yet. Start your eco journey!</p>
                          )}
                        </div>

                        {/* Challenges Section */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            <span>Your Active Challenges</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userChallenges.map((challenge, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-xl border-2 ${
                                  challenge.userProgress?.completed
                                    ? 'bg-green-50 border-green-300'
                                    : 'bg-purple-50 border-purple-300'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{challenge.icon}</span>
                                    <div>
                                      <h5 className="font-bold text-gray-800">{challenge.title}</h5>
                                      <p className="text-sm text-gray-600">{challenge.description}</p>
                                    </div>
                                  </div>
                                  {challenge.userProgress?.completed ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold text-purple-600">
                                      {challenge.userProgress?.progress.currentPoints || 0} / {challenge.targetPoints} pts
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${Math.min(
                                          ((challenge.userProgress?.progress.currentPoints || 0) / challenge.targetPoints) * 100,
                                          100
                                        )}%`
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Reward */}
                                <div className="mt-3 flex items-center space-x-2 text-sm">
                                  <Award className="w-4 h-4 text-yellow-500" />
                                  <span className="text-gray-600">
                                    Reward: <span className="font-bold text-yellow-600">+{challenge.reward.points} pts</span>
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          {userChallenges.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                              No active challenges. Join one to earn bonus rewards! 🎯
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {leaderboardUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Champions Yet!</h3>
            <p className="text-gray-500">Be the first to start your eco journey and claim the top spot!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default EnhancedLeaderboard;

