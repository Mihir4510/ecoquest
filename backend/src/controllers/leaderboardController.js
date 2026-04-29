import User from "../models/user.js";

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    // Fetch only students, sorted by points (highest first)
    const users = await User.find({ role: "student" })
      .sort({ points: -1 })
      .select("name email points level levelName levelMessage streakCount stats"); // include level and streak data

    if (!users || users.length === 0) {
      return res.status(200).json([]); // return empty array if no students
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};
