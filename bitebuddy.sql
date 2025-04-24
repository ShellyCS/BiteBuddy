CREATE DATABASE  IF NOT EXISTS `bitebuddy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bitebuddy`;
-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: localhost    Database: bitebuddy
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `objective` enum('Awareness','Engagement','Conversion') NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `status` enum('active','paused','completed') DEFAULT 'active',
  `impressions` int DEFAULT '0',
  `clicks` int DEFAULT '0',
  `restaurant_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_restaurant` (`restaurant_id`),
  CONSTRAINT `fk_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,'Summer Sizzlers','Awareness',120.00,'active',1500,130,229),(2,'Weekend Binge Blast','Engagement',200.00,'paused',2200,270,3883),(3,'Midnight Madness','Conversion',175.00,'active',1800,210,53490),(4,'Monsoon Meal Deal','Awareness',95.00,'completed',1000,80,121603),(5,'Lunch Combo Promo','Engagement',85.50,'active',1300,190,307050),(6,'Taco Tuesday','Conversion',145.00,'active',1700,205,334475),(7,'Happy Hour Special','Awareness',110.00,'paused',900,100,337335),(8,'Family Feast Friday','Engagement',180.00,'completed',1600,220,588012),(9,'Weekend Wings Offer','Conversion',160.00,'active',2000,240,471009),(10,'BBQ Burger Launch','Awareness',100.00,'active',1200,100,229),(11,'Lunch Combo Deal','Engagement',80.00,'active',950,85,3883),(12,'Friday Night Pizza Promo','Conversion',150.00,'paused',2000,180,53490),(13,'Happy Hour Special','Engagement',60.00,'active',890,73,121603),(14,'Weekend Breakfast Buzz','Awareness',50.00,'completed',1500,112,307050),(15,'Kids Eat Free Tuesday','Conversion',75.00,'active',2300,210,334475),(16,'Taco Thursday Fiesta','Engagement',95.00,'paused',1750,134,337335),(17,'Vegan Delights Launch','Awareness',130.00,'active',980,92,588012),(18,'Late Night Cravings','Engagement',110.00,'active',1450,120,471009),(19,'Birthday Bash Offer','Conversion',140.00,'active',1600,140,748104),(20,'Grill & Chill Nights','Awareness',210.00,'active',2500,300,748104);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (6,229,'Chicken Biryani',350.00,'Fragrant basmati rice cooked with tender chicken pieces and authentic spices','Biryani'),(7,229,'Mutton Biryani',450.00,'Slow-cooked basmati rice with juicy mutton pieces and aromatic spices','Biryani'),(8,229,'Prawn Biryani',500.00,'Basmati rice cooked with fresh prawns and signature spice blend','Biryani'),(9,229,'Andhra Chicken Curry',320.00,'Spicy chicken curry cooked in traditional Andhra style','Main Course'),(10,229,'Fish Fry',400.00,'Fresh fish marinated with spices and deep fried to perfection','Seafood'),(11,229,'Paneer Butter Masala',280.00,'Soft paneer cubes in a rich tomato and butter gravy','North Indian'),(12,229,'Gobi Manchurian',220.00,'Crispy cauliflower florets tossed in a spicy and tangy sauce','Chinese'),(13,229,'Masala Dosa',180.00,'Crispy rice crepe filled with spiced potato filling','South Indian'),(14,3883,'Masala Dosa',150.00,'Iconic crispy dosa with spiced potato filling, served with chutney and sambar','Breakfast'),(15,3883,'Idli Vada',120.00,'Steamed rice cakes and crispy lentil fritters with chutney and sambar','Breakfast'),(16,3883,'Upma',100.00,'Savory semolina porridge with vegetables and spices','Breakfast'),(17,3883,'Filter Coffee',60.00,'Traditional South Indian coffee with frothy milk','Beverages'),(18,3883,'Kesari Bath',80.00,'Sweet semolina pudding with saffron and dry fruits','Desserts'),(19,3883,'Rava Vada',110.00,'Crispy semolina fritters with curry leaves and spices','Snacks'),(20,3883,'Set Dosa',130.00,'Soft and fluffy pancakes served with chutney and sagu','Breakfast'),(21,3883,'Khara Bath',90.00,'Spicy semolina preparation with vegetables','Breakfast'),(22,53490,'Mangalorean Fish Curry',450.00,'Coastal style fish curry with coconut base','Coastal'),(23,53490,'Neer Dosa',180.00,'Thin rice crepes served with coconut chutney','South Indian'),(24,53490,'Schezwan Noodles',280.00,'Spicy noodles with vegetables in Schezwan sauce','Chinese'),(25,53490,'Jain Paneer Tikka',300.00,'Marinated cottage cheese grilled without onion and garlic','Jain'),(26,53490,'Elaneer Payasam',200.00,'Tender coconut pudding with condensed milk','Desserts'),(27,53490,'Kane Fry',400.00,'Ladyfish marinated with coastal spices and fried crisp','Coastal'),(28,53490,'Vegetable Manchurian',250.00,'Mixed vegetable dumplings in a savory sauce','Chinese'),(29,53490,'Gulab Jamun',150.00,'Sweet milk solids dumplings soaked in sugar syrup','Desserts'),(30,121603,'Kerala Porotta',60.00,'Layered flatbread made from maida flour','Kerala'),(31,121603,'Beef Fry',280.00,'Spicy beef preparation with Kerala spices','Kerala'),(32,121603,'Appam with Stew',180.00,'Fermented rice pancake with vegetable or chicken stew','Kerala'),(33,121603,'Karimeen Pollichathu',400.00,'Pearl spot fish marinated and grilled in banana leaf','Kerala'),(34,121603,'Chicken Fried Rice',220.00,'Wok-tossed rice with chicken and vegetables','Chinese'),(35,121603,'Chilli Chicken',280.00,'Spicy and tangy chicken preparation','Chinese'),(36,121603,'Puttu with Kadala Curry',160.00,'Steamed rice cake with black chickpea curry','Kerala'),(37,121603,'Dragon Chicken',300.00,'Spicy chicken with bell peppers in a fiery sauce','Chinese'),(38,307050,'Dim Sum Platter',350.00,'Assorted steamed dumplings with dipping sauces','Starters'),(39,307050,'Kung Pao Chicken',320.00,'Stir-fried chicken with peanuts and vegetables in spicy sauce','Main Course'),(40,307050,'Pad Thai',300.00,'Thai style stir-fried rice noodles with vegetables and crushed peanuts','Pan-Asian'),(41,307050,'Sichuan Chilli Garlic Noodles',280.00,'Hand-pulled noodles in a spicy garlic sauce','Chinese'),(42,307050,'Malaysian Laksa',380.00,'Spicy coconut curry soup with noodles and seafood','Pan-Asian'),(43,307050,'Mapo Tofu',260.00,'Soft tofu in a spicy sauce with minced meat','Chinese'),(44,307050,'Vietnamese Rice Paper Rolls',300.00,'Fresh vegetables and herbs wrapped in rice paper with dipping sauce','Pan-Asian'),(45,307050,'Honey Chilli Potato',220.00,'Crispy potato strips tossed in sweet and spicy sauce','Starters'),(46,334475,'Original Recipe Chicken',350.00,'Chicken pieces coated with the secret blend of 11 herbs and spices','Chicken'),(47,334475,'Zinger Burger',250.00,'Spicy chicken fillet with lettuce and mayo in a soft bun','Burgers'),(48,334475,'Chicken Biryani Bucket',400.00,'Fragrant rice with KFC chicken pieces and gravy','Biryani'),(49,334475,'Hot Wings',220.00,'Spicy chicken wings fried to perfection','Snacks'),(50,334475,'French Fries',120.00,'Crispy golden potato fries','Sides'),(51,334475,'Chicken Popcorn',180.00,'Bite-sized boneless chicken pieces, crispy outside and juicy inside','Snacks'),(52,334475,'Krushers',150.00,'Thick and creamy beverage in various flavors','Beverages'),(53,334475,'Double Down Burger',320.00,'Burger with chicken fillets instead of buns','Burgers'),(54,337335,'Malabar Biryani',280.00,'Kerala style biryani with fragrant rice and meat','Biryani'),(55,337335,'Kappa Biryani',240.00,'Unique biryani with tapioca and spices','Biryani'),(56,337335,'Kerala Parotta',50.00,'Layered flatbread made from refined flour','Breads'),(57,337335,'Fish Curry',260.00,'Traditional Kerala fish curry with coconut base','Main Course'),(58,337335,'Sulaimani Tea',40.00,'Black tea infused with spices and lemon','Beverages'),(59,337335,'Mint Lime Juice',60.00,'Refreshing lime juice with fresh mint leaves','Beverages'),(60,337335,'Thalassery Biryani',300.00,'Special biryani with short-grain rice and meat','Biryani'),(61,337335,'Beef Roast',280.00,'Slow-cooked beef with aromatic spices','Main Course'),(62,471009,'Mysore Masala Dosa',180.00,'Crispy dosa with spicy red chutney and potato filling','South Indian'),(63,471009,'Veggie Burger',150.00,'Grilled vegetable patty with lettuce and cheese in a soft bun','Fast Food'),(64,471009,'Pav Bhaji',140.00,'Spiced vegetable mash served with buttered bread rolls','Fast Food'),(65,471009,'Medu Vada',100.00,'Crispy savory doughnut made from urad dal','South Indian'),(66,471009,'Cold Coffee',120.00,'Creamy coffee blended with ice cream','Beverages'),(67,471009,'Cheese Sandwich',130.00,'Grilled sandwich with cheese and vegetables','Fast Food'),(68,471009,'Rava Idli',110.00,'Steamed semolina cakes with spices and vegetables','South Indian'),(69,471009,'French Fries',100.00,'Crispy potato fries with special seasoning','Fast Food'),(70,588012,'Margherita Pizza',400.00,'Classic pizza with tomato sauce, mozzarella, and basil','Pizzas'),(71,588012,'California Sushi Roll',450.00,'Inside-out roll with crab, avocado, and cucumber','Sushi'),(72,588012,'Pad Thai',380.00,'Thai stir-fried noodles with vegetables and peanuts','Thai'),(73,588012,'Caesar Salad',300.00,'Fresh romaine lettuce with Caesar dressing and croutons','Salads'),(74,588012,'Spaghetti Carbonara',420.00,'Creamy pasta with bacon and parmesan cheese','Pastas'),(75,588012,'Beef Burger',350.00,'Juicy beef patty with cheese and special sauce','Burgers'),(76,588012,'Nachos Grande',380.00,'Tortilla chips with melted cheese, salsa, and guacamole','Mexican'),(77,588012,'Kung Pao Chicken',420.00,'Stir-fried chicken with peanuts and vegetables in spicy sauce','Chinese'),(78,748103,'Kerala Chicken Biryani',450.00,'Aromatic biryani with chicken and traditional Kerala spices','Biryani'),(79,748103,'Seafood Biryani',550.00,'Special biryani with mixed seafood and aromatic rice','Biryani'),(80,748103,'Schezwan Fried Rice',380.00,'Spicy Chinese style rice with vegetables and choice of protein','Chinese'),(81,748103,'Chilli Chicken',400.00,'Spicy and tangy batter-fried chicken','Chinese'),(82,748103,'Dragon Prawns',500.00,'Crispy prawns tossed in a fiery sauce','Chinese'),(83,748103,'Thalassery Mutton Biryani',500.00,'Traditional Malabar style biryani with tender mutton pieces','Biryani'),(84,748103,'Vegetable Hakka Noodles',350.00,'Stir-fried noodles with mixed vegetables','Chinese'),(85,748103,'Fish in Hot Garlic Sauce',450.00,'Fish fillets cooked in a spicy garlic sauce','Chinese'),(86,748104,'Hyderabadi Chicken Biryani',350.00,'Authentic Hyderabadi style biryani with tender chicken pieces','Biryani'),(87,748104,'Butter Chicken',380.00,'Tender chicken in a rich tomato and butter gravy','North Indian'),(88,748104,'Paneer Tikka',320.00,'Marinated cottage cheese grilled in a tandoor','Starters'),(89,748104,'Veg Manchurian',280.00,'Mixed vegetable dumplings in a savory sauce','Chinese'),(90,748104,'Tandoori Roti',40.00,'Whole wheat flatbread baked in tandoor','Breads'),(91,748104,'Mutton Rogan Josh',400.00,'Slow-cooked mutton in a rich Kashmiri gravy','North Indian'),(92,748104,'Dal Makhani',250.00,'Creamy black lentils simmered overnight with spices and butter','North Indian'),(93,748104,'Chicken 65',320.00,'Spicy South Indian style chicken appetizer','Starters');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,12,748104,'Biryani',200.00,'pending','2025-03-28 01:29:00'),(7,10,748104,'[{\"id\":87,\"name\":\"Butter Chicken\",\"price\":\"380.00\",\"quantity\":1},{\"id\":91,\"name\":\"Mutton Rogan Josh\",\"price\":\"400.00\",\"quantity\":1},{\"id\":89,\"name\":\"Veg Manchurian\",\"price\":\"280.00\",\"quantity\":1}]',1060.00,'pending','2025-04-16 02:37:40'),(8,10,748104,'[{\"name\":\"Hyderabadi Chicken Biryani\"},{\"name\":\"Tandoori Roti\"},{\"name\":\"Veg Manchurian\"}]',670.00,'pending','2025-04-16 02:45:32'),(9,10,748104,'[{\"id\":87,\"name\":\"Butter Chicken\",\"price\":\"380.00\",\"quantity\":1},{\"id\":91,\"name\":\"Mutton Rogan Josh\",\"price\":\"400.00\",\"quantity\":1},{\"id\":92,\"name\":\"Dal Makhani\",\"price\":\"250.00\",\"quantity\":1}]',1030.00,'pending','2025-04-16 02:56:26');
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
) ENGINE=InnoDB AUTO_INCREMENT=748106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES (229,'Meghana Foods','xqwpuhgnsaf18te7zvtv',500,29,4.4,'Biryani,Andhra,South Indian,North Indian,Chinese,Seafood',0,'124, Near Jyothi Nivas College, 1st Cross, KHB Colony, Koramangala 5th Block, Bangalore','Bangalore','Koramangala'),(3883,'Vidyarthi Bhavan','tvur6lwwvnd2euflpswm',450,34,4.6,'South Indian',0,'Basavanagudi','Bangalore','Basavanagudi'),(53490,'Palmgrove Ballal Residency','wf83wrssazu2prtt7rss',500,26,4.7,'Chinese,Coastal,Desserts,Jain,South Indian',0,'Ashok Nagar','Bangalore','Ashok Nagar'),(121603,'Kannur Food Point','bmwn4n4bn6n1tcpc8x2h',400,31,3.8,'Kerala,Chinese',0,'6/21,9TH CROSS, 1ST MAIN, VENKATESHWARA LAYOUT, SG PALYA, BENGALURU, - 560093','Bangalore','Tavarekere'),(307050,'Call Me Chow','soegobqsiqvhmkfvnnkj',400,29,4.3,'Chinese,Pan-Asian',1,'Call Me Chow, No. 364/A, Ground Floor, 3rd Cross, VSR Layout, Koramangala 8th Block, Bengaluru, Karnataka - 560095','Bangalore','Koramangala'),(334475,'KFC','bdcd233971b7c81bf77e1fa4471280eb',400,36,3.8,'Burgers,Biryani,American,Snacks,Fast Food',1,'KFC restaurants, 942, SV Tower, 16th Main, BTM 2nd Stage, 560076','Bangalore','BTM Layout'),(337335,'Kannur Food Kitchen','a27weqanhnszqiuzsoik',300,30,3.8,'Kerala,Biryani,Beverages',0,'kannur food point, Chocolate Factory Road, Tavarekere, Cashier Layout, 1st Stage, BTM Layout, thavrakharea, Karnataka, India','Bangalore','BTM Layout'),(471009,'Virinchi Cafe','yiu5hkb4fqwhtftmmq8v',250,18,4.5,'South Indian,Fast Food,fastfood',1,'Residency Road','Bangalore','Ashok Nagar'),(588012,'SMOOR','RX_THUMBNAIL/IMAGES/VENDOR/2025/2/18/67c1f259-4791-40ac-b552-4153de288966_588012.jpg',450,27,4.6,'Asian,Burgers,Italian,Thai,Sushi,Salads,Pastas,Pizzas,Mexican,Chinese',0,'Lavelle Road','Bangalore','Lavelle Road'),(748103,'Thenga Manga by Chef Pillai','2d77b522e8d5845b1f4a72fa68bb5d18',500,27,4.1,'Chinese,Biryani',0,'Brigade Road','Bangalore','Central Bangalore'),(748104,'bawarchi','55',400,30,4.0,'Various Cuisines',0,'boston','Bangalore','Indiranagar'),(748105,'Eately','default-image',30000,30,4.0,'Various Cuisines',0,'Downtown Boston','Bangalore','Local Area');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'fouzan','fouzan1@gmail.com','$2b$10$1DSZ1t4Jtd/4Oyi4mg4VouDWJiDhtPJqnL95.GsQW/Ougxbdy2xgC','diner',NULL,'2025-03-26 20:51:59','2025-03-26 20:51:59'),(12,'fouzan','fouzan321@gmail.com','$2a$10$BxytfhD8W3t4sK/1ngF6keV0Tqa37.4NBJaha62LLXbX96eYbzTra','restaurant',748104,'2025-03-27 00:23:57','2025-04-15 07:01:44'),(13,NULL,'fouzan123@gmail.com','$2a$10$BxytfhD8W3t4sK/1ngF6keV0Tqa37.4NBJaha62LLXbX96eYbzTra','restaurant',748105,'2025-04-15 06:07:51','2025-04-15 06:07:51');
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

-- Dump completed on 2025-04-16  3:22:54




-- Add payment columns to orders table
ALTER TABLE orders
ADD COLUMN payment_intent_id VARCHAR(255) NULL,
ADD COLUMN payment_status ENUM('pending', 'completed', 'failed') DEFAULT NULL;
