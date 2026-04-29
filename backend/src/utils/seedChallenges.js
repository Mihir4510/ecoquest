import Challenge from "../models/Challenge.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const sampleChallenges = [
  {
    title: "Green Beginner",
    description: "Complete your first eco-friendly activities and earn your first badge!",
    icon: "🌱",
    targetPoints: 50,
    targetActivities: 3,
    duration: 7,
    reward: {
      points: 20,
      badge: "🌱 Green Starter"
    },
    difficulty: "easy"
  },
  {
    title: "Weekly Eco Warrior",
    description: "Earn 100 points in 7 days through consistent eco activities!",
    icon: "⚔️",
    targetPoints: 100,
    targetActivities: 5,
    duration: 7,
    reward: {
      points: 50,
      badge: "⚔️ Eco Warrior"
    },
    difficulty: "medium"
  },
  {
    title: "Tree Planter Master",
    description: "Plant trees and earn 150 points to become a Tree Master!",
    icon: "🌳",
    targetPoints: 150,
    targetActivities: 10,
    duration: 14,
    reward: {
      points: 75,
      badge: "🌳 Tree Master"
    },
    difficulty: "medium"
  },
  {
    title: "Sustainability Champion",
    description: "The ultimate challenge: 300 points in 30 days!",
    icon: "🏆",
    targetPoints: 300,
    targetActivities: 20,
    duration: 30,
    reward: {
      points: 150,
      badge: "🏆 Champion"
    },
    difficulty: "hard"
  },
  {
    title: "Zero Waste Hero",
    description: "Focus on recycling and waste reduction activities!",
    icon: "♻️",
    targetPoints: 80,
    targetActivities: 7,
    duration: 10,
    reward: {
      points: 40,
      badge: "♻️ Zero Waste Hero"
    },
    difficulty: "easy"
  },
  {
    title: "Carbon Reducer",
    description: "Reduce your carbon footprint with sustainable activities!",
    icon: "🌍",
    targetPoints: 200,
    targetActivities: 15,
    duration: 21,
    reward: {
      points: 100,
      badge: "🌍 Carbon Reducer"
    },
    difficulty: "hard"
  }
];

const seedChallenges = async () => {
  try {
    await connectDB();

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log("✅ Cleared existing challenges");

    // Insert sample challenges
    const challenges = await Challenge.insertMany(sampleChallenges);
    console.log(`✅ ${challenges.length} challenges seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding challenges:", error);
    process.exit(1);
  }
};

seedChallenges();

