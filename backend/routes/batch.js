import express from 'express';
import { createBatch, closeBatch, getLastActiveBatch } from '../controllers/batchController.js'; // Correcting the import

const router = express.Router();

// Route for creating a batch
router.post('/create', createBatch);

// Route for closing a batch
router.post('/close', closeBatch);

// Route for getting the last active batch
router.get('/last-active', getLastActiveBatch);

export default router;
