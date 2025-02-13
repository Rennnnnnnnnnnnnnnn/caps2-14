import express from 'express';
// import { getInventoryByBatch , getTableValues, addItemType} from '../controllers/inventoryController.js';
import { addItemType, getItemTypes, getItemStockDetails, addFeedsToStock, addSupplementsToStock, editFeedsStock, editSupplementsStock, deleteInventoryRecord } from '../controllers/inventoryController.js';

const router = express.Router();

// GET ALL INVENTORY DETAILS BY BATCH ID
// router.get('/:batchId', getInventoryByBatch);

// router.get('/', getTableValues);

router.post('/', addItemType);

router.get('/item-types', getItemTypes);

router.post('/item-stock-details', getItemStockDetails);


router.post('/add-feeds-to-stock', addFeedsToStock);

router.post('/add-supplements-to-stock', addSupplementsToStock);


router.delete('/delete-inventory-record/:id', deleteInventoryRecord);


router.post('/edit-feeds-in-stock', editFeedsStock);
router.post('/edit-supplements-in-stock', editSupplementsStock);









export default router;
