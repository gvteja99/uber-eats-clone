-- CREATE SCHEMA `ubereats_db` ;
CREATE DATABASE  IF NOT EXISTS `ubereats_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ubereats_db`;

-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: localhost    Database: grubhub
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Table structure for table `addresses`
--
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses`(
    `address_id` int(10) unsigned AUTO_INCREMENT,
    `street_address` varchar(60) DEFAULT NULL,
    `apt_number` varchar(60) DEFAULT NULL,
    `city` varchar(24) DEFAULT NULL,
    `state` varchar(24) DEFAULT NULL,
    `country` varchar(50) DEFAULT NULL,
    `zipcode` int(10) DEFAULT NULL,
    PRIMARY KEY (`address_id`)
    -- UNIQUE KEY `customer_id_UNIQUE` (`customer_id`)
    -- FOREIGN KEY (address_id)
    --     REFERENCES addresses (address_id)
    --     ON UPDATE RESTRICT ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `addresses` WRITE;
INSERT INTO `addresses` VALUES 
(10,'santa clara and 1st','103','San Jose','California','United States', 95001),
(13,'santa cruz and 3rd','203','Santa Clara','California','United States', 95005);
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers`(
    `customer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `first_name` varchar(60) NOT NULL,
    `last_name` varchar(60) NOT NULL,
    `email` varchar(60) NOT NULL,
    `password` varchar(255) NOT NULL,
    `phone_number` varchar(10) DEFAULT NULL,
    `dob` varchar(10) DEFAULT NULL,
    `nickname` varchar(10) DEFAULT NULL,
    `profile_pic` varchar(255) DEFAULT NULL,
    `about` varchar(60) DEFAULT NULL, 
    `customer_address_id` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`customer_id`),
    -- UNIQUE KEY `customer_id_UNIQUE` (`customer_id`)
    FOREIGN KEY (customer_address_id)
        REFERENCES addresses (address_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `customers` WRITE;
INSERT INTO `customers` VALUES 
(0143,'ab', 'cd','abc123@gmail.com','Password@123', '6692819900', '09-20-1996', 'abc','','', NULL),
(0057,'ef', 'gh','ccd532@gmail.com','Test@123','6692885555', '09-20-1996', 'abc','','', NULL);
UNLOCK TABLES;

ALTER Table customers ADD token varchar(255);

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants`(
    `res_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(60) NOT NULL,
    `email` varchar(60) NOT NULL,
    `password` varchar(255) NOT NULL,
    `address_id` int(10) unsigned NOT NULL,
    `delivery_option` int(1) DEFAULT 1,
    `phone_number` varchar(10) DEFAULT NULL,
    `description` varchar(255) DEFAULT NULL,
    `timing_open` varchar(30) DEFAULT NULL,
    `timing_close` varchar(30) DEFAULT NULL,
    PRIMARY KEY (`res_id`),
    UNIQUE KEY `res_id_UNIQUE` (`res_id`), `email_UNIQUE` (`email`),
    FOREIGN KEY (address_id)
        REFERENCES addresses (address_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `restaurants` WRITE;
INSERT INTO `restaurants` VALUES 
(014563,'dominos', 'abcdg123@gmail.com','T42word@123', 10, 1, '1111111111', 'descrp1...', '9.40', '21.00'),
(016763,'subway', 'abyu3@gmail.com','dfgdgrd@123', 13, 2, '2222222222', 'descrp2...', '6.40', '20.00');
UNLOCK TABLES;

ALTER Table restaurants ADD token varchar(255);

--
-- Table structure for table `restaurant_menu`
--
DROP TABLE IF EXISTS `restaurant_menu`;
CREATE TABLE `restaurant_menu`(
    `res_menu_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `res_id` int(10) unsigned NOT NULL,
    `dish_name` varchar(60) NOT NULL,
    `dish_image` varchar(255) DEFAULT NULL,
    `dish_price` float(40) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `main_ingredient` varchar(255) DEFAULT NULL,
    `dish_category` varchar(20) DEFAULT 'appetizer',
    `food_type` int(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`res_menu_id`),
    UNIQUE KEY `res_menu_id_UNIQUE` (`res_menu_id`), `res_id_UNIQUE` (`res_id`),
    FOREIGN KEY (res_id)
        REFERENCES restaurants (res_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- LOCK TABLES `restaurant_menu` WRITE;
INSERT INTO `restaurant_menu` VALUES 
(014893,14563, 'sushi', '', 9.4, 'dish descrp1...', '', 'appetizer', 1),
(0167883,16763,'seaweed', '', 7.0, 'dish descrp2...', 'fdf', 'main_course', 2);
-- UNLOCK TABLES;

--
-- Table structure for table `orders`
--
-- delivey status 1. recieved 2. preparing 3. on the way 4. delivered 5. pickup_ready 6. picked up 7. cancelled
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`(
    `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `res_id` int(10) unsigned NOT NULL,
    `customer_id` int(10) unsigned NOT NULL,
    `order_date_time` varchar(255) NOT NULL,
    --  1. delivery 2. pickup
    `delivery_type` int(1) DEFAULT 1
    `delivery_date_time` varchar(255) NULL,
    `delivery_address` varchar(500) NULL, 
    `delivery_status` int(10)  DEFAULT 1,
    `delivery_fee` float(40) DEFAULT 0,
    `taxes` float(40) DEFAULT 0,
    `tip` float(20) DEFAULT 0,
    `instruction` varchar(255) DEFAULT NULL,
    `total_amount` float(40) DEFAULT 0,

    PRIMARY KEY (`order_id`),
    UNIQUE KEY `order_id_UNIQUE` (`order_id`),
    FOREIGN KEY (res_id)
        REFERENCES restaurants (res_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- LOCK TABLES `restaurant_menu` WRITE;
-- INSERT INTO `orders` VALUES 
-- (014893,14563, 'sushi', '', 9.4, 'dish descrp1...', '', 'appetizer', 1),
-- (0167883,16763,'seaweed', '', 7.0, 'dish descrp2...', 'fdf', 'main_course', 2);
-- -- UNLOCK TABLES;

--
-- Table structure for table `order_items`
--
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`(
    `order_item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `order_id` int(10) unsigned NOT NULL,
    `res_menu_id` int(10) unsigned NOT NULL,
    `quantity` int(50) unsigned NOT NULL DEFAULT 1,

    PRIMARY KEY (`order_item_id`),
    UNIQUE KEY `order_item_id_UNIQUE` (`order_item_id`),
    FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (res_menu_id)
        REFERENCES restaurant_menu (res_menu_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- LOCK TABLES `restaurant_menu` WRITE;
-- INSERT INTO `orders` VALUES 
-- (014893,14563, 'sushi', '', 9.4, 'dish descrp1...', '', 'appetizer', 1),
-- (0167883,16763,'seaweed', '', 7.0, 'dish descrp2...', 'fdf', 'main_course', 2);
-- -- UNLOCK TABLES;


--
-- Table structure for table `favourites`
--
DROP TABLE IF EXISTS `favourites`;
CREATE TABLE `favourites`(
    `favourite_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `customer_id` int(10) unsigned NOT NULL,
    `res_id` int(10) unsigned NOT NULL,

    PRIMARY KEY (`favourite_id`),
    UNIQUE KEY `favourite_id_UNIQUE` (`favourite_id`),
    FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (res_id)
        REFERENCES restaurants (res_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- LOCK TABLES `restaurant_menu` WRITE;
-- INSERT INTO `orders` VALUES 
-- (014893,14563, 'sushi', '', 9.4, 'dish descrp1...', '', 'appetizer', 1),
-- (0167883,16763,'seaweed', '', 7.0, 'dish descrp2...', 'fdf', 'main_course', 2);
-- -- UNLOCK TABLES;

DROP TABLE IF EXISTS `delivery_addresses`;
CREATE TABLE `delivery_addresses`(
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `customer_id` int(10) unsigned NOT NULL,
    `address_id` int(10) unsigned NOT NULL,
    `is_default` boolean default FALSE,

    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (address_id)
        REFERENCES addresses (address_id)
        ON UPDATE CASCADE ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- LOCK TABLES `restaurant_menu` WRITE;
-- INSERT INTO `orders` VALUES 
-- (014893,14563, 'sushi', '', 9.4, 'dish descrp1...', '', 'appetizer', 1),
-- (0167883,16763,'seaweed', '', 7.0, 'dish descrp2...', 'fdf', 'main_course', 2);
-- -- UNLOCK TABLES;


