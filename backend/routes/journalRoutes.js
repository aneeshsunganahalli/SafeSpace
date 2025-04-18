import express from 'express';
import  verifyToken  from '../middlewares/verifyToken.js';
import {
  getJournalEntries,
  createJournalEntry,
  getJournalInsights,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../controllers/journalController.js';

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Journal entries routes
router.get('/', getJournalEntries);
router.post('/', createJournalEntry);
router.get('/insights', getJournalInsights);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;