// src/pages/Activities.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  TreePine, Leaf, Droplets, Sun, Wind, Recycle, 
  Bike, Trash2, Sparkles, Send, Activity, Zap
} from "lucide-react";
import Button from "../components/Button";
import ActivityCard from "../components/ActivityCard";
import LevelUpPopup from "../components/LevelUpPopup";
import api from "../api";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);

  const didYouKnow = {
    title: "Did You Know?",
    description:
      "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 463 gallons of oil! 🌎",
    points: 0,
    icon: "🌿",
  };

  const token = localStorage.getItem("token");

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map backend data to frontend format
      const mappedActivities = res.data.map((a) => ({
        title: a.type,
        description: a.description,
        points: a.points,
        icon: "✅",
      }));

      setActivities([...mappedActivities, didYouKnow]);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError("Failed to load activities. Showing fallback data.");
      // Fallback static activities
      setActivities([
        {
          title: "Plant a Tree",
          description: "Contribute to greenery by planting a tree in your area.",
          points: 50,
          icon: "🌳",
        },
        {
          title: "Use Bicycle",
          description: "Ride a bicycle instead of motor vehicles to reduce pollution.",
          points: 30,
          icon: "🚴",
        },
        didYouKnow,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    fetchActivities();
  }, [token]);

  // Handle activity submission with AI point calculation
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    
    if (!token) {
      alert("You must be logged in to submit an activity.");
      return;
    }

    const activityName = e.target.activityName.value.trim();
    if (!activityName) {
      alert("Please enter an activity description.");
      return;
    }

    setLoading(true);
    console.log("Submitting activity:", activityName);
    console.log("Token exists:", !!token);

    try {
      // Use fallback point calculation for now (bypass AI)
      const points = calculateFallbackPoints(activityName);
      console.log("Calculated points:", points);

      // Submit activity
      console.log("Submitting to activities endpoint...");
      const response = await api.post(
        "/activities",
        { 
          type: activityName, 
          description: activityName, 
          points: points 
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("Activity submitted successfully:", response.data);
      
      // Handle level up notification
      if (response.data.levelUp) {
        setLevelUpData({
          ...response.data.levelUp.newLevel,
          badgeUnlocked: response.data.levelUp.badgeUnlocked
        });
        setShowLevelUpPopup(true);
      } else {
        // Show success toast
        toast.success(`🎉 Activity submitted! You earned ${points} points!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Handle streak notification
      if (response.data.streak) {
        if (response.data.streak.broken) {
          toast.warning(`⚠️ ${response.data.streak.message}`, {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (response.data.streak.count > 1) {
          toast.success(`🔥 ${response.data.streak.message} Day ${response.data.streak.count}!`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.info(`✨ ${response.data.streak.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }

      e.target.reset();

      // Refresh activities and update local user data
      fetchActivities();
      
      // Update user in localStorage if available
      if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          points: response.data.user.points,
          level: response.data.user.level,
          levelName: response.data.user.levelName,
          streakCount: response.data.user.streakCount
        }));
      }
    } catch (err) {
      console.error("Failed to submit activity:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      alert(`Failed to submit activity: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fallback point calculation when AI is not available
  const calculateFallbackPoints = (activityName) => {
    const lowerActivity = activityName.toLowerCase();
    
    if (lowerActivity.includes('tree') || lowerActivity.includes('plant')) {
      return 20;
    } else if (lowerActivity.includes('bike') || lowerActivity.includes('cycle')) {
      return 10;
    } else if (lowerActivity.includes('recycle') || lowerActivity.includes('waste')) {
      return 15;
    } else if (lowerActivity.includes('clean') || lowerActivity.includes('pick')) {
      return 12;
    } else {
      return 5; // Default points for other activities
    }
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-16 h-16 text-white" />
          </motion.div>
          <p className="text-white text-xl font-semibold">Loading eco activities...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-center"
        >
          <p className="text-white text-xl">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
      {/* Parallax Background with Environmental Activities */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/90 to-teal-600/90">
        {/* Environmental Activity Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 10c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40zm0 5c19 0 35 16 35 35s-16 35-35 35-35-16-35-35 16-35 35-35z'/%3E%3Cpath d='M20 30c0-5 4-10 10-10s10 5 10 10-4 10-10 10-10-5-10-10zm60 0c0-5 4-10 10-10s10 5 10 10-4 10-10 10-10-5-10-10z'/%3E%3Cpath d='M30 60c0-3 2-6 5-6s5 3 5 6-2 6-5 6-5-3-5-6zm40 0c0-3 2-6 5-6s5 3 5 6-2 6-5 6-5-3-5-6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      </div>

      {/* Floating Environmental Elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-20 left-10 text-green-200/30 pointer-events-none"
      >
        <TreePine className="w-32 h-32 transform rotate-12" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
        className="absolute top-40 right-20 text-emerald-200/30 pointer-events-none"
      >
        <Bike className="w-24 h-24 transform -rotate-12" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
        className="absolute bottom-40 left-20 text-teal-200/30 pointer-events-none"
      >
        <Recycle className="w-28 h-28 transform rotate-45" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }}
        className="absolute bottom-20 right-10 text-green-200/30 pointer-events-none"
      >
        <Trash2 className="w-20 h-20 transform -rotate-45" />
      </motion.div>

      {/* Animated Sun Rays */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-10 right-10 text-yellow-300/20 pointer-events-none"
      >
        <Sun className="w-24 h-24" />
      </motion.div>

      {/* Floating Leaves */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute text-green-200/40 pointer-events-none"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + i * 8}%`
          }}
        >
          <Leaf className="w-8 h-8" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Activity className="w-16 h-16 text-white mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <span>🌱</span>
            <span>Eco Activities</span>
            <span>🌍</span>
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto">
            Join the green revolution! Every action counts towards a sustainable future.
          </p>
        </motion.div>

        {/* Activity Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto mb-12"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform transition-all duration-300 hover:shadow-3xl">
                {/* Icon and Title */}
                <div className="flex items-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-4xl mr-4"
                  >
                    {activity.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                </div>

                {/* Description */}
                <p className="text-white/80 mb-4 text-sm leading-relaxed">{activity.description}</p>

                {/* Points */}
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full shadow-lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    +{activity.points || 0} pts
                  </motion.div>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Activity Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Send className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Submit Your Eco Activity
              </h2>
              <p className="text-white/80 text-lg">
                Share your environmental actions and earn points!
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="relative"
              >
                <input
                  type="text"
                  name="activityName"
                  placeholder="Describe your eco activity (e.g., Planted 2 trees in the park)"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-lg"
                  required
                  disabled={loading}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <Activity className="w-6 h-6 text-white/60" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="w-6 h-6" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Submit Activity</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/80 text-sm"
                >
                  🌱 Processing your eco activity...
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Eco Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 max-w-4xl mx-auto">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <TreePine className="w-16 h-16 text-green-300 mx-auto mb-4" />
            </motion.div>
            <p className="text-white/90 text-xl italic leading-relaxed">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </p>
            <p className="text-white/70 text-sm mt-4">- Chinese Proverb</p>
          </div>
        </motion.div>
      </div>

      {/* Level Up Popup */}
      <LevelUpPopup 
        show={showLevelUpPopup} 
        levelData={levelUpData}
        onClose={() => setShowLevelUpPopup(false)}
      />

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        toastStyle={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}
      />
    </div>
  );
}

export default Activities;
// src/pages/Activities.jsx
// import React, { useEffect, useState } from "react";
// import Button from "../components/Button";
// import ActivityCard from "../components/ActivityCard";
// import api from "../api";

// function Activities() {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const didYouKnow = {
//     title: "Did You Know?",
//     description:
//       "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 463 gallons of oil! 🌎",
//     points: 0,
//     icon: "🌿",
//   };

//   // Fetch activities from backend
//   const fetchActivities = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/activities"); // no need to manually attach headers

//       const mappedActivities = res.data.map((a) => ({
//         title: a.type,
//         description: a.description,
//         points: a.points,
//         icon: "✅",
//       }));

//       setActivities([...mappedActivities, didYouKnow]);
//       setError(null);
//     } catch (err) {
//       console.error("❌ Failed to fetch activities:", err);
//       setError("Failed to load activities. Showing fallback data.");
//       setActivities([
//         {
//           title: "Plant a Tree",
//           description: "Contribute to greenery by planting a tree in your area.",
//           points: 50,
//           icon: "🌳",
//         },
//         {
//           title: "Use Bicycle",
//           description: "Ride a bicycle instead of motor vehicles to reduce pollution.",
//           points: 30,
//           icon: "🚴",
//         },
//         didYouKnow,
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   // Handle activity submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const activityName = e.target.activityName.value;

//     try {
//       await api.post("/activities", {
//         type: activityName,
//         description: activityName,
//         points: 50,
//       });

//       alert("✅ Activity submitted successfully!");
//       e.target.reset();
//       fetchActivities(); // refresh list
//     } catch (err) {
//       console.error("❌ Failed to submit activity:", err.response || err.message);
//       alert("Failed to submit activity. Try again.");
//     }
//   };

//   if (loading) return <p className="p-6 text-center">Loading activities...</p>;
//   if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
//         🌱 Eco Activities
//       </h1>

//       {/* Activity Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
//         {activities.map((activity, index) => (
//           <ActivityCard
//             key={index}
//             title={activity.title}
//             description={activity.description}
//             points={activity.points}
//             icon={activity.icon}
//           />
//         ))}
//       </div>

//       {/* Submit Activity Form */}
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
//           Submit Your Eco Activity 🌍
//         </h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="activityName"
//             placeholder="Activity Name (e.g. Planted 2 trees)"
//             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//             required
//           />
//           <div className="text-center">
//             <Button text="Submit Activity" type="submit" />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Activities;
