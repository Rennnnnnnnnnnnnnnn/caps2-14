
import db from '../config/database.js'; // Assuming your DB connection is set up correctly
import express from 'express';
const router = express.Router();

// ADD ITEM TYPES
export const addItemType = async (req, res, next) => {
    try {
        const { itemType, itemName, itemUnitOfMeasure } = req.body;

        // Validate required fields
        if (!itemType || !itemName || !itemUnitOfMeasure) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO inventory_items (item_type, item_name, item_unit_of_measure) VALUES (?, ?, ?)';

        // Await the execution of the query
        const [result] = await db.execute(query, [itemType, itemName, itemUnitOfMeasure]);

        console.log('Sending response with itemId:', result.insertId);
        res.status(201).json({ message: 'Item added successfully', itemId: result.insertId });
    } catch (err) {
        console.error('Error inserting item:', err);
        res.status(500).json({ message: 'Error inserting item' });
    }
};


// FETCH ALL ITEM TYPES
// Function to get all unique item types from the inventory_items table
export const getItemTypes = async (req, res, next) => {
    try {
        // Query to select distinct item types
        const query = `SELECT DISTINCT item_type, item_name FROM transactions  WHERE item_type IN ('Feeds', 'Chicks', 'Supplements')`;

        // Execute the query
        const [rows] = await db.execute(query);

        // Send a successful response with the retrieved item types
        res.status(200).json({
            message: 'Item types retrieved successfully',
            result: rows
        });
    } catch (err) {
        console.error('Error retrieving item types:', err);
        res.status(500).json({ message: 'Error retrieving item types' });
    }
};




// PARA FETCH ITEM STOCK DETAILS
export const getItemStockDetails = async (req, res, next) => {
    try {
        // Get the table name, item type, and item name from the request body
        const { table_name, item_type, item_name } = req.body;
        // Form the query with placeholders for item_type and item_name
        const query = `SELECT * FROM ${table_name} WHERE item_type = ? AND item_name = ? ORDER BY date DESC`;
        // Execute the query, passing in the item_type and item_name as parameters
        const [rows] = await db.execute(query, [item_type, item_name]);
        // Send a successful response with the retrieved item stock details
        res.status(200).json({
            message: 'Item stock details retrieved successfully',
            result: rows
        });
    } catch (err) {
        console.error('Error retrieving item stock details:', err);
        res.status(500).json({ message: 'Error retrieving item stock details' });
    }
};






export const addFeedsToStock = async (req, res, next) => {
    try {
        const { id, date, amount_left, amount_consumed, batchId } = req.body;
        // SQL query to update the record
        const updateQuery = `UPDATE feeds_inv SET amount_left = ?, amount_consumed = ? WHERE id = ?`;
        // Values from the frontend
        const updateValues = [amount_left, amount_consumed, id];
        // Execute the update query
        await db.query(updateQuery, updateValues); // Assuming db.query is a promise
        // Fetch the last record from feeds_inv to get its amount_left value
        const lastRecordQuery = `SELECT * FROM feeds_inv ORDER BY id DESC LIMIT 1`;

        const [rows] = await db.query(lastRecordQuery);
        const lastRecord = rows[0];
        // Check if a record was returned
        if (lastRecord) {
            const batchId = lastRecord.batch_id;
            const itemType = lastRecord.item_type;
            const itemName = lastRecord.item_name;
            const amountLeft = lastRecord.amount_left;
            const amountConsumed = lastRecord.amount_consumed;
            console.log("lastrecord value", lastRecord);
            console.log("values to subtract", amountLeft, "-", amountConsumed);
            // Calculate the new amount_left for the new record 
            const newAmountLeft = amountLeft - amountConsumed;
            // SQL query to insert a new record
            const insertQuery = `INSERT INTO feeds_inv (batch_id, item_type, item_name, date, amount_left) VALUES (?, ?, ?, ?, ?)`;
            // Insert new record with the calculated amount_left
            const insertValues = [batchId, itemType, itemName, date, newAmountLeft];
            console.log("last record details", batchId);
            await db.query(insertQuery, insertValues);
            // Send success response
            res.status(200).json({ message: 'Item updated and new record added successfully' });
        } else {
            throw new Error('No previous record found');
        }
    } catch (error) {
        // Handle errors
        console.error('Error updating item or inserting new record:', error);
        res.status(500).json({ message: 'Error updating item or inserting new record', error });
    }
};



