// import express from "express";
// import { getLeaderboard } from "../controllers/leaderboardController.js";

// const router = express.Router();

// router.get("/", getLeaderboard);

// export default router;
import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// ✅ Fetch leaderboard (sorted users)
router.get("/", getLeaderboard);

export default router;
