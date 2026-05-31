import express from 'express';
import {
  getAllEntries,
  saveSeasonEntry,
  deleteEntry
} from '../controllers/journal.controller.js';

const router = express.Router();

router.get('/journal/entries', getAllEntries);
router.post('/journal/entries', saveSeasonEntry);
router.delete('/journal/entries/:id', deleteEntry);

export default router;
