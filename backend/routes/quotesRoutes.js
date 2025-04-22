import express from 'express';
import { getRandomQuote, getDailyQuote } from '../controllers/quotesController.js';

const router = express.Router();

// Public routes - no token verification needed
router.get('/random', getRandomQuote);
router.get('/daily', getDailyQuote);

// Make sure there are no malformed routes like router.get('/:') or router.get('/path/')

export default router;