-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: localhost    Database: bitebuddy
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS bitebuddy;
USE bitebuddy;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `items` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','preparing','ready','completed') NOT NULL DEFAULT 'pending',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,10,748104,'1',200.00,'pending','2025-03-28 01:29:00');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `restaurant_id` int NOT NULL,
  `customer_name` text NOT NULL,
  `customer_email` text NOT NULL,
  `customer_phone` text NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `guests` int NOT NULL,
  `occasion` text,
  `special_requests` text,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reservations_restaurant_date` (`restaurant_id`,`date`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES ('564c7002-0ac6-11f0-8f3f-aed51f1c31a0',748104,'rcdwc','fouzan1@gmail.com','2446355','2025-03-27','12:30:00',2,'','','pending','2025-03-27 04:45:41'),('67011038-0ac6-11f0-8f3f-aed51f1c31a0',748104,'rcdwc','ahmedfouzan768@gmail.com','2446355','2025-03-27','12:30:00',2,'','','pending','2025-03-27 04:46:09'),('b1773460-0aa0-11f0-8f3f-aed51f1c31a0',53490,'dx','ecfd@gmail.com','fce','2025-04-04','13:30:00',2,'','','pending','2025-03-27 00:16:13'),('f2e7dfe0-0491-11f0-8f3f-aed51f1c31a0',121603,'dd','dd@gdj.com','d','2025-03-28','12:00:00',2,'','d','pending','2025-03-19 07:15:34');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cloudinaryImageId` varchar(255) NOT NULL,
  `costForTwo` int NOT NULL,
  `deliveryTime` int NOT NULL,
  `avgRating` decimal(2,1) NOT NULL,
  `cuisines` text NOT NULL,
  `promoted` tinyint(1) DEFAULT '0',
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=748105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES (229,'Meghana Foods','xqwpuhgnsaf18te7zvtv',50000,29,4.4,'Biryani,Andhra,South Indian,North Indian,Chinese,Seafood',0,'124, Near Jyothi Nivas College, 1st Cross, KHB Colony, Koramangala 5th Block, Bangalore','Bangalore','Koramangala'),(3883,'Vidyarthi Bhavan','tvur6lwwvnd2euflpswm',150,34,4.6,'South Indian',0,'Basavanagudi','Bangalore','Basavanagudi'),(53490,'Palmgrove Ballal Residency','wf83wrssazu2prtt7rss',400,26,4.7,'Chinese,Coastal,Desserts,Jain,South Indian',0,'Ashok Nagar','Bangalore','Ashok Nagar'),(121603,'Kannur Food Point','bmwn4n4bn6n1tcpc8x2h',30000,31,3.8,'Kerala,Chinese',0,'6/21,9TH CROSS, 1ST MAIN, VENKATESHWARA LAYOUT, SG PALYA, BENGALURU, - 560093','Bangalore','Tavarekere'),(307050,'Call Me Chow','soegobqsiqvhmkfvnnkj',40000,29,4.3,'Chinese,Pan-Asian',1,'Call Me Chow, No. 364/A, Ground Floor, 3rd Cross, VSR Layout, Koramangala 8th Block, Bengaluru, Karnataka - 560095','Bangalore','Koramangala'),(334475,'KFC','bdcd233971b7c81bf77e1fa4471280eb',40000,36,3.8,'Burgers,Biryani,American,Snacks,Fast Food',1,'KFC restaurants, 942, SV Tower, 16th Main, BTM 2nd Stage, 560076','Bangalore','BTM Layout'),(337335,'Kannur Food Kitchen','a27weqanhnszqiuzsoik',20000,30,3.8,'Kerala,Biryani,Beverages',0,'kannur food point, Chocolate Factory Road, Tavarekere, Cashier Layout, 1st Stage, BTM Layout, thavrakharea, Karnataka, India','Bangalore','BTM Layout'),(471009,'Virinchi Cafe','yiu5hkb4fqwhtftmmq8v',250,18,4.5,'South Indian,Fast Food,fastfood',1,'Residency Road','Bangalore','Ashok Nagar'),(588012,'SMOOR','RX_THUMBNAIL/IMAGES/VENDOR/2025/2/18/67c1f259-4791-40ac-b552-4153de288966_588012.jpg',450,27,4.6,'Asian,Burgers,Italian,Thai,Sushi,Salads,Pastas,Pizzas,Mexican,Chinese',0,'Lavelle Road','Bangalore','Lavelle Road'),(748103,'Thenga Manga by Chef Pillai','2d77b522e8d5845b1f4a72fa68bb5d18',500,27,4.1,'Chinese,Biryani',0,'Brigade Road','Bangalore','Central Bangalore'),(748104,'bawarchi','55',30000,30,4.0,'Various Cuisines',0,'boston','Default City','Default Area');
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('diner','restaurant') DEFAULT 'diner',
  `restaurant_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'fouzan','fouzan1@gmail.com','$2b$10$1DSZ1t4Jtd/4Oyi4mg4VouDWJiDhtPJqnL95.GsQW/Ougxbdy2xgC','diner',NULL,'2025-03-26 20:51:59','2025-03-26 20:51:59'),(12,'fouzan','fouzan321@gmail.com','$2a$10$QzZY/WasEymCqONpJwTRTu8aLIX3oB6J1i/qEXM1/N0l2y0By9ZCm','restaurant',748104,'2025-03-27 00:23:57','2025-03-27 00:23:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-30  5:05:10
