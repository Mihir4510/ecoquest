// // src/pages/Profile.jsx
// import React, { useEffect, useState } from "react";
// import Button from "../components/Button";
// import StatsCard from "../components/StatsCard";
// import api from "../api";

// function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("User not authenticated");

//         const res = await api.get("/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(res.data);
//         setName(res.data.name);
//         setEmail(res.data.email);
//       } catch (err) {
//         console.error("❌ Profile fetch error:", err);
//         setError(err.response?.data?.message || err.message || "Failed to load profile.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleUpdate = async () => {
//     setUpdating(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.put(
//         "/users/profile",
//         { name, email, password },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setUser(res.data);
//       setEditMode(false);
//       setPassword(""); // clear password input
//       localStorage.setItem("token", res.data.token); // update token
//     } catch (err) {
//       console.error("❌ Profile update error:", err);
//       setError(err.response?.data?.message || "Update failed.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) return <p className="p-6 text-center">Loading profile...</p>;
//   if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       {/* User Info */}
//       <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="w-24 h-24 flex items-center justify-center text-4xl bg-green-100 rounded-full border-2 border-green-500">
//             👤
//           </div>
//           <div>
//             {editMode ? (
//               <>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="border p-1 rounded mb-2 w-full"
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="border p-1 rounded mb-2 w-full"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="border p-1 rounded mb-2 w-full"
//                 />
//               </>
//             ) : (
//               <>
//                 <h1 className="text-2xl font-bold text-green-700">{user.name}</h1>
//                 <p className="text-gray-600 text-lg">Eco Points: {user.points}</p>
//               </>
//             )}
//           </div>
//         </div>
//         <div className="mt-4 md:mt-0">
//           {editMode ? (
//             <Button
//               text={updating ? "Saving..." : "Save"}
//               onClick={handleUpdate}
//             />
//           ) : (
//             <Button text="Edit Profile" onClick={() => setEditMode(true)} />
//           )}
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//         <StatsCard
//           label="Trees Planted"
//           value={user.stats?.treesPlanted || 0}
//           icon="🌳"
//         />
//         <StatsCard
//           label="Activities Completed"
//           value={user.stats?.activitiesCompleted || 0}
//           icon="✅"
//         />
//       </div>

//       {/* Badges */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold text-green-700 mb-4">
//           Badges Earned 🏅
//         </h2>
//         <div className="flex flex-wrap gap-3">
//           {user.badges?.map((badge, idx) => (
//             <span
//               key={idx}
//               className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium hover:bg-green-200 transition"
//             >
//               {badge}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Recent Activities */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold text-green-700 mb-4">
//           Recent Activities 📋
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {user.recentActivities?.map((act, idx) => (
//             <div
//               key={idx}
//               className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
//             >
//               <div className="text-5xl mb-4">{act.icon}</div>
//               <h3 className="text-lg font-semibold text-green-700 mb-2">{act.name}</h3>
//               <p className="text-gray-500 text-sm">{act.date}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;


// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Flame, 
  Trophy, 
  Star, 
  TrendingUp, 
  Wallet, 
  Edit3, 
  Save, 
  X,
  User,
  Mail,
  Lock,
  Award,
  Calendar,
  Activity
} from "lucide-react";
import Button from "../components/Button";
import StatsCard from "../components/StatsCard";
import api from "../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        "/users/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setEditMode(false);
      setPassword(""); // clear password
      localStorage.setItem("token", res.data.token);

      // Update leaderboard after profile changes
      await api.get("/leaderboard/update"); // optional, depends on backend
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="text-slate-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Profile</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchProfile}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-blue-200 text-9xl opacity-10">🌿</div>
        <div className="absolute bottom-20 right-10 text-indigo-200 text-9xl opacity-10">🍃</div>
        <div className="absolute top-1/2 left-1/4 text-slate-200 text-7xl opacity-5">🌱</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Profile Dashboard</h1>
          <p className="text-slate-600">Manage your eco-journey and track your progress</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            {/* Profile Info */}
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white shadow-lg">
                  {user.name?.charAt(0).toUpperCase() || "👤"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <Activity className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-slate-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-slate-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-slate-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{user.name}</h2>
                    <p className="text-slate-600 text-lg mb-3">{user.email}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-slate-700">{user.points || 0} Eco Points</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl">
                        <Trophy className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-slate-700">Level {user.level || 1}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setName(user.name);
                      setEmail(user.email);
                      setPassword("");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/rewards-wallet')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Rewards Wallet</span>
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            label="Eco Points" 
            value={user.points || 0} 
            icon="⭐" 
            color="from-yellow-400 to-orange-500"
          />
          <StatsCard 
            label="Level" 
            value={user.level || 1} 
            icon="🏆" 
            color="from-green-400 to-emerald-500"
          />
          <StatsCard 
            label="Activities" 
            value={user.stats?.activitiesCompleted || 0} 
            icon="✅" 
            color="from-blue-400 to-indigo-500"
          />
          <StatsCard 
            label="Trees Planted" 
            value={user.stats?.treesPlanted || 0} 
            icon="🌳" 
            color="from-emerald-400 to-green-500"
          />
        </div>

        {/* Level and Streak Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-8 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-800">Current Level</h3>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-4">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-6xl">{user.levelName?.split(' ')[0] || '🌱'}</span>
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-blue-700">
                    {user.levelName || '🌱 Seed'}
                  </h4>
                  <p className="text-slate-600">Level {user.level || 1}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800 italic">
                "{user.levelMessage || 'You started your green journey!'}"
              </p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-lg p-8 border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-orange-800">Eco Streak</h3>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
                  <span className="text-6xl font-bold text-orange-600">
                    {user.streakCount || 0}
                  </span>
                </div>
                <p className="text-slate-600 font-medium text-lg">Day Streak</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-400">
              <p className="text-sm text-orange-800">
                {user.streakCount > 0 
                  ? `🔥 Keep it up! Complete an activity daily to maintain your streak!`
                  : `Start your streak by completing an activity today!`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-800">Achievements & Badges</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {user.badges?.length > 0 ? (
              user.badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-6 py-3 rounded-xl font-medium border border-blue-200 hover:shadow-lg transition-all"
                >
                  <Award className="w-5 h-5" />
                  <span>{badge}</span>
                </span>
              ))
            ) : (
              <div className="text-center w-full py-8">
                <div className="text-6xl mb-4">🏅</div>
                <p className="text-slate-600 text-lg">Complete activities to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-slate-800">Recent Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.recentActivities?.length > 0 ? (
              user.recentActivities.map((act, idx) => (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 group"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{act.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{act.name}</h3>
                    <p className="text-slate-500 text-sm">{act.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Recent Activities</h3>
                <p className="text-slate-600">Start your eco-journey by completing some activities!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