export const addSupplementsToStock = async (req, res, next) => {
    try {
        const { id, date, amount_left, amount_consumed } = req.body;
        // SQL query to update the record
        const updateQuery = `UPDATE supplements_inv SET amount_left = ?, amount_consumed = ? WHERE id = ?`;
        // Values from the frontend
        const updateValues = [amount_left, amount_consumed, id];
        // Execute the update query
        await db.query(updateQuery, updateValues); // Assuming db.query is a promise
        // Fetch the last record from feeds_inv to get its amount_left value
        const lastRecordQuery = `SELECT * FROM supplements_inv ORDER BY id DESC LIMIT 1`;

        const [rows] = await db.query(lastRecordQuery);
        const lastRecord = rows[0];
        if (lastRecord) {
            const batchId = lastRecord.batch_id;
            const itemType = lastRecord.item_type;
            const itemName = lastRecord.item_name;
            const amountLeft = lastRecord.amount_left;
            const amountConsumed = lastRecord.amount_consumed;

            console.log("values to subtract", amountLeft, "-", amountConsumed);
            // Calculate the new amount_left for the new record 
            const newAmountLeft = amountLeft - amountConsumed;
            // SQL query to insert a new record
            const insertQuery = `INSERT INTO supplements_inv (batch_id, item_type, item_name, date, amount_left) VALUES (?, ?, ?, ?, ?)`;
            // Insert new record with the calculated amount_left
            const insertValues = [batchId, itemType, itemName, date, newAmountLeft];
            await db.query(insertQuery, insertValues);
            // Send success response
            res.status(200).json({ message: 'Item updated and new record added successfully' });
        } else {
            throw new Error('No previous record found');
        }
    } catch (error) {
        // Handle errors
        console.error('Error updating item or inserting new record:', error);
        res.status(500).json({ message: 'Error updating item or inserting new record', error });
    }
};







export const deleteInventoryRecord = async (req, res, next) => {
    try {

        const { id } = req.params; // Extract id from URL params
        const { itemType, itemName, batchId, } = req.body; // Extract additional data from request body


        let table_name;
        if (itemType === "Feeds") {
            table_name = "feeds_inv"
        } else if (itemType === "Supplements") {
            table_name = "supplements_inv"
        } else if (itemType === "Chicks") {
            table_name = "chicks_inv"
        } else {
            return console.log("Invalid item type!")
        }


        // Step 1: Fetch the `amount_left` of the row to be deleted
        const fetchDeletedRowQuery = `SELECT amount_left FROM ${table_name} WHERE id = ?`;
        const [deletedRow] = await db.query(fetchDeletedRowQuery, [id]);

        if (!deletedRow.length) {
            return res.status(404).json({ message: 'Row not found with the specified ID' });
        }

        const { amount_left: deletedAmountLeft } = deletedRow[0];





        // Step 2: Delete the selected row
        const deleteQuery = `DELETE FROM ${table_name} WHERE id = ?`;
        await db.query(deleteQuery, [id]);
        console.log(`Row with id: ${id} deleted successfully.`);

        // Step 3: Fetch the next row (row with id > deleted row)
        const fetchNextRowQuery = `SELECT id, amount_left, amount_consumed FROM ${table_name} WHERE id > ? ORDER BY id ASC LIMIT 1`;
        const [nextRow] = await db.query(fetchNextRowQuery, [id]);

        if (!nextRow.length) {
            return res.status(200).json({ message: 'Row deleted, no subsequent rows to update.' });
        }

        const { id: nextRowId, amount_left: nextRowAmountLeft, amount_consumed: nextRowAmountConsumed } = nextRow[0];

        // Step 4: Update the next row's amount_left to the deleted row's amount_left
        const updateNextRowQuery = `UPDATE ${table_name} SET amount_left = ? WHERE id = ?`;
        await db.query(updateNextRowQuery, [deletedAmountLeft, nextRowId]);
        console.log(`Next row with id: ${nextRowId} updated with new amount_left: ${deletedAmountLeft}`);

        // Step 5: Fetch all subsequent rows and recalculate their amount_left
        const fetchSubsequentRowsQuery = `
                SELECT id, amount_left, amount_consumed FROM ${table_name} 
                WHERE id > ? ORDER BY id ASC
            `;
        const [subsequentRows] = await db.query(fetchSubsequentRowsQuery, [nextRowId]);

        let previousAmountLeft = deletedAmountLeft;
        let previousAmountConsumed = nextRowAmountConsumed;

        for (const row of subsequentRows) {
            // Calculate new amount_left for this row
            const newRowAmountLeft = previousAmountLeft - previousAmountConsumed;

            // Update this row with the new amount_left
            const updateRowQuery = `UPDATE ${table_name} SET amount_left = ? WHERE id = ?`;
            await db.query(updateRowQuery, [newRowAmountLeft, row.id]);
            console.log(`Row with id: ${row.id} updated with new amount_left: ${newRowAmountLeft}`);

            // Update previousAmountLeft and previousAmountConsumed for the next iteration
            previousAmountLeft = newRowAmountLeft;
            previousAmountConsumed = row.amount_consumed;
        }
        res.status(200).json({ message: 'Row deleted and subsequent rows updated successfully.' });
    } catch (error) {
        console.error('Error deleting row or updating subsequent rows:', error);
        res.status(500).json({ message: 'Error deleting row or updating subsequent rows', error });
    }
};














