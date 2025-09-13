// // src/pages/Leaderboard.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api";

// function Leaderboard() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getRankEmoji = (index) => {
//     if (index === 0) return "🥇";
//     if (index === 1) return "🥈";
//     if (index === 2) return "🥉";
//     return `${index + 1}.`;
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch leaderboard from backend
//       const res = await api.get("/leaderboard");

//       // Sort by points descending
//       const sortedStudents = res.data.sort((a, b) => b.points - a.points);

//       setStudents(sortedStudents);
//     } catch (err) {
//       console.error("❌ Failed to fetch leaderboard:", err);
//       setError("Failed to load leaderboard. Showing fallback data.");

//       // Fallback static data
//       setStudents([
//         { name: "Mihir", points: 500 },
//         { name: "Payal", points: 420 },
//         { name: "Kabir", points: 380 },
//         { name: "Nikki", points: 350 },
//         { name: "Kush", points: 350 },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaderboard();

//     // Optional: refresh leaderboard every 15 seconds
//     const interval = setInterval(fetchLeaderboard, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <p className="p-6 text-center">Loading leaderboard...</p>;
//   if (error)
//     return <p className="p-6 text-center text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
//         Leaderboard 🏆
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {students.map((student, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-2xl">{getRankEmoji(index)}</span>
//               <div>
//                 <h3 className="text-lg font-bold text-green-700">{student.name}</h3>
//                 <p className="text-gray-500">{student.points} pts</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Leaderboard;
// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leaderboard");
      const sortedStudents = res.data.sort((a, b) => b.points - a.points);
      setStudents(sortedStudents);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load leaderboard. Showing fallback data.");
      setStudents([
        { name: "Mihir", points: 500 },
        { name: "Payal", points: 420 },
        { name: "Kabir", points: 380 },
        { name: "Nikki", points: 350 },
        { name: "Kush", points: 350 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Optional: Refresh leaderboard every 5 seconds (auto-update new users)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000); // every 5 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="p-6 text-center">Loading leaderboard...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Leaderboard 🏆
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <div
            key={student._id || index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getRankEmoji(index)}</span>
              <div>
                <h3 className="text-lg font-bold text-green-700">{student.name}</h3>
                <p className="text-gray-500">{student.points} pts</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
