import { useState } from 'react';
import './App.css';
import Login from './auth/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './auth/Register';
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import BatchHistory from './pages/BatchHistory';


import ToastNotifications from '../src/components/ToastNotification.jsx'; // Assuming it's in the same folder

import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastNotifications />
   
    <Router>
    
      {/* <ToastContainer /> */}
    

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/batch-history" element={<BatchHistory />} />
        {/* <Route path="/batch-history" element={<BatchHistory />} /> */}
        {/* <Route path="/accounts" element={<Accounts />} /> */}

      </Routes>
    </Router>

    </>


  );
}

export default App;
