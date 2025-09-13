import express from "express";
import { addActivity, getUserActivities } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js"; // make sure folder name matches

const router = express.Router();

// @route   POST /api/activities
// @desc    Add a new activity for the logged-in user
// @access  Private
router.post("/", protect, addActivity);

// @route   GET /api/activities
// @desc    Get all activities of the logged-in user
// @access  Private
router.get("/", protect, getUserActivities);

export default router;
