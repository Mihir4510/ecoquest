import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  // Add a check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined in environment variables!");
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// REGISTER User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("📩 Incoming REGISTER request:", { name, email });

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (ensure pre-save middleware runs)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    await user.save(); // ✅ explicitly save

    console.log("✅ User registered successfully:", user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ registerUser error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};


// LOGIN User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("📩 Incoming LOGIN request:", email);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.warn("⚠️ No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      console.log("✅ User logged in:", user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        token: generateToken(user._id),
      });
    } else {
      console.warn("⚠️ Invalid password for email:", email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("❌ loginUser error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// GET User Profile (No changes needed for the immediate issue)
export const getUserProfile = async (req, res) => {
  try {
    console.log("📩 Fetching profile for user:", req.user._id);
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      console.warn("⚠️ No user found with ID:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ Found user:", {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points || 0,
      stats: user.stats || { treesPlanted: 0, activitiesCompleted: 0 },
      badges: user.badges || [],
      recentActivities: user.recentActivities || [],
    });
  } catch (error) {
    console.error("❌ getUserProfile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE User Profile (No changes needed for the immediate issue)
export const updateProfile = async (req, res) => {
  try {
    console.log("📩 Updating profile for user:", req.user?._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      console.warn("⚠️ User not found during update:", req.user?._id);
      return res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email?.toLowerCase() || user.email;
    if (req.body.password) {
      console.log("🔑 Password update requested");
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    console.log("✅ User updated:", updatedUser._id);
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      points: updatedUser.points,
      stats: updatedUser.stats,
      badges: updatedUser.badges,
      recentActivities: updatedUser.recentActivities,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("❌ updateProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};