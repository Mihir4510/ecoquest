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
import { calculateLevel, checkLevelUp, calculateStreak } from "../utils/levelCalculator.js";
import { updateChallengeProgress } from "./challengeController.js";

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

    // 2. Update the user: add points, update stats, streak, level
    const user = await User.findById(req.user._id);

    if (user) {
      const oldPoints = user.points;
      const newPoints = oldPoints + activityPoints;
      
      // Update points
      user.points = newPoints;
      user.stats.activitiesCompleted = (user.stats.activitiesCompleted || 0) + 1;
      
      // Update specific stats based on activity type
      if (type.toLowerCase().includes('tree') || type.toLowerCase().includes('plant')) {
        // Extract number of trees from description or default to 1
        const treeMatch = description.match(/(\d+)/);
        const treesPlanted = treeMatch ? parseInt(treeMatch[1]) : 1;
        user.stats.treesPlanted = (user.stats.treesPlanted || 0) + treesPlanted;
      }
      
      if (type.toLowerCase().includes('recycle') || type.toLowerCase().includes('waste')) {
        // Extract amount of waste from description or default to 1
        const wasteMatch = description.match(/(\d+)/);
        const wasteRecycled = wasteMatch ? parseInt(wasteMatch[1]) : 1;
        user.stats.wasteRecycled = (user.stats.wasteRecycled || 0) + wasteRecycled;
      }

      // Calculate and update streak
      const streakResult = calculateStreak(user.lastActivityDate);
      
      if (streakResult.streakCount === "increment") {
        user.streakCount = (user.streakCount || 0) + 1;
      } else if (streakResult.streakCount !== null) {
        user.streakCount = streakResult.streakCount;
      }
      // If null, keep current streak (same day activity)
      
      user.lastActivityDate = new Date();

      // Check for level up
      const levelUpResult = checkLevelUp(oldPoints, newPoints);
      let badgeUnlocked = false;
      
      if (levelUpResult.leveledUp) {
        user.level = levelUpResult.newLevel.level;
        user.levelName = levelUpResult.newLevel.levelName;
        user.levelMessage = levelUpResult.newLevel.levelMessage;
        
        // Add badge if not already present
        const badgeName = levelUpResult.newLevel.levelName;
        if (!user.badges.includes(badgeName)) {
          user.badges.push(badgeName);
          badgeUnlocked = true;
        }
      } else {
        // Update level data even if not leveling up (for consistency)
        const currentLevel = calculateLevel(newPoints);
        user.level = currentLevel.level;
        user.levelName = currentLevel.levelName;
        user.levelMessage = currentLevel.levelMessage;
      }

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

      // Update challenge progress
      await updateChallengeProgress(req.user._id, activityPoints);

      // Send response with level up and streak info
      res.status(201).json({
        activity,
        levelUp: levelUpResult.leveledUp ? {
          newLevel: levelUpResult.newLevel,
          badgeUnlocked
        } : null,
        streak: {
          count: user.streakCount,
          message: streakResult.message,
          broken: streakResult.streakBroken
        },
        user: {
          points: user.points,
          level: user.level,
          levelName: user.levelName,
          streakCount: user.streakCount
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
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
