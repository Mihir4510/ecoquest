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
import Button from "../components/Button";
import StatsCard from "../components/StatsCard";
import api from "../api";

function Profile() {
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

  if (loading) return <p className="p-6 text-center">Loading profile...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 flex items-center justify-center text-4xl bg-green-100 rounded-full border-2 border-green-500">
            👤
          </div>
          <div>
            {editMode ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-1 rounded mb-2 w-full"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-1 rounded mb-2 w-full"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-1 rounded mb-2 w-full"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-green-700">{user.name}</h1>
                <p className="text-gray-600 text-lg">Eco Points: {user.points}</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          {editMode ? (
            <Button text={updating ? "Saving..." : "Save"} onClick={handleUpdate} />
          ) : (
            <Button text="Edit Profile" onClick={() => setEditMode(true)} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <StatsCard label="Trees Planted" value={user.stats?.treesPlanted || 0} icon="🌳" />
        <StatsCard label="Activities Completed" value={user.stats?.activitiesCompleted || 0} icon="✅" />
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Badges Earned 🏅</h2>
        <div className="flex flex-wrap gap-3">
          {user.badges?.map((badge, idx) => (
            <span key={idx} className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Recent Activities 📋</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.recentActivities?.map((act, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{act.icon}</div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">{act.name}</h3>
              <p className="text-gray-500 text-sm">{act.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
