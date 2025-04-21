import express from 'express';
import { getRandomQuote, getDailyQuote } from '../controllers/quotesController.js';

const router = express.Router();

// Public routes - no token verification needed
router.get('/random', getRandomQuote);
router.get('/daily', getDailyQuote);

export default router;