import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Modal, Box, Button, TextField, FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import ConfirmationModal from './ConfirmationModal'; // Import your confirmation modal

const EditActivityModal = ({
  isOpen,
  handleClose,
  selectedInventoryData,
  fetchItemStockDetails,
  selectedItemType,
}) => {
  const [Id, setId] = useState('');
  const [activityDate, setActivityDate] = useState(dayjs());
  const [amountLeft, setAmountLeft] = useState('');
  const [amountConsumed, setAmountConsumed] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State to control confirmation modal

  useEffect(() => {
    if (isOpen) {
      setId(selectedInventoryData.id);
      setActivityDate(dayjs(selectedInventoryData.date));
      setAmountLeft(selectedInventoryData.amount_left);
      setAmountConsumed(selectedInventoryData.amount_consumed);
      console.log('dato', selectedInventoryData);
    }
  }, [isOpen]);

  const handleSaveClick = async () => {
    try {
      const itemData = {
        id: Id,
        date: activityDate.format('YYYY-MM-DD HH:mm:ss'),
        amount_left: amountLeft,
        amount_consumed: amountConsumed,
      };

      let urlEndpoint;
      if (selectedItemType === 'Feeds') {
        urlEndpoint = '/api/inventory/edit-feeds-in-stock';
      } else if (selectedItemType === 'Supplements') {
        urlEndpoint = '/api/inventory/edit-supplements-in-stock';
      } else {
        console.log('Invalid selected item type!');
      }

      const response = await axios.post(urlEndpoint, itemData);

      console.log('Response:', response.data);
      handleClose();
      toast.success('Activity successfully updated!');
      fetchItemStockDetails();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Error: Activity update unsuccessful');
    }
  };

  const handleOpenConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleClickConfirm = () => {
    setIsConfirmationOpen(false); // Close confirmation modal
    handleSaveClick(); // Proceed with save action
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false); // Close confirmation modal
  };

  return (
    <>
      {/* Edit Activity Modal */}
      <Modal
        open={isOpen && !isConfirmationOpen} // Don't show if confirmation modal is open
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
          <label className="font-semibold text-2xl text-center block mb-5">Edit Activity</label>
          <form>
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDateTimePicker
                  label="Activity Date"
                  value={activityDate}
                  onChange={(newDate) => setActivityDate(newDate)}
                  required
                  openTo="day" // Controls which view to open first
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  slotProps={{
                    field: { clearable: true, onClear: () => setActivityDate(null) },
                  }}
                />
              </LocalizationProvider>
            </FormControl>

            <TextField
  label="Amount Left"
  fullWidth
  value={amountLeft}
  InputProps={{
    readOnly: true,
  }}
  margin="normal"
/>

            <TextField
              label="Amount Consumed"
              fullWidth
              value={amountConsumed}
              onChange={(e) => setAmountConsumed(e.target.value)}
              margin="normal"
            />

            <div className="flex justify-end space-x-4 mt-6 gap-4">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={handleOpenConfirmation} // Open confirmation modal when "Save" is clicked
                disabled={!activityDate || !amountLeft || !amountConsumed}
                sx={{
                  width: '90px',
                  height: '45px',
                }}
              >
                Save
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen} // Show confirmation modal when needed
        onConfirm={handleClickConfirm} // Confirm action
        onCancel={handleCancelConfirmation} // Cancel confirmation
        message="Are you sure you want to save the changes?"
      />
    </>
  );
};

export default EditActivityModal;
