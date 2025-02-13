import { Modal, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast to trigger notifications

const AddItemModal = ({ isOpen, handleClose }) => {
    const [itemType, setItemType] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemUnitOfMeasure, setItemUnitOfMeasure] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setItemType("");
            setItemName("");
            setItemUnitOfMeasure("");
        }
    }, [isOpen]);

    const handleAddClick = async () => {
        try {
            const response = await axios.post('/api/inventory/', {
                itemType,
                itemName,
                itemUnitOfMeasure,
            });
            console.log(response.data);
            toast.success("Item type successfully added!"); // Toast notification on success
            handleClose();

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Error: Item type addition unsuccessful"); // Toast notification on error
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={(e, reason) => {
                if (reason === 'backdropClick') return;
                handleClose();
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
                <label className="font-semibold text-2xl text-center block mb-5">Add Item</label>
                <form>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Item Type</InputLabel>
                        <Select
                            value={itemType}
                            onChange={(e) => {
                                setItemType(e.target.value);
                                setItemName("");
                                setItemUnitOfMeasure("");
                            }}
                            label="Item Type"
                        >
                            <MenuItem value="Chicks">Chicks</MenuItem>
                            <MenuItem value="Feeds">Feeds</MenuItem>
                            <MenuItem value="Supplements">Supplements</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Item Name"
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        label="Item's Unit of Measure"
                        fullWidth
                        value={itemUnitOfMeasure}
                        onChange={(e) => setItemUnitOfMeasure(e.target.value)}
                        margin="normal"
                    />

                    <div className="flex justify-end space-x-4 mt-6 gap-4">
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            onClick={handleAddClick}
                            disabled={!itemType || !itemName || !itemUnitOfMeasure}
                            sx={{
                                width: '90px',
                                height: '45px',
                            }}
                        >
                            Add
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleClose}
                            sx={{ width: '90px', height: '45px' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default AddItemModal;
