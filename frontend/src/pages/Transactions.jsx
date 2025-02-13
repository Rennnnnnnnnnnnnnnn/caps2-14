import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import pesoIcon from '../assets/pesoSign.svg';
//icon
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
//modal
import AddTransactionModal from '../components/modals/AddTransactionModal';
import EditTransactionModal from '../components/modals/EditTransactionModal';

import { toast } from 'react-toastify';
import ToastNotifications from '../components/ToastNotification'; // Assuming it's in the same folder
import ConfirmationModal from '../components/modals/ConfirmationModal';
import * as XLSX from 'xlsx';

function Transactions() {
    // State for transactions and their filters
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactionTypeFilter, setTransactionTypeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    // State for batch and transaction selection
    const [currentBatch, setCurrentBatch] = useState(null);
    const [selectedTransactionData, setSelectedTransactionData] = useState(null);
    // State for date filters
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // State for modals
    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    // Other state
    const [cleared, setCleared] = useState(false);

    // Functions to handle modal visibility
    const handleOpenAddTransactionModal = () => setIsAddTransactionModalOpen(true);
    const handleCloseAddTransactionModal = () => setIsAddTransactionModalOpen(false);

    const handleOpenEditTransactionModal = () => setIsEditTransactionModalOpen(true);
    const handleCloseEditTransactionModal = () => setIsEditTransactionModalOpen(false);

    // Confirmation modal state
    const handleOpenConfirmationModal = () => setIsConfirmationModalOpen(true);
    const handleCloseConfirmationModal = () => setIsConfirmationModalOpen(false);

    const handleDownloadButton = () => {
        if (filteredTransactions.length === 0) {
            return;
        }
        // Map the filtered transactions to format dates and numbers
        const formattedData = filteredTransactions.map(transaction => ({
            ID: transaction.transaction_id, // Custom header name
            'Transaction Date': new Date(transaction.transaction_date).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }), // Format the date into a readable format
            'Type': transaction.transaction_type, // Custom header name
            'Contact Name': transaction.contact_name, // Custom header name
            'Item Type': transaction.item_type, // Custom header name
            'Item Name': transaction.item_name, // Custom header name
            'Quantity': transaction.quantity.toLocaleString(), // Add commas to large numbers
            'Price per Unit': transaction.price_per_unit.toLocaleString(), // Add commas to large numbers
            'Total Cost': transaction.total_cost.toLocaleString(), // Add commas to large numbers
            'Batch ID': transaction.batch_id, // Custom header name
        }));
        // Convert the formatted data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        // Custom header order and alignment styles
        const headers = [
            ['ID', 'Transaction Date', 'Type', 'Contact Name', 'Item Type', 'Item Name', 'Quantity', 'Price per Unit', 'Total Cost', 'Batch ID']
        ];
        // Add headers at the top of the worksheet
        XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' });
        // Apply center alignment to headers (first row)
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]; // Header cell
            if (cell) {
                cell.s = {
                    alignment: { horizontal: 'center', vertical: 'center' }, // Center align headers
                    font: { bold: true }, // Bold headers
                    border: { // Optional: Add borders for the headers
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    },
                };
            }
        }
        // Apply left alignment to data rows (starting from row 1, skipping the header row)
        for (let R = 1; R <= filteredTransactions.length; ++R) {
            for (let C = 0; C < headers[0].length; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })]; // Data cell
                if (cell) {
                    cell.s = { alignment: { horizontal: 'left' } }; // Left align data
                }
            }
        }
        // Set custom column widths
        worksheet['!cols'] = [
            { wpx: 80 },  // ID (80px width)
            { wpx: 160 }, // Transaction Date (160px width)
            { wpx: 120 }, // Type (120px width)
            { wpx: 150 }, // Contact Name (150px width)
            { wpx: 120 }, // Item Type (120px width)
            { wpx: 180 }, // Item Name (180px width)
            { wpx: 80 },  // Quantity (80px width)
            { wpx: 100 }, // Price per Unit (100px width)
            { wpx: 100 }, // Total Cost (100px width)
            { wpx: 80 },  // Batch ID (80px width)
        ];
        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        // Use the batch ID from the first transaction for the filename
        const batchId = filteredTransactions[0].batch_id || 'unknown_batch';
        // Trigger the file download with batch ID in the filename
        XLSX.writeFile(workbook, `transactions_Batch-${batchId}.xlsx`);
    };
    //PARA SA CLEAR NG DATE INPUT
    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => { };
    }, [cleared]);
    useEffect(() => {
        filterData();
    }, [searchQuery, transactionTypeFilter, startDate, endDate, transactions]);
    //PARA SA FETCH CURRENT BATCH
    useEffect(() => {
        const fetchCurrentBatchIdAndName = async () => {
            try {
                const response = await axios.get('/api/batch/last-active');
                if (response.data && response.data.batchName) {
                    setCurrentBatch(response.data);
                }
            } catch (error) {
                console.error('Error fetching current batch:', error);
            }
        };
        fetchCurrentBatchIdAndName();
    }, []);

    const fetchDataOfCurrentBatch = async () => {
        if (!currentBatch || !currentBatch.batchId) return;

        try {
            const response = await axios.get(`/api/transactions/${currentBatch.batchId}`);
            setTransactions(response.data);
            console.log("Transactions Data", transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        if (currentBatch && currentBatch.batchId) {
            fetchDataOfCurrentBatch(); // Fetch data when currentBatch changes
        }
    }, [currentBatch]);

    // PARA SA ADD TRANSACTION
    const handleAddTransactionSubmit = async (newTransactionData) => {
        try {
            const response = await axios.post('/api/transactions/add-transaction', newTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                console.log('Transaction added successfully:', response.data);
                //  alert('Transaction added successfully!');
                toast.success('Transaction added successfully!');
                fetchDataOfCurrentBatch();
            } else {
                console.error('Error:', response.data);
                alert('Error: ' + response.data.error);
                toast.error('Error: ' + response.data.error);

            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('An error occurred while adding the transaction');
        }
    };

    const handleEditClick = (transaction) => {
        setSelectedTransactionData(transaction);
        setIsEditTransactionModalOpen(true);
    };

    // PARA SA EDIT TRANSACTION
    const handleConfirmEdit = async (updatedTransactionData) => {
        try {
            const response = await axios.put(`/api/transactions/${updatedTransactionData.transactionId}`, updatedTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('Transaction updated successfully:', response.data);
                //    alert('Transaction updated successfully!');
                toast.success('Transaction updated successfully!');
                fetchDataOfCurrentBatch();
            } else {
                console.error('Error:', response.data);
                //  alert('Error: ' + response.data.error);
                toast.error('Error: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('An error occurred while updating the transaction');
        }
    };

    const handleDeleteClick = (transaction_id) => {
        setIsConfirmationModalOpen(true);
        setSelectedTransactionData(transaction_id);
    };
    // PARA SA DELETE
    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/transactions/${selectedTransactionData}`)

            if (response.status === 200) {
                //     alert('Item deleted successfully');
                setIsConfirmationModalOpen(false);
                toast.success('Transaction deleted successfully!');
                fetchDataOfCurrentBatch();
            } else {
                alert('Failed to delete the item');
                toast.error('Error: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while trying to delete the item');

        }
    };
    // FORMAT DATE
    function formatDateToReadableString(dateString) {
        const date = new Date(dateString); // Parse the date string
        return date.toLocaleString('en-PH', {
            year: 'numeric',
            month: 'long',  // Full month name (e.g., "January")
            day: 'numeric',  // Day without leading zeros
            hour: 'numeric',  // Hour (12-hour format)
            minute: '2-digit',  // Minutes with leading zeros if necessary
            hour12: true,  // AM/PM format
        });
    }
    // PARA HINDI SCROLLABLE
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    // Function to calculate totals
    const calculateTotals = () => {
        let totalSales = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            if (transaction.transaction_type === 'Sale') {
                totalSales += parseFloat(transaction.total_cost);
            } else if (transaction.transaction_type === 'Expense') {
                totalExpenses += parseFloat(transaction.total_cost);
            }
        });

        const incomeOrLoss = totalSales - totalExpenses;

        return {
            totalSales: totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            totalExpenses: totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            incomeOrLoss: incomeOrLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };
    };

    const { totalSales, totalExpenses, incomeOrLoss } = calculateTotals();


    const filterData = () => {
        let filtered = [...transactions];
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(transaction =>
            (transaction.transaction_date?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.transaction_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.item_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.quantity?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.price_per_unit?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.total_cost?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        // Apply transaction type filter (only if it's not 'All')
        if (transactionTypeFilter !== 'All') {
            filtered = filtered.filter(transaction => transaction.transaction_type === transactionTypeFilter);
        }
        // Apply start date filter
        if (startDate) {
            filtered = filtered.filter(transaction => new Date(transaction.transaction_date) >= new Date(startDate));
        }
        // Apply end date filter
        if (endDate) {
            filtered = filtered.filter(transaction => new Date(transaction.transaction_date) <= new Date(endDate));
        }
        setFilteredTransactions(filtered);
    };

    return (
        <>
            <Navbar />
            <div className={`container mx-auto p-4 bg-white ${(isAddTransactionModalOpen || isEditTransactionModalOpen || isConfirmationModalOpen) ? 'backdrop-blur-sm' : ''}`}>
                <div className="taas-ng-table flex flex-row items-center mb-4 gap-2">

                    <FormControl className="w-[350px]">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={transactionTypeFilter}
                            label="Type"
                            onChange={(e) => setTransactionTypeFilter(e.target.value)}
                        >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={"Sale"}>Sales</MenuItem>
                            <MenuItem value={"Expense"}>Expenses</MenuItem>
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            sx={{ width: 450 }}
                            slotProps={{
                                field: { clearable: true, onClear: () => setCleared(true) },
                            }}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            sx={{
                                width: 450,
                            }}
                            slotProps={{
                                field: { clearable: true, onClear: () => setCleared(true) },
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleOpenAddTransactionModal}  
                        sx={{
                            minHeight: '25px',
                            height: '45px',
                            minWidth: '30px',
                            width: '55px',
                            boxShadow: 'none',
                            backgroundColor: '#634d36',
                            '&:hover': {
                                backgroundColor: '#3700b3',
                            },

                        }}
                    >

                        <DownloadIcon onClick={handleDownloadButton} sx={{ fontSize: '28' }} />

                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenAddTransactionModal}
                        sx={{
                            fontSize: '19px',
                            // padding: '8px', // Adjust padding as needed
                            minHeight: '25px',
                            height: '45px',
                            minWidth: '30px',
                            width: '180px',
                            display: 'flex',
                            alignItems: 'center', // Vertically center icon and text
                            justifyContent: 'center', // Horizontally center content
                            boxShadow: 'none',
                            backgroundColor: 'orange',
                            '&:hover': {
                                backgroundColor: '#3700b3',
                            },
                            '&:active': {
                                backgroundColor: '#6200ea',
                            },
                        }}
                    >
                        <AddIcon sx={{
                            fontSize: '24px', // Adjust icon size (controls the "containment")
                        }} />
                        <label className="text-[22px]">Add</label>
                    </Button>
                </div>
                <div className="relative">
                    <div className="overflow-y-auto h-[80vh] border border-gray-700 rounded-tr-lg shadow-md">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200 text-gray-700 sticky top-0">
                                <tr>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Date</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Transaction Type</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Item Type - Name</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Contact Name</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Quantity</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Price Per Unit</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600">Total Cost</th>
                                    <th className="border-b px-4 py-2 text-sm border-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">No Transactions Found</td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((transaction) => (

                                        <tr key={transaction.transaction_id} className="hover:bg-green-200">
                                            <td className="py-2 px-4">{formatDateToReadableString(transaction.transaction_date)} </td>
                                            <td className="py-2 px-4">{transaction.transaction_type}</td>
                                            <td className="py-2 px-4">{transaction.item_type} - {transaction.item_name}</td>
                                            <td className="py-2 px-4">{transaction.contact_name}</td>
                                            <td className="py-2 px-4">
                                                {transaction.quantity}
                                                {transaction.item_type.includes("Chicks") && " heads"}
                                                {transaction.item_type.includes("Feeds") && " kilos"}
                                                {transaction.item_type.includes("Vitamins") && " bottles"}
                                                {transaction.item_type.includes("Labor") && " heads"}
                                                {transaction.item_type.includes("Water") && " gallons"}
                                                {transaction.item_type.includes("Electricity") && " kilowatts"}
                                                {transaction.item_type.includes("Gasoline") && " liters"}
                                            </td>

                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-1">
                                                    <img
                                                        src={pesoIcon}
                                                        alt="Peso Icon"
                                                        className="w-5 h-5"
                                                    />
                                                    {parseFloat(transaction.price_per_unit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    {transaction.item_type.includes("Chicks") && " per head"}
                                                    {transaction.item_type.includes("Feeds") && " per sack"}
                                                    {transaction.item_type.includes("Vitamins") && " per bottle"}
                                                    {transaction.item_type.includes("Labor") && " per hour"}
                                                    {transaction.item_type.includes("Water") && " per gallon"}
                                                    {transaction.item_type.includes("Electricity") && " per kilowatt"}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-1">
                                                    <img
                                                        src={pesoIcon}
                                                        alt="Peso Icon"
                                                        className="w-5 h-5 mr-1"
                                                    />
                                                    {parseFloat(transaction.total_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="flex py-2 px-4 gap-2 justify-center">
                                                <Button
                                                    onClick={() => handleEditClick(transaction)}
                                                    variant="contained"
                                                    sx={{
                                                        minHeight: '25px',
                                                        height: '35px',
                                                        minWidth: '30px',
                                                        width: '35px',
                                                        boxShadow: 'none',
                                                        backgroundColor: '#ff8000',
                                                        '&:hover': {
                                                            backgroundColor: '#994d00',
                                                        },
                                                    }}
                                                >
                                                    <ModeEditOutlineIcon sx={{ fontSize: '24px' }} />
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        handleDeleteClick(transaction.transaction_id);
                                                    }}
                                                    sx={{
                                                        minHeight: '25px',
                                                        height: '35px',
                                                        minWidth: '30px',
                                                        width: '35px',
                                                        boxShadow: 'none',
                                                        backgroundColor: '#ff2e2e',
                                                        '&:hover': {
                                                            backgroundColor: '#990000',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: '24px' }} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="flex flex-col absolute bottom-0 right-0 m-5">
                            <div className="flex space-x-8">
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">Total Sales:</span>
                                    <span className="text-lg font-semibold">Total Expenses:</span>
                                    <span className="text-lg font-semibold">Income/Loss:</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg flex">
                                        <img src={pesoIcon} alt="Peso Icon" className="inline-block w-6 h-6" />{totalSales}
                                    </span>
                                    <span className="text-lg flex">
                                        <img src={pesoIcon} alt="Peso Icon" className="inline-block w-6 h-6" />{totalExpenses}
                                    </span>
                                    <span className={`${incomeOrLoss >= 0 ? 'text-green-600' : 'text-red-600'} text-lg flex`}>
                                        <img src={pesoIcon} alt="Peso Icon" className="inline-block w-6 h-6" />{incomeOrLoss}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* AddTransactionModal */}
            {isAddTransactionModalOpen && (
                <div className={`fixed inset-0 ${isAddTransactionModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
                    <AddTransactionModal
                        isOpen={isAddTransactionModalOpen}
                        handleClose={handleCloseAddTransactionModal}
                        handleAddTransaction={handleAddTransactionSubmit}
                        currentBatch={currentBatch}
                    />
                </div>
            )}
            {/* EditTransactionModal */}
            {isEditTransactionModalOpen && (
                <div className={`fixed inset-0 ${isEditTransactionModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
                    <EditTransactionModal
                        isOpen={isEditTransactionModalOpen}
                        handleClose={handleCloseEditTransactionModal}
                        selectedTransactionData={selectedTransactionData}
                        handleConfirmEdit={handleConfirmEdit}
                    />
                </div>
            )}
            {/* ConfirmationModal */}
            {isConfirmationModalOpen && (
                <div className={`fixed inset-0 ${isConfirmationModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
                    <ConfirmationModal
                        isOpen={isConfirmationModalOpen}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCloseConfirmationModal}
                        message="Are you sure you want to delete this transaction?"
                    />
                </div>
            )}
        </>
    );
}

export default Transactions;