export const editFeedsStock = async (req, res, next) => {
    try {
        const { id, date, amount_consumed, amount_left } = req.body;

        // Step 1: Fetch the item_type and item_name of the selected row
        const fetchCurrentRowQuery = `SELECT item_type, item_name FROM feeds_inv WHERE id = ?`;
        const [currentRow] = await db.query(fetchCurrentRowQuery, [id]);

        if (!currentRow.length) {
            return res.status(404).json({ message: 'No row found with the specified ID' });
        }

        const { item_type, item_name } = currentRow[0];
        console.log(`Fetched row details: item_type: ${item_type}, item_name: ${item_name}`);

        // Step 2: Update the selected row with the provided values from the frontend
        const updateQuery = `UPDATE feeds_inv SET date = ?, amount_consumed = ?, amount_left = ? WHERE id = ?`;
        await db.query(updateQuery, [date, amount_consumed, amount_left, id]);
        console.log(`Selected row with id: ${id} updated successfully.`);

        // Step 3: Fetch all **previous** rows with the same item_type and item_name
        const fetchPreviousRowsQuery = `
            SELECT id, amount_left, amount_consumed FROM feeds_inv 
            WHERE id < ? AND item_type = ? AND item_name = ? 
            ORDER BY id ASC
        `;
        const [previousRows] = await db.query(fetchPreviousRowsQuery, [id, item_type, item_name]);

        if (previousRows.length > 0) {
            // Get the last row from previous rows to calculate the new amount_left for the current row
            const lastRow = previousRows[previousRows.length - 1];
            console.log(`Fetched last row with id: ${lastRow.id}, amount_left: ${lastRow.amount_left}, amount_consumed: ${lastRow.amount_consumed}`);

            // Calculate the new amount_left for the selected row (current row)
            const newAmountLeft = lastRow.amount_left - lastRow.amount_consumed;
            console.log(`New amount_left for row with id: ${id}: ${newAmountLeft}`);

            // Update the selected row (current row) with the new calculated amount_left
            const updateSelectedRowQuery = `UPDATE feeds_inv SET amount_left = ? WHERE id = ?`;
            await db.query(updateSelectedRowQuery, [newAmountLeft, id]);
            console.log(`Row with id: ${id} updated with new amount_left: ${newAmountLeft}`);
        }

        // Step 4: Fetch all **subsequent** rows with the same item_type and item_name
        const fetchSubsequentRowsQuery = `
            SELECT id, amount_left, amount_consumed FROM feeds_inv 
            WHERE id > ? AND item_type = ? AND item_name = ? 
            ORDER BY id ASC
        `;
        const [subsequentRows] = await db.query(fetchSubsequentRowsQuery, [id, item_type, item_name]);

        console.log(`${subsequentRows.length} subsequent rows found for recalculation.`);

        // Step 5: Adjust the amount_left in all subsequent rows based on the current row's updated amount_left
        let previousAmountLeft = amount_left;  // Start with the updated amount_left of the current row
        let previousAmountConsumed = amount_consumed;  // Start with the updated amount_consumed of the current row

        for (const row of subsequentRows) {
            console.log(`Processing row with id: ${row.id}, current amount_left: ${row.amount_left}, amount_consumed: ${row.amount_consumed}`);

            // Calculate new amount_left based on the previous row's amount_left minus the previous row's amount_consumed
            const newRowAmountLeft = previousAmountLeft - previousAmountConsumed;
            console.log(`New amount_left for row with id ${row.id}: ${newRowAmountLeft}`);

            // Update the current row with the new amount_left
            const updateFollowingRowQuery = `UPDATE feeds_inv SET amount_left = ? WHERE id = ?`;
            await db.query(updateFollowingRowQuery, [newRowAmountLeft, row.id]);
            console.log(`Row with id: ${row.id} updated with new amount_left: ${newRowAmountLeft}`);

            // Update previousAmountLeft and previousAmountConsumed for the next row in the loop
            previousAmountLeft = newRowAmountLeft;
            previousAmountConsumed = row.amount_consumed;  // This row's consumption becomes the previous one in the next iteration
        }

        // Step 6: Respond with success message
        res.status(200).json({ message: 'Selected row updated successfully, and subsequent rows adjusted.' });
    } catch (error) {
        console.error('Error updating the selected row or subsequent rows:', error);
        res.status(500).json({ message: 'Error updating the selected row or subsequent rows', error });
    }
};

