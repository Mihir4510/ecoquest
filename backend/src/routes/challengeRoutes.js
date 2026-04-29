import express from "express";
import {
  getAllChallenges,
  getUserChallenges,
  joinChallenge,
  createChallenge
} from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - get all challenges
router.get("/", getAllChallenges);

// Protected routes
router.get("/user", protect, getUserChallenges);
router.post("/:challengeId/join", protect, joinChallenge);
router.post("/create", protect, createChallenge); // For admin/testing

export default router;

