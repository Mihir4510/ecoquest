// src/pages/Activities.jsx
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import ActivityCard from "../components/ActivityCard";
import api from "../api";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Handle activity submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to submit an activity.");

    const activityName = e.target.activityName.value;

    try {
      await api.post(
        "/activities",
        { type: activityName, description: activityName, points: 50 },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert("Activity submitted successfully!");
      e.target.reset();

      // Refresh activities
      fetchActivities();
    } catch (err) {
      console.error("Failed to submit activity:", err.response || err.message);
      alert("Failed to submit activity. Try again.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading activities...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">🌱 Eco Activities</h1>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            title={activity.title}
            description={activity.description}
            points={activity.points}
            icon={activity.icon}
          />
        ))}
      </div>

      {/* Submit Activity Form */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Submit Your Eco Activity 🌍
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="activityName"
            placeholder="Activity Name (e.g. Planted 2 trees)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <div className="text-center">
            <Button text="Submit Activity" />
          </div>
        </form>
      </div>
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
