// import Activity from "../models/Activity.js";
// import User from "../models/user.js";

// // Add a new activity for a user
// export const addActivity = async (req, res) => {
//   try {
//     const { type, description, points } = req.body;

//     if (!type) {
//       return res.status(400).json({ message: "Activity type is required" });
//     }

//     const activityPoints = points || 0;

//     const activity = await Activity.create({
//       user: req.user._id,
//       type,
//       description: description || "",
//       points: activityPoints,
//       verified: false,
//     });

//     // Increment user's points
//     await User.findByIdAndUpdate(req.user._id, { $inc: { points: activityPoints } });

//     res.status(201).json(activity);
//   } catch (error) {
//     console.error("❌ addActivity error:", error);
//     res.status(500).json({ message: "Server error. Please try again." });
//   }
// };

// // Get all activities of the logged-in user
// export const getUserActivities = async (req, res) => {
//   try {
//     const activities = await Activity.find({ user: req.user._id })
//       .sort({ createdAt: -1 }) // Most recent first
//       .lean(); // returns plain JS objects

//     res.json(activities);
//   } catch (error) {
//     console.error("❌ getUserActivities error:", error);
//     res.status(500).json({ message: "Server error. Please try again." });
//   }
// };
import Activity from "../models/Activity.js";
import User from "../models/user.js";

// Helper function for activity icons
const getActivityIcon = (type) => {
  const map = {
    "Tree Planting": "🌳",
    "Cycling": "🚴",
    "Recycling": "♻️",
    "Clean-up Drive": "🧹",
    "Energy Saving": "💡",
  };
  return map[type] || "✅"; // default if not matched
};

// Add a new activity for a user
export const addActivity = async (req, res) => {
  try {
    const { type, description, points } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Activity type is required" });
    }

    const activityPoints = points || 0;

    // 1. Create the activity
    const activity = await Activity.create({
      user: req.user._id,
      type,
      description: description || "",
      points: activityPoints,
      verified: false,
    });

    // 2. Update the user: add points, update stats, and push recent activity
    const user = await User.findById(req.user._id);

    if (user) {
      user.points += activityPoints;
      user.stats.activitiesCompleted = (user.stats.activitiesCompleted || 0) + 1;

      // Push to recentActivities with icon
      user.recentActivities.unshift({
        name: type,
        icon: getActivityIcon(type),
        date: new Date().toLocaleDateString(),
      });

      if (user.recentActivities.length > 5) {
        user.recentActivities.pop();
      }

      await user.save();
    }

    res.status(201).json(activity);
  } catch (error) {
    console.error("❌ addActivity error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get all activities of the logged-in user
export const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    res.json(activities);
  } catch (error) {
    console.error("❌ getUserActivities error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
