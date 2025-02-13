-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 13, 2025 at 09:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mpf_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `name`, `email`, `password`) VALUES
(12, 'qwe', 'qwe@gmail.com', '$2a$10$rhTMjc/goUms8pLCRXbhYu/onlDgB4vUroUQe13NGXZAyh1t9POKy');

-- --------------------------------------------------------

--
-- Table structure for table `batch`
--

CREATE TABLE `batch` (
  `batch_id` int(11) NOT NULL,
  `batch_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`batch_id`, `batch_name`, `start_date`, `end_date`, `is_active`) VALUES
(1, 'Batch Name', '2025-02-02', NULL, 1),
(12, 'Batch Name', '2025-02-08', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `chicks_inv`
--

CREATE TABLE `chicks_inv` (
  `id` int(255) NOT NULL,
  `batch_id` int(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `amount_left` int(255) DEFAULT NULL,
  `ready_to_harvest` int(255) DEFAULT NULL,
  `undersized` int(255) DEFAULT NULL,
  `sold` int(255) DEFAULT NULL,
  `mortality` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chicks_inv`
--

INSERT INTO `chicks_inv` (`id`, `batch_id`, `item_type`, `item_name`, `date`, `amount_left`, `ready_to_harvest`, `undersized`, `sold`, `mortality`) VALUES
(4, 12, 'Chicks', 'sisiw na dilaw', '2025-02-13 20:36:27', 800, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feeds_inv`
--

CREATE TABLE `feeds_inv` (
  `batch_id` int(255) NOT NULL,
  `id` int(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `amount_left` decimal(11,2) DEFAULT NULL,
  `amount_consumed` decimal(11,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feeds_inv`
--

INSERT INTO `feeds_inv` (`batch_id`, `id`, `item_type`, `item_name`, `date`, `amount_left`, `amount_consumed`) VALUES
(12, 186, 'Feeds', 'starter', '2025-02-14 02:04:37', 25.00, 5.00),
(12, 187, 'Feeds', 'starter', '2025-02-14 02:05:04', 20.00, 1.00),
(12, 188, 'Feeds', 'starter', '2025-02-14 02:05:08', 19.00, 1.00),
(12, 190, 'Feeds', 'starter', '2025-02-14 02:05:14', 18.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `batch_id` int(255) NOT NULL,
  `item_id` int(255) NOT NULL,
  `inventory_date` date NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `amount_consumed` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplements_inv`
--

CREATE TABLE `supplements_inv` (
  `batch_id` int(255) NOT NULL,
  `id` int(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `amount_left` decimal(65,2) DEFAULT NULL,
  `amount_consumed` decimal(65,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplements_inv`
--

INSERT INTO `supplements_inv` (`batch_id`, `id`, `item_type`, `item_name`, `date`, `amount_left`, `amount_consumed`) VALUES
(12, 75, 'Supplements', 'atobe', '2025-02-14 02:09:34', 500.00, 5.00),
(12, 77, 'Supplements', 'atobe', '2025-02-14 03:44:59', 495.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(255) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `transaction_type` varchar(255) NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` decimal(65,0) NOT NULL,
  `price_per_unit` decimal(65,2) NOT NULL,
  `total_cost` decimal(11,2) NOT NULL,
  `batch_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_date`, `transaction_type`, `contact_name`, `item_type`, `item_name`, `quantity`, `price_per_unit`, `total_cost`, `batch_id`) VALUES
(102, '2025-02-13 20:36:27', 'Expense', 'seller', 'Chicks', 'sisiw na dilaw', 800, 40.00, 32000.00, 12),
(103, '2025-02-13 20:45:51', 'Expense', 'boyet', 'Feeds', 'starter', 40, 20.00, 800.00, 12),
(104, '2025-02-14 01:47:47', 'Expense', 'atobe seller', 'Supplements', 'atobe', 500, 20.00, 10000.00, 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `batch`
--
ALTER TABLE `batch`
  ADD PRIMARY KEY (`batch_id`);

--
-- Indexes for table `chicks_inv`
--
ALTER TABLE `chicks_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feeds_inv`
--
ALTER TABLE `feeds_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `supplements_inv`
--
ALTER TABLE `supplements_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `batch`
--
ALTER TABLE `batch`
  MODIFY `batch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chicks_inv`
--
ALTER TABLE `chicks_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feeds_inv`
--
ALTER TABLE `feeds_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `item_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `supplements_inv`
--
ALTER TABLE `supplements_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
