
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifications = () => {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover 
                style={{
                    whiteSpace: 'nowrap', 
                    width: '400px'
                }}
            />
        </>
    );
};

export default ToastNotifications;
