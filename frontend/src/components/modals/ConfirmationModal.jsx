import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div> {/* Background overlay */}

      <div className="relative max-w-md w-full rounded-xl p-6 bg-white shadow-2xl z-50"> {/* Modal container */}
        <p className="text-lg font-bold text-gray-700 mb-4 text-left">⚠️ Warning: This action is irreversible</p> {/* Warning message */}

        <hr className="border-t border-gray-300 mb-6" /> {/* Divider line */}

        <p className="text-md text-gray-700 mb-8 text-center">{message}</p> {/* Modal message */}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-200 ease-in-out shadow-md"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-200 ease-in-out shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

};

export default ConfirmationModal;
