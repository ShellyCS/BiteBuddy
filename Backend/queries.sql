CREATE DATABASE IF NOT EXISTS bitebuddy;

USE bitebuddy;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type ENUM('diner', 'restaurant') DEFAULT 'diner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE restaurant (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cloudinaryImageId VARCHAR(255) NOT NULL,
    costForTwo INT NOT NULL,
    deliveryTime INT NOT NULL,
    avgRating DECIMAL(2,1) NOT NULL,
    cuisines TEXT NOT NULL,
    promoted BOOLEAN DEFAULT FALSE,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL
);

INSERT INTO restaurant (id, name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, promoted, address, city, area) 
VALUES 
(334475, 'KFC', 'bdcd233971b7c81bf77e1fa4471280eb', 40000, 36, 3.8, 'Burgers,Biryani,American,Snacks,Fast Food', TRUE, 
'KFC restaurants, 942, SV Tower, 16th Main, BTM 2nd Stage, 560076', 'Bangalore', 'BTM Layout'),

(229, 'Meghana Foods', 'xqwpuhgnsaf18te7zvtv', 50000, 29, 4.4, 'Biryani,Andhra,South Indian,North Indian,Chinese,Seafood', FALSE, 
'124, Near Jyothi Nivas College, 1st Cross, KHB Colony, Koramangala 5th Block, Bangalore', 'Bangalore', 'Koramangala'),

(121603, 'Kannur Food Point', 'bmwn4n4bn6n1tcpc8x2h', 30000, 31, 3.8, 'Kerala,Chinese', FALSE, 
'6/21,9TH CROSS, 1ST MAIN, VENKATESHWARA LAYOUT, SG PALYA, BENGALURU, - 560093', 'Bangalore', 'Tavarekere'),

(307050, 'Call Me Chow', 'soegobqsiqvhmkfvnnkj', 40000, 29, 4.3, 'Chinese,Pan-Asian', TRUE, 
'Call Me Chow, No. 364/A, Ground Floor, 3rd Cross, VSR Layout, Koramangala 8th Block, Bengaluru, Karnataka - 560095', 
'Bangalore', 'Koramangala'),

(337335, 'Kannur Food Kitchen', 'a27weqanhnszqiuzsoik', 20000, 30, 3.8, 'Kerala,Biryani,Beverages', FALSE, 
'kannur food point, Chocolate Factory Road, Tavarekere, Cashier Layout, 1st Stage, BTM Layout, thavrakharea, Karnataka, India', 
'Bangalore', 'BTM Layout');
