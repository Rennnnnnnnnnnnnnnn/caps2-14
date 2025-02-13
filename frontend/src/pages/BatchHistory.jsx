import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import AddTransactionModal from '../components/modals/AddTransactionModal';

function BatchHistory() {
    const [currentBatch, setCurrentBatch] = useState(null);


    // Fetch the last active batch on component mount
    useEffect(() => {
        const fetchLastActiveBatch = async () => {
            try {
                const response = await axios.get('/api/batch/last-active');
                if (response.data && response.data.batchName) {
                    setCurrentBatch(response.data); // Set the current batch object
                }
            } catch (error) {
                console.error('Error fetching the last active batch:', error);
            }
        };

        fetchLastActiveBatch();
    }, []);

    // Function to create a new batch
    const createBatch = async () => {
        try {
            const response = await axios.post('/api/batch/create', {
                batchName: "Batch Name" // This can be dynamic based on user input
            });
            setCurrentBatch({ batchId: response.data.batchId, batchName: "Batch Name" }); // Store the current batch
        } catch (error) {
            console.error('Error creating batch:', error);
        }
    };

    // Function to close the current batch
    const closeBatch = async () => {
        try {
            await axios.post('/batch/close', {
                batchId: currentBatch.batchId // Close the batch using the current batch ID
            });
            setCurrentBatch(null); // Reset current batch after closing
        } catch (error) {
            console.error('Error closing batch:', error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex space-x-4">
                <button
                    onClick={createBatch}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Create New Batch
                </button>
                <button
                    onClick={closeBatch}
                    disabled={!currentBatch} // Disable button if no batch is created
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                >
                    Close Current Batch
                </button>
            </div>

            {currentBatch && (
                <div className="mt-4">
                    <p>Current Active Batch: {currentBatch.batchName} (ID: {currentBatch.batchId})</p>
                </div>
            )}

            {/* <AddTransactionModal currentBatchId={currentBatch.batchId} /> */}
            {/* <AddTransactionModal currentBatch={currentBatch} /> */}

            <AddTransactionModal currentBatch={{ batchId: 6 }} />


        </>
    );
}

export default BatchHistory;