export const editSupplementsStock = async (req, res, next) => {
    try {
        const { id, date, amount_left, amount_consumed } = req.body;

        // Step 1: Fetch the item_type and item_name of the selected row
        const fetchCurrentRowQuery = `SELECT item_type, item_name FROM supplements_inv WHERE id = ?`;
        const [currentRow] = await db.query(fetchCurrentRowQuery, [id]);

        if (!currentRow.length) {
            return res.status(404).json({ message: 'No row found with the specified ID' });
        }

        const { item_type, item_name } = currentRow[0];
        console.log(`Fetched row details: item_type: ${item_type}, item_name: ${item_name}`);

        // Step 2: Update the selected row with the provided values from the frontend
        const updateQuery = `UPDATE supplements_inv SET date = ?, amount_left = ?, amount_consumed = ? WHERE id = ?`;
        await db.query(updateQuery, [date, amount_left, amount_consumed, id]);
        console.log(`Selected row with id: ${id} updated successfully.`);

        // Step 3: Fetch all **previous** rows with the same item_type and item_name
        const fetchPreviousRowsQuery = `
            SELECT id, amount_left, amount_consumed FROM supplements_inv 
            WHERE id < ? AND item_type = ? AND item_name = ? 
            ORDER BY id ASC
        `;
        const [previousRows] = await db.query(fetchPreviousRowsQuery, [id, item_type, item_name]);

        if (previousRows.length > 0) {
            // Get the last row from previous rows to calculate the new amount_left for the current row
            const lastRow = previousRows[previousRows.length - 1];
            console.log(`Fetched last row with id: ${lastRow.id}, amount_left: ${lastRow.amount_left}, amount_consumed: ${lastRow.amount_consumed}`);

            // Calculate the new amount_left for the selected row (current row)
            const newAmountLeft = lastRow.amount_left - lastRow.amount_consumed;
            console.log(`New amount_left for row with id: ${id}: ${newAmountLeft}`);

            // Update the selected row (current row) with the new calculated amount_left
            const updateSelectedRowQuery = `UPDATE supplements_inv SET amount_left = ? WHERE id = ?`;
            await db.query(updateSelectedRowQuery, [newAmountLeft, id]);
            console.log(`Row with id: ${id} updated with new amount_left: ${newAmountLeft}`);
        }

        // Step 4: Fetch all **subsequent** rows with the same item_type and item_name
        const fetchSubsequentRowsQuery = `
            SELECT id, amount_left, amount_consumed FROM supplements_inv 
            WHERE id > ? AND item_type = ? AND item_name = ? 
            ORDER BY id ASC
        `;
        const [subsequentRows] = await db.query(fetchSubsequentRowsQuery, [id, item_type, item_name]);

        console.log(`${subsequentRows.length} subsequent rows found for recalculation.`);

        // Step 5: Adjust the amount_left in all subsequent rows based on the current row's updated amount_left
        let previousAmountLeft = amount_left;  // Start with the updated amount_left of the current row
        let previousAmountConsumed = amount_consumed;  // Start with the updated amount_consumed of the current row

        for (const row of subsequentRows) {
            console.log(`Processing row with id: ${row.id}, current amount_left: ${row.amount_left}, amount_consumed: ${row.amount_consumed}`);

            // Calculate new amount_left based on the previous row's amount_left minus the previous row's amount_consumed
            const newRowAmountLeft = previousAmountLeft - previousAmountConsumed;
            console.log(`New amount_left for row with id ${row.id}: ${newRowAmountLeft}`);

            // Update the current row with the new amount_left
            const updateFollowingRowQuery = `UPDATE supplements_inv SET amount_left = ? WHERE id = ?`;
            await db.query(updateFollowingRowQuery, [newRowAmountLeft, row.id]);
            console.log(`Row with id: ${row.id} updated with new amount_left: ${newRowAmountLeft}`);

            // Update previousAmountLeft and previousAmountConsumed for the next row in the loop
            previousAmountLeft = newRowAmountLeft;
            previousAmountConsumed = row.amount_consumed;  // This row's consumption becomes the previous one in the next iteration
        }

        // Step 6: Respond with success message
        res.status(200).json({ message: 'Selected row updated successfully, and subsequent rows adjusted.' });
    } catch (error) {
        console.error('Error updating the selected row or subsequent rows:', error);
        res.status(500).json({ message: 'Error updating the selected row or subsequent rows', error });
    }
};



