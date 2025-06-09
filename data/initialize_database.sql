-- phpMyAdmin SQL Dump
-- version 5.2.1
-- Host: 127.0.0.1
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

CREATE DATABASE IF NOT EXISTS meme_project;
USE meme_project;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

-- --------------------------------------------------------
-- Database: `meme_project`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `templates`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=8;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Stasi', 'stanislava43422@abv.bg', '$2y$10$qJ.dOR9lYptKyOXjLulYW.7pZouD..iIWyNb/54mclO2B5YY9GkQG', '2025-05-15 05:50:40'),
(2, 'Eli', 'eli@abv.bg', '$2y$10$8lsf1Foso5P1FuSpHiNwFul0xYn81YjWteMxDon4ZpW5bxBzK6vWW', '2025-05-15 05:53:09'),
(3, 'Gosho', 'gosho@abv.bg', '$2y$10$np9nMsimTqg/GGlrAEy0Fuux6MYyzbTMS4UWp2dn40uRu5aQN4/9u', '2025-05-15 06:01:43'),
(4, 'ivan', 'ivan@abv.bg', '$2y$10$oncqqEp2NXOwEqAcN6uFXONcH.O7JrKlCa0Unztn/dndLxgASKV26', '2025-05-15 06:13:15'),
(5, 'Kaloqncho', 'kaloqn@abv.bg', '$2y$10$cCCVQSUnB4TaaT/Rck6NQ.rZbDMubjxsvW/wkpu8yqfrOUZHVVBq.', '2025-05-15 08:30:21'),
(6, 'eli@abv.bg', 'eli03@abv.bg', '$2y$10$F/WxeIH1vCgold6eN.MPweqIgRWGtW8f7UxGvcyVza/opRikkIHJO', '2025-06-07 10:37:42'),
(7, 'elitoooo', 'elitooo@abv.bg', '$2y$10$b0ntzj0B9HEVkQi0AnTfqecsOdNIBfH9W3vmsm8CSDXtLgHjg7Ynm', '2025-06-07 20:42:30');

-- --------------------------------------------------------
-- Table structure for table `favorites`
-- --------------------------------------------------------

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_image_unique` (`user_id`, `image_path`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=52;

-- Dumping data for table `favorites`
INSERT INTO `favorites` (`id`, `user_id`, `image_path`) VALUES
(27, 2, 'images/10.jpg'),
(51, 2, 'images/2.jpg');

-- --------------------------------------------------------
-- Table structure for table `templates`
-- --------------------------------------------------------

CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image_url` text NOT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `uploaded_by_idx` (`uploaded_by`),
  CONSTRAINT `fk_templates_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=19;

-- Dumping data for table `templates`
INSERT INTO `templates` (`id`, `name`, `image_url`, `uploaded_by`, `is_public`) VALUES
(8, 'template1', ' https://templated.co/meme-templates/wp-content/uploads/spongebob-meme-template-image-1024x576.jpg', 1, 1),
(9, 'template2', ' https://images.wondershare.com/filmora/article-images/best-meme-templates-01.jpg', 2, 1),
(10, 'template3', ' https://i.imgflip.com/4/2gnnjh.jpg', 2, 1),
(11, 'template4', ' https://i.ytimg.com/vi/rWYqdxgwte4/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGH8gPCg2MA8=&rs=AOn4CLAKgfvI5d49_9WL2fwl2WwXucRx3Q', 2, 1),
(12, 'template5', ' https://i.imgflip.com/4/oqii0.jpg', 2, 1),
(13, 'template6', ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8pYnw52xBdHfclhhiHYlwIPj9aF4akk6SaQ&s', 2, 1),
(14, 'template7', ' https://i.pinimg.com/474x/07/9a/5e/079a5e7ef24cef792d82a5f3fb443d02.jpg', 2, 1),
(15, 'template8', ' https://i.imgflip.com/15lwvm.jpg', 2, 1),
(16, 'template9', ' https://i.imgflip.com/4/1bhk.jpg', 2, 1),
(17, 'template10', ' https://searchmemes.in/_next/image?url=https%3A%2F%2Fsearchmemes.in%2Ftemplates%2Fed6aad57-4424-47f3-b2d7-689e55ddd360.webp&w=3840&q=75', 2, 1),
(18, 'template11', ' https://memeheist.com/wp-content/uploads/2023/10/Patrick-Bateman-Sigma-Face-Meme-Template-1.jpg', 2, 1);

COMMIT;
SET FOREIGN_KEY_CHECKS=1;
