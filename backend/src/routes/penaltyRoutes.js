import express from 'express';
import {
  applyInactivityPenalty,
  reportUnsustainableActivity,
  applyBehaviorPenalty,
  applyStreakBreakPenalty,
  applyChallengeFailurePenalty,
  getPenaltyLog,
  calculateEcoHealth,
  completeRecoveryChallenge,
  getAllPenalties
} from '../controllers/penaltyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All penalty routes are protected
router.use(protect);

// User penalty routes
router.post('/inactivity/:userId?', applyInactivityPenalty);
router.post('/unsustainable/:userId?', reportUnsustainableActivity);
router.post('/behavior/:userId?', applyBehaviorPenalty);
router.post('/streak-break/:userId?', applyStreakBreakPenalty);
router.post('/challenge-failure/:userId?', applyChallengeFailurePenalty);

// User penalty information
router.get('/log/:userId?', getPenaltyLog);
router.get('/eco-health/:userId?', calculateEcoHealth);

// Recovery system
router.post('/recovery/complete', completeRecoveryChallenge);

// Admin routes
router.get('/admin/all', getAllPenalties);

export default router;

