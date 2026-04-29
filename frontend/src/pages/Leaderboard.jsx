// // // src/pages/Leaderboard.jsx
// // import React, { useEffect, useState } from "react";
// // import api from "../api";

// // function Leaderboard() {
// //   const [students, setStudents] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const getRankEmoji = (index) => {
// //     if (index === 0) return "🥇";
// //     if (index === 1) return "🥈";
// //     if (index === 2) return "🥉";
// //     return `${index + 1}.`;
// //   };

// //   const fetchLeaderboard = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       // Fetch leaderboard from backend
// //       const res = await api.get("/leaderboard");

// //       // Sort by points descending
// //       const sortedStudents = res.data.sort((a, b) => b.points - a.points);

// //       setStudents(sortedStudents);
// //     } catch (err) {
// //       console.error("❌ Failed to fetch leaderboard:", err);
// //       setError("Failed to load leaderboard. Showing fallback data.");

// //       // Fallback static data
// //       setStudents([
// //         { name: "Mihir", points: 500 },
// //         { name: "Payal", points: 420 },
// //         { name: "Kabir", points: 380 },
// //         { name: "Nikki", points: 350 },
// //         { name: "Kush", points: 350 },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLeaderboard();

// //     // Optional: refresh leaderboard every 15 seconds
// //     const interval = setInterval(fetchLeaderboard, 15000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   if (loading) return <p className="p-6 text-center">Loading leaderboard...</p>;
// //   if (error)
// //     return <p className="p-6 text-center text-red-500">{error}</p>;

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-50">
// //       <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
// //         Leaderboard 🏆
// //       </h2>
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {students.map((student, index) => (
// //           <div
// //             key={index}
// //             className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
// //           >
// //             <div className="flex items-center space-x-3">
// //               <span className="text-2xl">{getRankEmoji(index)}</span>
// //               <div>
// //                 <h3 className="text-lg font-bold text-green-700">{student.name}</h3>
// //                 <p className="text-gray-500">{student.points} pts</p>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Leaderboard;
// // src/pages/Leaderboard.jsx
// import React, { useEffect, useState } from "react";
// import { 
//   Trophy, 
//   Leaf, 
//   TreePine, 
//   Recycle, 
//   Droplets, 
//   Zap, 
//   Star,
//   Crown,
//   Flame,
//   Target,
//   Users,
//   Award,
//   TrendingUp
// } from "lucide-react";
// import api from "../api";
// import ChallengesSection from "../components/ChallengesSection";
// import EcoPointsSystem from "../components/EcoPointsSystem";

// function Leaderboard() {
//   const [students, setStudents] = useState([]);
//   const [communityStats, setCommunityStats] = useState({
//     totalTreesPlanted: 0,
//     totalWasteRecycled: 0,
//     totalCO2Saved: 0,
//     totalParticipants: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentQuote, setCurrentQuote] = useState(0);
//   const [currentUser, setCurrentUser] = useState(null);

//   const sustainabilityQuotes = [
//     "Small acts, when multiplied, can change the world. 🌍",
//     "The Earth does not belong to us; we belong to the Earth. 🌱",
//     "In every walk with nature, one receives far more than they seek. 🌿",
//     "The best time to plant a tree was 20 years ago. The second best time is now. 🌳",
//     "We do not inherit the earth from our ancestors; we borrow it from our children. 🌎",
//     "Be the change you wish to see in the world. ✨"
//   ];

//   // Badge system
//   const getBadges = (points) => {
//     const badges = [];
//     if (points >= 1000) badges.push({ icon: "👑", name: "Eco King/Queen", color: "text-yellow-600" });
//     if (points >= 500) badges.push({ icon: "🌳", name: "Tree Guardian", color: "text-green-600" });
//     if (points >= 300) badges.push({ icon: "♻️", name: "Recycling Hero", color: "text-blue-600" });
//     if (points >= 200) badges.push({ icon: "💧", name: "Water Saver", color: "text-cyan-600" });
//     if (points >= 100) badges.push({ icon: "🌱", name: "Eco Warrior", color: "text-emerald-600" });
//     if (points >= 50) badges.push({ icon: "⭐", name: "Green Star", color: "text-lime-600" });
//     return badges;
//   };

//   // Level system
//   const getLevel = (points) => {
//     if (points >= 1000) return { name: "Forest Keeper", icon: "🌲", color: "text-green-800" };
//     if (points >= 500) return { name: "Tree", icon: "🌳", color: "text-green-700" };
//     if (points >= 200) return { name: "Sapling", icon: "🌿", color: "text-green-600" };
//     return { name: "Seed", icon: "🌱", color: "text-green-500" };
//   };

//   // Visual progress - growing tree height
//   const getTreeHeight = (points) => {
//     const maxHeight = 80; // max height in pixels
//     const height = Math.min((points / 1000) * maxHeight, maxHeight);
//     return `${height}px`;
//   };

//   // Rank emojis with eco theme
//   const getRankEmoji = (index) => {
//     if (index === 0) return "🥇";
//     if (index === 1) return "🥈";
//     if (index === 2) return "🥉";
//     if (index < 10) return "🏅";
//     return "🌱";
//   };

//   // Streak calculation (mock data for now)
//   const getStreak = (student) => {
//     const days = Math.floor(Math.random() * 30) + 1;
//     return {
//       days,
//       type: days > 7 ? "🔥" : "⭐",
//       description: `${days}-day eco streak`
//     };
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/leaderboard");
//       const sortedStudents = res.data.sort((a, b) => b.points - a.points);
//       setStudents(sortedStudents);
//       setError(null);
//     } catch (err) {
//       console.error("Failed to fetch leaderboard:", err);
//       setError("Failed to load leaderboard. Showing fallback data.");
//       setStudents([
//         { name: "Mihir", points: 850, activities: 25 },
//         { name: "Payal", points: 720, activities: 22 },
//         { name: "Kabir", points: 680, activities: 20 },
//         { name: "Nikki", points: 550, activities: 18 },
//         { name: "Kush", points: 480, activities: 15 },
//         { name: "Sarah", points: 420, activities: 12 },
//         { name: "Alex", points: 380, activities: 10 },
//         { name: "Emma", points: 320, activities: 8 },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCommunityStats = async () => {
//     try {
//       const res = await api.get("/stats");
//       setCommunityStats({
//         totalTreesPlanted: res.data.treesPlanted || 0,
//         totalWasteRecycled: res.data.wasteRecycled || 0,
//         totalCO2Saved: Math.floor((res.data.treesPlanted || 0) * 22), // 22kg CO2 per tree
//         totalParticipants: res.data.totalStudents || 0
//       });
//     } catch (err) {
//       console.error("Failed to fetch community stats:", err);
//       setCommunityStats({
//         totalTreesPlanted: 45,
//         totalWasteRecycled: 125,
//         totalCO2Saved: 990,
//         totalParticipants: 8
//       });
//     }
//   };

//   // Rotate quotes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentQuote((prev) => (prev + 1) % sustainabilityQuotes.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     fetchLeaderboard();
//     fetchCommunityStats();
    
//     // Get current user from localStorage
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         setCurrentUser(user);
//       } catch (e) {
//         console.error("Error parsing user:", e);
//       }
//     }
//   }, []);

//   // Auto-refresh every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchLeaderboard();
//       fetchCommunityStats();
//     }, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
//           <p className="text-green-700 font-semibold">Loading Eco Leaderboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <button
//             onClick={fetchLeaderboard}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
//         <div className="container mx-auto px-4 text-center">
//           <div className="flex items-center justify-center space-x-3 mb-4">
//             <Trophy className="w-8 h-8" />
//             <h1 className="text-4xl font-bold">Eco Leaderboard</h1>
//             <Trophy className="w-8 h-8" />
//           </div>
//           <p className="text-xl opacity-90 mb-6">
//             Celebrating our campus sustainability champions! 🌱
//           </p>
          
//           {/* Inspirational Quote */}
//           <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
//             <p className="text-lg font-medium italic">
//               "{sustainabilityQuotes[currentQuote]}"
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Community Impact Stats */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
//           <h2 className="text-2xl font-bold text-center text-green-800 mb-6 flex items-center justify-center space-x-2">
//             <Users className="w-6 h-6" />
//             <span>Collective Impact</span>
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center p-4 bg-green-50 rounded-xl">
//               <TreePine className="w-8 h-8 mx-auto text-green-600 mb-2" />
//               <h3 className="text-2xl font-bold text-green-700">{communityStats.totalTreesPlanted}</h3>
//               <p className="text-sm text-green-600">Trees Planted</p>
//             </div>
//             <div className="text-center p-4 bg-blue-50 rounded-xl">
//               <Recycle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
//               <h3 className="text-2xl font-bold text-blue-700">{communityStats.totalWasteRecycled}kg</h3>
//               <p className="text-sm text-blue-600">Waste Recycled</p>
//             </div>
//             <div className="text-center p-4 bg-orange-50 rounded-xl">
//               <Zap className="w-8 h-8 mx-auto text-orange-600 mb-2" />
//               <h3 className="text-2xl font-bold text-orange-700">{communityStats.totalCO2Saved}kg</h3>
//               <p className="text-sm text-orange-600">CO₂ Saved</p>
//             </div>
//             <div className="text-center p-4 bg-purple-50 rounded-xl">
//               <Users className="w-8 h-8 mx-auto text-purple-600 mb-2" />
//               <h3 className="text-2xl font-bold text-purple-700">{communityStats.totalParticipants}</h3>
//               <p className="text-sm text-purple-600">Participants</p>
//             </div>
//           </div>
//         </div>

//         {/* Eco-Points System */}
//         <EcoPointsSystem />

//         {/* Challenges Section */}
//         <ChallengesSection />

//         {/* Leaderboard */}
//         <div className="space-y-4">
//           {students.map((student, index) => {
//             const level = getLevel(student.points);
//             const badges = getBadges(student.points);
//             const streak = getStreak(student);
//             const treeHeight = getTreeHeight(student.points);
//             const isCurrentUser = currentUser && (student._id === currentUser._id || student.email === currentUser.email);
            
//             return (
//               <div
//                 key={student._id || index}
//                 className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 ${
//                   index < 3 ? 'ring-2 ring-yellow-400' : ''
//                 } ${
//                   isCurrentUser ? 'ring-4 ring-green-500 bg-gradient-to-r from-green-50 to-emerald-50' : ''
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   {/* Left side - Rank and Visual Tree */}
//                   <div className="flex items-center space-x-4">
//                     <div className="text-center">
//                       <div className="text-3xl mb-1">{getRankEmoji(index)}</div>
//                       <div className="text-sm font-bold text-gray-600">#{index + 1}</div>
//                     </div>
                    
//                     {/* Growing Tree Visual */}
//                     <div className="flex items-end space-x-2">
//                       <div className="flex flex-col items-center">
//                         <div className="text-2xl mb-1">{level.icon}</div>
//                         <div 
//                           className="bg-green-500 rounded-t-full transition-all duration-1000"
//                           style={{ 
//                             width: '20px', 
//                             height: treeHeight,
//                             minHeight: '10px'
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Center - User Info */}
//                   <div className="flex-1 mx-6">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
//                       {isCurrentUser && (
//                         <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
//                           YOU
//                         </span>
//                       )}
//                       {index < 3 && <Crown className="w-5 h-5 text-yellow-500" />}
//                     </div>
                    
//                     {/* Level and Points */}
//                     <div className="flex items-center space-x-4 mb-3">
//                       <div className={`flex items-center space-x-1 ${level.color}`}>
//                         <span className="text-sm font-semibold">{level.name}</span>
//                         <span>{level.icon}</span>
//                       </div>
//                       <div className="flex items-center space-x-1 text-green-600">
//                         <Leaf className="w-4 h-4" />
//                         <span className="font-bold">{student.points}</span>
//                         <span className="text-sm">Eco-Points</span>
//                       </div>
//                     </div>

//                     {/* Badges */}
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {badges.slice(0, 3).map((badge, badgeIndex) => (
//                         <span
//                           key={badgeIndex}
//                           className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${badge.color}`}
//                         >
//                           <span>{badge.icon}</span>
//                           <span>{badge.name}</span>
//                         </span>
//                       ))}
//                       {badges.length > 3 && (
//                         <span className="text-xs text-gray-500">+{badges.length - 3} more</span>
//                       )}
//                     </div>

//                     {/* Streak */}
//                     <div className="flex items-center space-x-1 text-orange-600">
//                       <Flame className="w-4 h-4" />
//                       <span className="text-sm font-medium">{streak.description}</span>
//                     </div>
//                   </div>

//                   {/* Right side - Stats */}
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-green-600 mb-1">
//                       {student.points}
//                     </div>
//                     <div className="text-sm text-gray-600 mb-2">
//                       {student.activities || 0} activities
//                     </div>
//                     <div className="flex items-center space-x-1 text-blue-600">
//                       <TrendingUp className="w-4 h-4" />
//                       <span className="text-sm">Active</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Motivational Footer */}
//         <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">
//             🌟 Every action counts towards a greener future!
//           </h3>
//           <p className="text-green-700">
//             Keep up the amazing work! Together, we're making a real difference for our planet.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Leaderboard;
