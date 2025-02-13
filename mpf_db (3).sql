-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2025 at 12:37 AM
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
(1, 'Batch Name', '2025-02-02', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `feeds_chickbooster_inv`
--

CREATE TABLE `feeds_chickbooster_inv` (
  `id` int(255) NOT NULL,
  `date` date DEFAULT NULL,
  `quantity` decimal(65,0) DEFAULT 0,
  `amount_consumed` decimal(65,0) DEFAULT 0,
  `batch_id` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feeds_chickbooster_inv`
--

INSERT INTO `feeds_chickbooster_inv` (`id`, `date`, `quantity`, `amount_consumed`, `batch_id`) VALUES
(2, '0000-00-00', 1, 0, 1),
(3, NULL, 50, 0, 1),
(4, NULL, 50, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `feeds_starter_inv`
--

CREATE TABLE `feeds_starter_inv` (
  `id` int(255) NOT NULL,
  `date` date NOT NULL,
  `amount_consumed` decimal(65,0) NOT NULL,
  `quantity` decimal(65,0) NOT NULL,
  `batch_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `batch_id` int(255) NOT NULL,
  `item_id` int(255) NOT NULL,
  `inventory_date` date NOT NULL,
  `item_type` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `amount_consumed` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`batch_id`, `item_id`, `inventory_date`, `item_type`, `quantity`, `amount_consumed`) VALUES
(1, 2, '2025-02-05', 'Feeds: Starter', '500', 0),
(1, 3, '2025-02-05', 'Feeds: Starter', '500', 0),
(1, 4, '2025-02-05', 'Chicks', '500', 0),
(1, 5, '2025-02-05', 'Feeds: Finisher', '5', 0),
(1, 6, '2025-02-05', 'Livestock', '80', 0),
(1, 7, '2025-02-05', 'Livestock', '80', 0),
(1, 8, '2025-02-05', 'Dressed', '2', 0),
(1, 9, '2025-02-05', 'Livestock', '300', 0),
(1, 10, '2025-02-05', 'Feeds: Starter', '200', 0),
(1, 11, '0000-00-00', 'Feeds: Starter', '40', 0),
(1, 12, '0000-00-00', 'Feeds: Starter', '2', 0);

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
  `quantity` int(255) NOT NULL,
  `price_per_unit` double NOT NULL,
  `total_cost` int(255) NOT NULL,
  `batch_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_date`, `transaction_type`, `contact_name`, `item_type`, `quantity`, `price_per_unit`, `total_cost`, `batch_id`) VALUES
(130, '2025-02-06 20:25:18', 'Expense', ' ', 'Feeds: Chick Booster', 50, 50, 2500, 1);

-- --------------------------------------------------------

--
-- Table structure for table `vitamins_atobe_inv`
--

CREATE TABLE `vitamins_atobe_inv` (
  `id` int(255) NOT NULL,
  `date` date NOT NULL,
  `quantity` decimal(65,0) NOT NULL,
  `amount_consumed` decimal(65,0) NOT NULL,
  `batch_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vitamins_molases_inv`
--

CREATE TABLE `vitamins_molases_inv` (
  `id` int(255) NOT NULL,
  `date` date NOT NULL,
  `quantity` decimal(65,0) NOT NULL,
  `amount_consumed` decimal(65,0) NOT NULL,
  `batch_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `feeds_chickbooster_inv`
--
ALTER TABLE `feeds_chickbooster_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feeds_starter_inv`
--
ALTER TABLE `feeds_starter_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `vitamins_atobe_inv`
--
ALTER TABLE `vitamins_atobe_inv`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vitamins_molases_inv`
--
ALTER TABLE `vitamins_molases_inv`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `batch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `feeds_chickbooster_inv`
--
ALTER TABLE `feeds_chickbooster_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feeds_starter_inv`
--
ALTER TABLE `feeds_starter_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `item_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `vitamins_atobe_inv`
--
ALTER TABLE `vitamins_atobe_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vitamins_molases_inv`
--
ALTER TABLE `vitamins_molases_inv`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

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
