import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  submitPlastic,
  getUserSubmissions,
  getPlasticChampions,
  getImpactStats,
  getAllSubmissions,
  updateSubmissionStatus
} from "../controllers/plasticBuybackController.js";
import { protect } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "plastic-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Public routes
router.get("/champions", getPlasticChampions);
router.get("/impact", getImpactStats);

// Protected routes
router.post("/submit", protect, upload.single("plasticImage"), submitPlastic);
router.get("/my-submissions", protect, getUserSubmissions);

// Admin routes (protected)
router.get("/all", protect, getAllSubmissions);
router.put("/:submissionId/status", protect, updateSubmissionStatus);

export default router;

