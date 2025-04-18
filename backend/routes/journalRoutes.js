import express from 'express';
import  verifyToken  from '../middlewares/verifyToken.js';
import {
  getJournalEntries,
  createJournalEntry,
  getJournalInsights,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  reprocessJournalEntries,
  reprocessSingleEntry
} from '../controllers/journalController.js';

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Journal entries routes
router.get('/', getJournalEntries);
router.post('/', createJournalEntry);
router.get('/insights', getJournalInsights);
router.post('/reprocess', reprocessJournalEntries);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);
router.post('/:id/reprocess', reprocessSingleEntry);

export default router;