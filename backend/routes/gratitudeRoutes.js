import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import {
  getTodaysGratitude,
  getRecentGratitude,
  createOrUpdateGratitude
} from '../controllers/gratitudeController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Gratitude routes
router.get('/today', getTodaysGratitude);
router.get('/recent', getRecentGratitude);
router.post('/', createOrUpdateGratitude);

export default router;