import express from 'express';
import { 
  getEcoAdvice, 
  getActivitySuggestions, 
  verifyActivity, 
  generateChallenges, 
  calculateCarbonImpact,
  chatWithAI 
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All AI routes are protected
router.use(protect);

// AI Chatbot endpoints
router.post('/advice', getEcoAdvice);
router.post('/suggestions', getActivitySuggestions);
router.post('/verify', verifyActivity);
router.post('/challenges', generateChallenges);
router.post('/carbon-impact', calculateCarbonImpact);
router.post('/chat', chatWithAI);

export default router;
