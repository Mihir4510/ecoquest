import express from 'express';
import { getCampusStats, getEcoTips, recalculateUserStats } from '../controllers/statsController.js';

const router = express.Router();

// Public routes for stats
router.get('/', getCampusStats);
router.get('/tips', getEcoTips);
router.post('/recalculate', recalculateUserStats);

export default router;
