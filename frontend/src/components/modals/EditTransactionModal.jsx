import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { FormHelperText } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import pesoIcon from '../../assets/pesoSign.svg';
import ConfirmationModal from './ConfirmationModal';

const EditTransactionModal = ({ isOpen, handleClose, handleConfirmEdit, selectedTransactionData }) => {
    const [transactionDate, setTransactionDate] = useState(dayjs());
    const [transactionType, setTransactionType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [totalCost, setTotalCost] = useState('');
    const [contactName, setContactName] = useState('');
    const [batchId, setBatchId] = useState(null);
    const [itemType, setItemType] = useState('');
    const [isPriceFocused, setIsPriceFocused] = useState(false);
    const [isTotalCostFocused, setIsTotalCostFocused] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [itemName, setItemName] = useState('');

    useEffect(() => {
        if (selectedTransactionData) {
            setTransactionDate(dayjs(selectedTransactionData.transaction_date));
            setTransactionType(selectedTransactionData.transaction_type);
            setQuantity(selectedTransactionData.quantity);
            setPricePerUnit(selectedTransactionData.price_per_unit);
            setTotalCost(selectedTransactionData.total_cost);
            setContactName(selectedTransactionData.contact_name);
            setBatchId(selectedTransactionData.batch_id);
            setItemType(selectedTransactionData.item_type);
            setTransactionId(selectedTransactionData.transaction_id);
            setItemName(selectedTransactionData.item_name);
        }

        console.log(selectedTransactionData);

    }, [selectedTransactionData]);

    // Dynamic Item Type options based on transactionType
    const getItemTypeOptions = () => {
        if (transactionType === "Sale") {
            return ["Liveweight", "Dressed"];
        } else if (transactionType === "Expense") {
            return [
                "Chicks",
                "Feeds",
                "Supplements",
                "Labor",
                "Water",
                "Electricity",
                "Gasoline"
            ];
        }
        return [];
    };

    const handleSave = () => {
        setIsConfirmationModalOpen(true); // Show confirmation modal
    };

    const handleCancel = () => {
        setIsConfirmationModalOpen(false); // Hide confirmation modal
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const isFormValid = batchId && transactionId && transactionDate && transactionType && contactName && itemType && itemName && quantity && pricePerUnit && totalCost;

        if (!isFormValid) return; // Prevent submission if any field is empty

        const updatedTransactionData = {
            batchId: batchId,
            transactionId: transactionId,
            transactionDate: transactionDate,
            transactionType: transactionType,
            contactName: contactName,
            itemType: itemType,
            itemName: itemName,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            totalCost: totalCost,
        };

        console.log(updatedTransactionData);
        handleConfirmEdit(updatedTransactionData);
        handleClose();
    };

    useEffect(() => {
        const calculatedCost = quantity && pricePerUnit ? quantity * pricePerUnit : '';
        setTotalCost(calculatedCost);
    }, [quantity, pricePerUnit]);

    return (
        <>
            <Modal
                open={isOpen && !isConfirmationModalOpen}
                onClose={(e, reason) => {
                    if (reason === 'backdropClick') return;
                    handleClose();
                }}
                sx={{
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 28,
                        p: 4,
                        borderRadius: '8px',
                    }}
                >
                    <label className="font-semibold text-2xl text-center block mb-5">Edit Transaction</label>
                    <form onSubmit={handleFormSubmit}>



                        <div className='flex gap-4'>
                            {/* TRANSACTION TYPE */}
                            <FormControl
                                fullWidth
                                margin="normal"
                                error={isSubmitted && !transactionType}
                            >
                                <InputLabel>Transaction Type</InputLabel>
                                <Select
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    label="Transaction Type"
                                >
                                    <MenuItem value="" disabled>
                                        Select Transaction Type
                                    </MenuItem>
                                    <MenuItem value="Sale">Sale</MenuItem>
                                    <MenuItem value="Expense">Expense</MenuItem>
                                </Select>
                                {isSubmitted && !transactionType && (
                                    <FormHelperText style={{ color: 'red' }}>Transaction Type is required</FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={isSubmitted && !transactionDate}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDateTimePicker
                                        label="Transaction Date"
                                        value={transactionDate}
                                        onChange={(newDate) => setTransactionDate(newDate)}
                                        required
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        slotProps={{
                                            field: { clearable: true, onClear: () => setTransactionDate(null) },
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                {isSubmitted && !transactionDate && (
                                    <FormHelperText style={{ color: 'red' }}>Transaction Date is required</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className='flex gap-4'>
                            {/* ITEM TYPE */}
                            <FormControl
                                fullWidth
                                margin="normal"
                                error={isSubmitted && !itemType}
                            >
                                <InputLabel>Item Type</InputLabel>
                                <Select
                                    value={itemType}
                                    onChange={(e) => setItemType(e.target.value)}
                                    label="Item Type"
                                    disabled={!transactionType}
                                >
                                    <MenuItem value=""
                                        disabled
                                    >
                                        Select Item Type
                                    </MenuItem>
                                    {getItemTypeOptions().map((type, index) => (
                                        <MenuItem key={index} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {isSubmitted && !itemType && (
                                    <FormHelperText style={{ color: 'red' }}>Item Type is required</FormHelperText>
                                )}
                            </FormControl>
                            {/* QUANTITY */}
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                margin="normal"
                                required
                                error={isSubmitted && !quantity}
                                helperText={isSubmitted && !quantity ? "Quantity is required" : ""}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {itemType === "Liveweight" && " Kilos"}
                                            {itemType === "Dressed" && " Kilos"}
                                            {itemType === "Chicks" && " Heads"}
                                            {itemType === "Feeds" && " Kilos"}
                                            {itemType === "Supplements" && " Kilos"}
                                            {itemType === "Labor" && " Heads"}
                                            {itemType === "Water" && " Gallons"}
                                            {itemType === "Electricity" && " Kilowatts"}
                                            {itemType === "Gasoline" && " Liters"}
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        style: { appearance: 'textfield' },
                                    },
                                }}
                                sx={{
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    },
                                }}
                            />
                        </div>

                        <div className='flex gap-4'>
                            {/* ITEM NAME */}
                            <TextField
                                label="Item Name"
                                fullWidth
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                margin="normal"
                            />

                            {/* PRICE PER UNIT */}
                            <TextField
                                label="Price Per Unit"
                                type="number"
                                fullWidth
                                value={pricePerUnit}
                                onChange={(e) => setPricePerUnit(e.target.value)}
                                margin="normal"
                                required
                                error={isSubmitted && !pricePerUnit}
                                helperText={isSubmitted && !pricePerUnit ? "Price Per Unit is required" : ""}
                                InputProps={{
                                    startAdornment: (pricePerUnit || isPriceFocused) && (
                                        <InputAdornment position="start">
                                            <img
                                                src={pesoIcon}
                                                alt="Peso Icon"
                                                style={{ width: '32px', height: '32px' }}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {itemType === "Liveweight" && "Per Kilo"}
                                            {itemType === "Dressed" && "Per Kilo"}
                                            {itemType === "Chicks" && "Per Head"}
                                            {itemType === "Feeds" && "Per Kilo"}
                                            {itemType === "Supplements" && "Per Kilo"}
                                            {itemType === "Labor" && "Per Head"}
                                            {itemType === "Water" && "Per Gallon"}
                                            {itemType === "Electricity" && "Per Kilowatt"}
                                            {itemType === "Gasoline" && "Per Liter"}
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        style: { appearance: 'textfield' },
                                    },
                                }}
                                sx={{
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    },
                                }}
                            />
                        </div>

                        <div className='flex gap-4'>
                            <TextField
                                label="Contact Name"
                                fullWidth
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Total Cost"
                                type="number"
                                fullWidth
                                value={totalCost}
                                margin="normal"
                                onFocus={() => setIsTotalCostFocused(true)}
                                onBlur={() => setIsTotalCostFocused(false)}
                                required
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (totalCost || isTotalCostFocused) && (
                                        <InputAdornment position="start">
                                            <img
                                                src={pesoIcon}
                                                alt="Peso Icon"
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-3">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                sx={{
                                    width: '90px',
                                    height: '45px',
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* ConfirmationModal */}
            {isConfirmationModalOpen && (
                <div
                    className={`fixed inset-0 ${isConfirmationModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}
                    style={{
                        zIndex: 999,
                    }}
                >
                    <ConfirmationModal
                        isOpen={isConfirmationModalOpen}
                        onCancel={handleCancel}
                        onConfirm={handleFormSubmit} // You can trigger the form submit here if the user confirms
                        message="Are you sure you want to save changes to this transaction?"
                    />
                </div>
            )}
        </>
    );
};

export default EditTransactionModal;
