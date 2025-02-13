import { Modal, Box, Button, TextField, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const AddActivityModal = ({ isOpen, handleClose, selectedInventoryData, fetchItemStockDetails, selectedItemType }) => {
    const [Id, setId] = useState("");
    const [activityDate, setActivityDate] = useState(dayjs());
    const [amountLeft, setAmountLeft] = useState("");
    const [amountConsumed, setAmountConsumed] = useState("");
    const [batchId, setBatchId] = useState("");
    // New fields for chicks
    const [readyToHarvest, setReadyToHarvest] = useState("");
    const [undersized, setUndersized] = useState("");
    const [sold, setSold] = useState("");
    const [mortality, setMortality] = useState("");

    useEffect(() => {
        if (isOpen) {
            setId(selectedInventoryData.id);
            setActivityDate(dayjs());
            setAmountLeft(selectedInventoryData.amount_left);
            setAmountConsumed("");
            setBatchId(selectedInventoryData.batch_id);
            // Reset chick-specific fields
            setReadyToHarvest("");
            setUndersized("");
            setSold("");
            setMortality("");
        }
    }, [isOpen]);

    const handleAddClick = async () => {
        try {
            const itemData = {
                id: Id,
                date: activityDate.format('YYYY-MM-DD HH:mm:ss'),
                amount_left: amountLeft,
                batch_id: batchId,
                ...(selectedItemType === "Feeds" || selectedItemType === "Supplements" ? { amount_consumed: amountConsumed } : {}),
                ...(selectedItemType === "Chicks" ? { ready_to_harvest: readyToHarvest, undersized, sold, mortality } : {}),
            };

            let urlEndpoint;
            if (selectedItemType === "Feeds") {
                urlEndpoint = "/api/inventory/add-feeds-to-stock";
            } else if (selectedItemType === "Supplements") {
                urlEndpoint = "/api/inventory/add-supplements-to-stock";
            } else if (selectedItemType === "Chicks") {
                urlEndpoint = "/api/inventory/add-chicks-to-stock";
            } else {
                console.log("Invalid selected item type!");
                return;
            }

            const response = await axios.post(urlEndpoint, itemData);
            console.log(response.data);
            toast.success("Activity successfully added!");
            handleClose();
            fetchItemStockDetails();
        } catch (error) {
            console.error('Error adding activity:', error);
            toast.error("Error: Activity addition unsuccessful");
        }
    };

    return (
        <>
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
                    <label className="font-semibold text-2xl text-center block mb-5">Add Activity</label>
                    <form>

                        <FormControl fullWidth margin="normal">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDateTimePicker
                                    label="Activity Date"
                                    value={activityDate}
                                    onChange={(newDate) => setActivityDate(newDate)}
                                    required
                                    openTo="day"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}

                                    slotProps={{
                                        field: { clearable: true, onClear: () => setActivityDate(null) },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderColor: 'red',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>

                        <TextField
                            label="Amount Left"
                            fullWidth
                            value={amountLeft}
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        {selectedItemType === "Feeds" || selectedItemType === "Supplements" ? (
                            <TextField
                                label="Amount Consumed"
                                fullWidth
                                value={amountConsumed}
                                onChange={(e) => setAmountConsumed(e.target.value)}
                                margin="normal"
                            />
                        ) : selectedItemType === "Chicks" ? (
                            <>
                                <TextField
                                    label="Ready to Harvest"
                                    fullWidth
                                    value={readyToHarvest}
                                    onChange={(e) => setReadyToHarvest(e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    label="Undersized"
                                    fullWidth
                                    value={undersized}
                                    onChange={(e) => setUndersized(e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    label="Sold"
                                    fullWidth
                                    value={sold}
                                    onChange={(e) => setSold(e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    label="Mortality"
                                    fullWidth
                                    value={mortality}
                                    onChange={(e) => setMortality(e.target.value)}
                                    margin="normal"
                                />
                            </>
                        ) : null}

                        <div className="flex justify-end space-x-4 mt-6 gap-4">
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={handleAddClick}
                                disabled={!activityDate || !amountLeft || (selectedItemType === "Feeds" || selectedItemType === "Supplements" ? !amountConsumed : false)}
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

            {/* <ToastNotifications /> */}
        </>
    );
};

export default AddActivityModal;
