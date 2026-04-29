//  import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import activityRoutes from "./routes/activityRoutes.js";
// import leaderboardRoutes from "./routes/leaderboardRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import statsRoutes from "./routes/statsRoutes.js";
// import challengeRoutes from "./routes/challengeRoutes.js";
// import plasticBuybackRoutes from "./routes/plasticBuybackRoutes.js";
// import cors from "cors";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "../.env") });

// connectDB();

// const app = express();

// // Enable CORS with credentials
// app.use(
//   cors({
//     origin: "http://localhost:5173", // frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true, // ✅ Required to send cookies
//   })
// );

// // Parse JSON body
// app.use(express.json());

// // Serve uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // Debug logger
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// // Test route
// app.get("/", (req, res) => {
//   res.send("✅ Server is running!");
// });

// // API Routes
// app.use("/api/users", userRoutes);
// app.use("/api/activities", activityRoutes);
// app.use("/api/leaderboard", leaderboardRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/stats", statsRoutes);
// app.use("/api/challenges", challengeRoutes);
// app.use("/api/plastic-buyback", plasticBuybackRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Configs
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import plasticBuybackRoutes from "./routes/plasticBuybackRoutes.js";
import penaltyRoutes from "./routes/penaltyRoutes.js";

// ----------------- Setup -----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env safely
dotenv.config(); // assumes .env is in the same folder as server.js
console.log(
  "Gemini Key Loaded:",
  process.env.GEMINI_API_KEY ? " Yes" : " Missing"
);

// Connect MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Debug logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// ----------------- Test Route -----------------
app.get("/", (req, res) => {
  res.send(" EcoQuest Server is running!");
});

// ----------------- API Routes -----------------
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes); // Gemini chatbot
app.use("/api/stats", statsRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/plastic-buyback", plasticBuybackRoutes); // Google Vision ready
app.use("/api/penalties", penaltyRoutes); // Enhanced penalty system

// ----------------- Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
