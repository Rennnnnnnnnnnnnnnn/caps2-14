
import db from '../config/database.js'; // Assuming your DB connection is set up correctly
import express from 'express';
const router = express.Router();  // Correcting the router initialization

// Create batch
export const createBatch = async (req, res, next) => {
    const { batchName } = req.body;
    const startDate = new Date(); // Batch starts today

    try {
        const [result] = await db.execute('INSERT INTO Batch (batch_name, start_date, is_active) VALUES (?, ?, ?)', 
        [batchName, startDate, true]);
        res.status(200).json({ batchId: result.insertId });
    } catch (err) {
        const error = new Error(`Unable to create batch`);
        error.status = 500;
        res.status(500).json({ error: err.message });
        return next(error);
    }
};

// Close batch
export const closeBatch = async (req, res, next) => {
    const { batchId } = req.body;
    const endDate = new Date(); // Batch closes today

    try {
        await db.execute('UPDATE Batch SET is_active = false, end_date = ? WHERE id = ?', 
        [endDate, batchId]);
        res.status(200).send('Batch closed');
    } catch (err) {
        const error = new Error(`Unable to close batch`);
        error.status = 500;
        res.status(500).json({ error: err.message });
        return next(error);
    }
};

// Fetch the last active batch (where end_date is null)
export const getLastActiveBatch = async (req, res, next) => {
    try {
        const [batch] = await db.execute('SELECT batch_id, batch_name FROM Batch WHERE is_active = true AND end_date IS NULL ORDER BY start_date DESC LIMIT 1');
        
        if (batch.length > 0) {
            const { batch_id, batch_name } = batch[0];
            res.status(200).json({ batchId: batch_id, batchName: batch_name });
        } else {
            res.status(404).json({ message: 'No active batch found' });
        }
    } catch (err) {
        const error = new Error('Unable to fetch the last active batch');
        error.status = 500;
        res.status(500).json({ error: err.message });
        return next(error);
    }
};
;



export default router;