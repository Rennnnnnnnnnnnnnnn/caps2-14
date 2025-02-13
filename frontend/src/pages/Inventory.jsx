import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
// Components
import Navbar from '../components/Navbar';
import { Button } from '@mui/material';
// Modals
import AddActivityModal from '../components/modals/AddActivityModal.jsx';
import EditActivityModal from '../components/modals/EditActivityModal.jsx';
import ConfirmationModal from '../components/modals/ConfirmationModal.jsx';

function Inventory() {
  // Modals
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Item-related state
  const [itemTypeChoices, setItemTypeChoices] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');
  const [itemStockDetails, setItemStockDetails] = useState('');
  // Inventory data
  const [selectedInventoryData, setSelectedInventoryData] = useState('');

  // FORMAT DATE
  function formatDateToReadableString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  useEffect(() => {
    if (isAddActivityModalOpen) {
      setIsEditActivityModalOpen(false);
    }
  }, [isAddActivityModalOpen]);

  useEffect(() => {
    if (isEditActivityModalOpen) {
      setIsAddActivityModalOpen(false);
    }
  }, [isEditActivityModalOpen]);

  // FETCH ITEM TYPES
  useEffect(() => {
    const fetchItemTypes = async () => {
      try {
        const response = await axios.get('/api/inventory/item-types');
        setItemTypeChoices(response.data.result);
      } catch (error) {
        console.error('Error fetching item types:', error);
      }
    };
    fetchItemTypes();
  }, []);

  // HANDLE ADD CLICK
  const handleAddClick = (item) => {
    setIsAddActivityModalOpen(true);
    setSelectedInventoryData(item);
  };


  const handleEdit = (item) => {
    setIsEditActivityModalOpen(true);
    setSelectedInventoryData(item);
  };

  const handleDeleteClick = (item) => {
    setIsConfirmationModalOpen(true);
    setSelectedInventoryData(item);

  }








  const handleConfirmDelete = async () => {
    try {
      // Destructure the selectedInventoryData to get the id, itemType, itemName, and batchId
      const { id, item_type: itemType, item_name: itemName, batch_id: batchId } = selectedInventoryData;

      console.log("Selected Inventory Data:", selectedInventoryData); // Logging the full selectedInventoryData
      console.log("Selected ID:", id, "Item Type:", itemType, "Item Name:", itemName, "Batch ID:", batchId);

      // Send a DELETE request with data in the body
      const response = await axios.delete(`/api/inventory/delete-inventory-record/${id}`, {
        data: {
          itemType,
          itemName,
          batchId,
        },
      });
      setIsConfirmationModalOpen(false);
      // Check if the deletion was successful
      if (response.status === 200) {
        // Optionally display a success notification
        toast.success('Record deleted successfully.');
        // Optionally, refresh the item list by refetching or updating state
        fetchItemStockDetails();
      } else {
        toast.error('Failed to delete the record. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('An error occurred while deleting the record.');
    } finally {
      // Close the confirmation modal
      setIsConfirmationModalOpen(false);
    }
  };








  // FETCH ITEM STOCK DETAILS
  const fetchItemStockDetails = async () => {
    try {
      const itemType = selectedItemType;
      const itemName = selectedItemName;
      let tableName = '';

      if (selectedItemType === "Feeds") {
        tableName = 'feeds_inv';
      } else if (selectedItemType === "Supplements") {
        tableName = 'supplements_inv';
      } else if (selectedItemType === "Chicks") {
        tableName = 'chicks_inv';
      } else {
        return;
      }

      if (tableName) {
        const response = await axios.post('/api/inventory/item-stock-details', {
          table_name: tableName,
          item_type: itemType,
          item_name: itemName,
        });
        setItemStockDetails(response.data.result);
      } else {
        console.error('No valid table name found for the selected item type');
      }
    } catch (error) {
      console.error('Error fetching item stock details:', error);
    }
  };

  useEffect(() => {
    fetchItemStockDetails();
  }, [selectedItemType && selectedItemName]);

  // DETERMINE UNITS
  let units = '';
  if (selectedItemType === "Feeds" || selectedItemType === "Supplements") {
    units = " kilos";
  } else if (selectedItemType === "Chicks") {
    units = " heads";
  } else {
    units = "N/A";
  }

  // HANDLE ITEM TYPE CHANGE
  const handleItemTypeChange = (choice) => {
    setSelectedItemType(choice.item_type);
    setSelectedItemName(choice.item_name);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row bg-blue-100">
        <div className="mb-4 bg-red-200 flex flex-col p-4">
          <label className="text-center">Item Types</label>
          <div>
            {/* Render radio buttons for each item type choice */}
            {itemTypeChoices.map((choice, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`itemType-${index}`}
                  name="itemType"
                  value={choice.item_type}
                  checked={selectedItemType === choice.item_type && selectedItemName === choice.item_name} // Ensure both item_type and item_name match
                  onChange={() => handleItemTypeChange(choice)} // Pass the whole choice object containing both item_type and item_name
                />
                <label htmlFor={`itemType-${index}`}>
                  {choice.item_type}: {choice.item_name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="main container mx-auto p-4 bg-orange-200">
          {/* Inventory table */}
          <div className="main container mx-auto p-4 bg-orange-200">
            {/* Conditional table for "Chicks" vs other item types */}
            <div className="overflow-y-auto h-[80vh] border border-gray-700 rounded-tr-lg shadow-md">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-gray-700 sticky top-0">
                  {selectedItemType === 'Chicks' ? (
                    // Table headers for "Chicks"
                    <tr>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Date</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Amount Left</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Ready for Harvest</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Undersized</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Sold</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Mortality</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600"></th>
                    </tr>
                  ) : (
                    // Table headers for other item types
                    <tr>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Date</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Amount Left</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600">Amount Consumed</th>
                      <th className="border-b px-4 py-2 text-sm border-gray-600"></th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {itemStockDetails.length > 0 ? (
                    itemStockDetails.map((item, index) => (
                      <tr key={index}>
                        {selectedItemType === 'Chicks' ? (
                          // Table rows for "Chicks"
                          <>
                            {/* <td className="py-2 px-4">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td> */}
                            <td className="py-2 px-4">{formatDateToReadableString(item.date)}</td>
                            <td className="py-2 px-4">{item.amount_left}{units}</td>
                            <td className="py-2 px-4">{item.ready_to_harvest}{units}</td>
                            <td className="py-2 px-4">{item.undersized}{units}</td>
                            <td className="py-2 px-4">{item.sold}{units}</td>
                            <td className="py-2 px-4">{item.mortality}{units}</td>
                            <td className="py-2 px-4">
                              <Button
                                disabled={item.amount_left === "0.00"}
                                variant="contained"
                                onClick={() => {
                                  handleAddClick(item);
                                }}>

                                Add
                              </Button>
                            </td>
                          </>
                        ) : (
                          // Table rows for other item types
                          <>
                            {/* <td className="py-2 px-4">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td> */}
                            <td className="py-2 px-4">{formatDateToReadableString(item.date)}</td>
                            <td className="py-2 px-4">{item.amount_left}{units}</td>
                            <td className="py-2 px-4">{item.amount_consumed ? `${item.amount_consumed}${units}` : ''}</td>
                            <td className="py-2 px-4">
                              {item.amount_consumed ? (
                                <>
                                  <Button variant="contained" onClick={() => handleEdit(item)} sx={{ backgroundColor: 'orange' }}>
                                    Edit
                                  </Button>
                                  <Button variant="contained" onClick={() => handleDeleteClick(item)} sx={{ backgroundColor: 'red' }}>
                                    Delete
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  disabled={item.amount_left === "0.00"}
                                  variant="contained"
                                  onClick={() => {
                                    handleAddClick(item);
                                  }}>
                                  Add
                                </Button>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">No stock details available</td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div >
      {/* Add Activity Modal */}
      {isAddActivityModalOpen && (
        <div className={`fixed inset-0 ${isAddActivityModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
          <AddActivityModal
            isOpen={isAddActivityModalOpen}
            handleClose={() => setIsAddActivityModalOpen(false)}
            selectedInventoryData={selectedInventoryData}
            fetchItemStockDetails={fetchItemStockDetails}
            selectedItemType={selectedItemType}
            selectedItemName={selectedItemName}
          />
        </div>
      )}
      {/* Add Activity Modal*/}
      {isEditActivityModalOpen && (
        <div className={`fixed inset-0 ${isEditActivityModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
          <EditActivityModal
            isOpen={isEditActivityModalOpen}
            handleClose={() => setIsEditActivityModalOpen(false)}
            selectedInventoryData={selectedInventoryData}
            fetchItemStockDetails={fetchItemStockDetails}
            selectedItemType={selectedItemType}
            selectedItemName={selectedItemName}
          />
        </div>
      )}
      {/* Confirmation Modal */}

      {isConfirmationModalOpen && (
        <div className={`fixed inset-0 ${isConfirmationModalOpen ? 'backdrop-blur-sm' : ''} transition-all`}>
          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onConfirm={() => handleConfirmDelete()}
            onCancel={() => setIsConfirmationModalOpen(false)}
            message={"Are you sure you want to delete this record?"}
          />
        </div>
      )}


    </>
  );
}

export default Inventory;
