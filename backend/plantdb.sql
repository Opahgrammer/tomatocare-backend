-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 08, 2025 at 03:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plantdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `detections`
--

CREATE TABLE `detections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `disease` varchar(100) NOT NULL,
  `confidence` float NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detections`
--

INSERT INTO `detections` (`id`, `user_id`, `disease`, `confidence`, `image_path`, `notes`, `created_at`) VALUES
(1, 3, 'Tomato mosaic virus', 0.807037, '/uploads/2a196c0d-6594-4440-8df4-ec3405c37dca.jpg', NULL, '2025-09-17 23:22:58'),
(2, 3, 'Tomato mosaic virus', 0.807037, '/uploads/84345619-9b8f-47fd-ad9e-ab8764a5b67b.jpg', NULL, '2025-09-18 13:08:29'),
(3, 3, 'Tomato Early blight', 0.849565, '/uploads/d82a03a0-d307-4c4c-bc74-81755161acbf.jpg', NULL, '2025-09-18 13:08:54'),
(4, 3, 'Tomato Yellow Leaf Curl Virus', 0.917918, '/uploads/9208ef25-1e59-4f65-9e80-ec0df2e48596.jpg', NULL, '2025-09-18 13:09:03'),
(5, 3, 'Tomato Early blight', 0.778353, '/uploads/fa79ab9d-b760-46e7-b2aa-9b2a6710dae0.jpg', NULL, '2025-09-18 13:09:15'),
(6, 3, 'Tomato healthy', 0.878056, '/uploads/09a20fae-b7c1-414b-854c-3140ead4f6f1.jpg', NULL, '2025-09-18 13:09:28'),
(7, 3, 'Tomato Early blight', 0.916031, '/uploads/34d5d4fe-b961-40ae-951e-bc6cbe6cbb37.jpg', NULL, '2025-09-18 13:09:36'),
(8, 3, 'Tomato Yellow Leaf Curl Virus', 0.966054, '/uploads/b000d985-e510-40fa-9ee7-08a65bc1c5ce.jpg', NULL, '2025-09-18 13:09:45'),
(9, 3, 'Tomato Yellow Leaf Curl Virus', 0.915724, '/uploads/f75197a8-0828-4752-b86b-1570b3d89b21.jpg', NULL, '2025-09-18 13:10:28'),
(10, 3, 'Tomato Yellow Leaf Curl Virus', 0.939365, '/uploads/7de9f1d3-0158-4a55-a020-b025b4430506.jpg', NULL, '2025-09-18 13:11:13'),
(11, 3, 'Tomato Early blight', 0.851905, '/uploads/7ceb87ec-4997-495b-9708-c9c55d93a0c1.jpg', NULL, '2025-09-18 13:12:28'),
(12, 3, 'Tomato Early blight', 0.718586, '/uploads/85ff3fed-4c21-47f4-94df-db97648ce510.jpg', NULL, '2025-09-18 13:12:37'),
(13, 3, 'Tomato Early blight', 0.82801, '/uploads/b365195c-a8ec-4a4c-a29f-beead1258154.jpg', NULL, '2025-09-18 13:12:46'),
(14, 3, 'Tomato healthy', 0.901632, '/uploads/b767c4e6-d587-450f-a015-3f45931aacba.jpg', NULL, '2025-09-18 13:12:56'),
(15, 3, 'Tomato healthy', 0.914508, '/uploads/407f8c42-0497-474a-b27e-fe5cae755941.jpg', NULL, '2025-09-19 15:21:33'),
(16, 3, 'Tomato Early blight', 0.915986, '/uploads/4ef2148f-6ffd-47fc-ac89-708848bd4a21.jpg', NULL, '2025-09-19 15:21:51'),
(17, 3, 'Tomato Early blight', 0.859911, '/uploads/fe8bcf44-6255-4514-afb4-6b4d126ae446.jpg', NULL, '2025-09-24 10:30:11'),
(18, 3, 'Tomato Yellow Leaf Curl Virus', 0.915724, '/uploads/6fd543ea-6a70-417f-b1d6-840f8ce3faad.jpg', NULL, '2025-09-24 10:31:06'),
(19, 3, 'Tomato Early blight', 0.807767, '/uploads/767ea7f8-35e9-4c6c-a7b7-1b040c3aef4f.jpg', NULL, '2025-09-26 22:18:40'),
(20, 3, 'Tomato Early blight', 0.851247, '/uploads/e09a376e-c5b3-4903-a7bb-3b684bc82812.jpg', NULL, '2025-09-29 10:06:53'),
(21, 3, 'Tomato Yellow Leaf Curl Virus', 0.960636, '/uploads/bb44fcee-57f2-4cf5-9e7b-85e91cdd3917.jpg', NULL, '2025-09-29 22:43:57'),
(22, 3, 'Tomato Yellow Leaf Curl Virus', 0.964976, '/uploads/00804325-058e-441c-abc5-a7d4c76d2a68.jpg', NULL, '2025-09-29 22:44:15'),
(23, 3, 'Tomato Early blight', 0.60139, '/uploads/ed0c15fc-d2b2-41d4-8173-e1c8dadfc03b.jpg', NULL, '2025-10-04 11:00:53'),
(24, 3, 'Tomato Early blight', 0.60139, '/uploads/d0bd3bf8-255d-4f6d-965e-720a551efeb2.jpg', NULL, '2025-10-04 11:00:58'),
(25, 3, 'Tomato Early blight', 0.860677, '/uploads/7e4e7b38-a4a9-4a37-9554-26c918e6d36e.jpg', NULL, '2025-10-04 11:01:07'),
(26, 3, 'Tomato Yellow Leaf Curl Virus', 0.675362, '/uploads/1a8995e4-519d-4e55-9f01-d15984bc68e9.jpg', NULL, '2025-10-04 11:01:14'),
(27, 3, 'Tomato Yellow Leaf Curl Virus', 0.97063, '/uploads/c29146c6-2efa-43c6-8d8c-bca4013f7ddb.jpg', NULL, '2025-10-04 11:01:23'),
(28, 3, 'Tomato Early blight', 0.731559, '/uploads/c20e7b11-12cd-4173-b9de-f54d4081de09.jpg', NULL, '2025-10-04 11:01:33'),
(29, 3, 'Tomato Early blight', 0.858412, '/uploads/62097ded-7cbd-4cf8-a74a-1a5a1319627d.jpg', NULL, '2025-10-04 11:02:04'),
(30, 3, 'Tomato Yellow Leaf Curl Virus', 0.974284, '/uploads/c0a97471-ee4a-4401-b53a-1b989319c0ed.jpg', NULL, '2025-10-04 11:02:10'),
(31, 3, 'Tomato healthy', 0.941959, '/uploads/f472087e-12b8-426e-8df0-98ab28bd2c5a.jpg', NULL, '2025-10-04 11:02:20'),
(32, 1, 'Tomato mosaic virus', 0.796565, '/uploads/096aecb6-348b-4cb0-a28e-1d438dfc21d4.jpg', NULL, '2025-10-04 11:05:57'),
(33, 1, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/06979f8d-1a7c-4be5-8253-382de817e283.jpg', NULL, '2025-10-04 11:40:43'),
(34, 1, 'Tomato Early blight', 0.456191, '/uploads/2a940e1c-0bc2-4048-8783-43302b2a3aeb.jpg', NULL, '2025-10-04 11:41:57'),
(35, 1, 'Tomato Early blight', 0.859364, '/uploads/c6fac189-b5b8-40d9-9507-64d166075520.jpg', NULL, '2025-10-04 11:42:09'),
(36, 1, 'Tomato Early blight', 0.831732, '/uploads/9e148ea8-2119-4c01-8236-64b86d74d124.jpg', NULL, '2025-10-04 11:42:19'),
(37, 1, 'Tomato Septoria leaf spot', 0.969121, '/uploads/0e00d41f-70b3-4efa-9fb4-cdad8a3568ef.jpg', NULL, '2025-10-04 11:43:58'),
(38, 1, 'Tomato Yellow Leaf Curl Virus', 0.980184, '/uploads/eab78b24-86f8-44c8-bb9e-587117e98684.jpg', NULL, '2025-10-04 11:44:07'),
(39, 1, 'Tomato Yellow Leaf Curl Virus', 0.970899, '/uploads/3db4e94b-24da-46ef-af2d-124e6c291a35.jpg', NULL, '2025-10-04 11:44:14'),
(40, 1, 'Tomato Bacterial Spot', 0.871714, '/uploads/8948f86c-7846-47a1-8688-11d0d84cf376.jpg', NULL, '2025-10-04 11:44:21'),
(41, 1, 'Tomato Target Spot', 0.696773, '/uploads/1e42891c-4494-440c-97f5-0491f8f9ff21.jpg', NULL, '2025-10-04 11:44:27'),
(42, 1, 'Tomato Early blight', 0.826858, '/uploads/e6237483-09bc-415c-ab7c-420da83360b9.jpg', NULL, '2025-10-04 11:44:33'),
(43, 1, 'Tomato Early blight', 0.826858, '/uploads/2d131e9d-a341-49e2-b573-a9564d2cfd54.jpg', NULL, '2025-10-04 11:45:43'),
(44, 1, 'Tomato Early blight', 0.893146, '/uploads/c105f072-32d2-47e1-8386-37ef9253f695.jpg', NULL, '2025-10-04 11:45:52'),
(45, 1, 'Tomato Early blight', 0.965675, '/uploads/67dbe10d-e176-4467-a8f5-c21ccedaabe6.jpeg', NULL, '2025-10-04 11:48:13'),
(46, 3, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/829cf066-f73f-43e2-ab22-0df7b74f8f73.jpg', NULL, '2025-10-25 18:12:27'),
(47, 3, 'Tomato Early blight', 0.538499, '/uploads/cf4cac5e-b969-48ce-b6ba-f64a1f8fba0f.jpg', NULL, '2025-10-26 21:36:09'),
(48, 3, 'Tomato mosaic virus', 0.796565, '/uploads/68b8fb37-88eb-498e-9f36-37388746c1ed.jpg', NULL, '2025-10-26 21:46:46'),
(49, 3, 'Tomato healthy', 0.9427, '/uploads/e4e9b068-60aa-4882-bd83-3ac4df4f6494.jpg', NULL, '2025-10-26 21:47:29'),
(50, 3, 'Tomato mosaic virus', 0.796565, '/uploads/d4cf966d-f99d-4f20-9eef-d548d6395ced.jpg', NULL, '2025-10-26 23:46:14'),
(51, 3, 'Tomato Yellow Leaf Curl Virus', 0.979872, '/uploads/499314cd-659c-4ec8-95bd-d002f21162d6.jpg', NULL, '2025-10-27 00:11:06'),
(52, 1, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/e2ba5765-c25d-413a-be3d-3b6b18591325.jpg', NULL, '2025-10-27 12:24:47'),
(53, 1, 'Tomato Yellow Leaf Curl Virus', 0.966285, '/uploads/f824b9d8-85f8-49bc-aac1-dde69049f8f6.jpg', NULL, '2025-10-27 12:33:22'),
(54, 1, 'Tomato healthy', 0.938511, '/uploads/be91fd03-efaa-4a34-8a4f-3dc5cfcbca22.jpg', NULL, '2025-10-27 12:50:45'),
(55, 4, 'Tomato mosaic virus', 0.796565, '/uploads/6bf40c9f-3f21-4848-9360-8b1328e10c3b.jpg', NULL, '2025-10-27 15:41:49'),
(56, 4, 'Tomato Yellow Leaf Curl Virus', 0.966285, '/uploads/c0eee367-d214-456b-9437-db5f6dbc6411.jpg', NULL, '2025-10-27 15:42:10'),
(57, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/3e468ed0-c9fa-4cc3-a64a-07e74b9ff52f.jpg', NULL, '2025-10-27 15:42:21'),
(58, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/97c87f51-6742-4f0e-bbb9-9d7f37a67d5a.jpg', NULL, '2025-10-27 15:42:27'),
(59, 4, 'Tomato Early blight', 0.538499, '/uploads/16980b32-4e03-420e-be9a-71815e413fe1.jpg', NULL, '2025-10-27 15:42:51'),
(60, 4, 'Tomato Early blight', 0.871341, '/uploads/a10e4f93-9bb2-485f-b381-301ecea774a9.jpg', NULL, '2025-10-27 15:42:59'),
(61, 4, 'Tomato Early blight', 0.682636, '/uploads/f7cbc9dc-b7aa-4752-987f-99ec1ae595b3.jpg', NULL, '2025-10-27 15:43:06'),
(62, 4, 'Tomato Septoria leaf spot', 0.771218, '/uploads/81a44c91-bdce-4196-bce2-d901a8ba7519.jpg', NULL, '2025-10-27 15:43:12'),
(63, 4, 'Tomato healthy', 0.927828, '/uploads/188a9e15-7820-45e3-9aa7-1082be9419ea.jpg', NULL, '2025-10-27 15:43:20'),
(64, 4, 'Tomato Yellow Leaf Curl Virus', 0.970544, '/uploads/3318a758-6fe0-4b13-aff1-13fdef6c87bb.jpg', NULL, '2025-10-27 15:43:25'),
(65, 4, 'Tomato healthy', 0.938511, '/uploads/9f084d5b-67f9-4cd9-b015-39c78c24cdec.jpg', NULL, '2025-10-27 15:44:10'),
(66, 4, 'Tomato healthy', 0.938511, '/uploads/dd3953d4-5425-4d29-9524-dcedcb8f0049.jpg', NULL, '2025-10-27 15:44:11'),
(67, 4, 'Tomato healthy', 0.938511, '/uploads/c150d1c8-850f-4caf-ae46-90762351a156.jpg', NULL, '2025-10-27 15:44:13'),
(68, 4, 'Tomato Yellow Leaf Curl Virus', 0.970544, '/uploads/b6ef4ee3-b7f3-4564-9f70-020e3093f6be.jpg', NULL, '2025-10-27 21:36:07'),
(69, 4, 'Tomato Yellow Leaf Curl Virus', 0.973367, '/uploads/473eeb04-3e50-4329-963d-3bebcde8ef47.jpg', NULL, '2025-10-27 21:36:21'),
(70, 4, 'Tomato Yellow Leaf Curl Virus', 0.980184, '/uploads/573577a0-39d9-4930-afbd-886b20703790.jpg', NULL, '2025-10-27 21:59:23'),
(71, 4, 'Tomato Early blight', 0.773497, '/uploads/94654583-b88c-40ff-b7bc-60c102f5a399.jpg', NULL, '2025-10-27 21:59:37'),
(72, 4, 'Tomato healthy', 0.925371, '/uploads/0a0293db-eb6e-4512-b39a-d9ad975e4a81.jpg', NULL, '2025-10-27 22:00:08'),
(73, 4, 'Tomato Early blight', 0.682636, '/uploads/abce8afd-c971-49b8-bb18-452ee9847a78.jpg', NULL, '2025-10-27 23:34:07'),
(74, 4, 'Tomato Bacterial Spot', 0.840134, '/uploads/70e51995-50cb-4d3d-a6b3-6c32f922a6ec.jpg', NULL, '2025-10-27 23:35:29'),
(75, 4, 'Tomato Septoria leaf spot', 0.771218, '/uploads/fc44d016-1e3c-45e9-87a4-62d0d2004219.jpg', NULL, '2025-10-27 23:35:40'),
(76, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/1ae0a2ce-3852-4b46-8ad5-ec01a0a036ee.jpg', NULL, '2025-10-27 23:35:48'),
(77, 4, 'Tomato Yellow Leaf Curl Virus', 0.970544, '/uploads/3d9b008d-923f-4424-99ea-0ff46defb78c.jpg', NULL, '2025-10-27 23:53:33'),
(78, 4, 'Tomato Yellow Leaf Curl Virus', 0.965459, '/uploads/9d5a3f2d-1163-4e81-83b8-fbb8acf38f68.jpg', NULL, '2025-10-31 15:00:13'),
(79, 4, 'Tomato healthy', 0.941525, '/uploads/45ad8816-f010-41a3-8369-45712704ba30.jpg', NULL, '2025-10-31 15:01:00'),
(80, 4, 'Tomato Yellow Leaf Curl Virus', 0.967739, '/uploads/97df82bd-5a2a-4ece-8d8f-ac484e8a0f66.jpg', NULL, '2025-10-31 15:49:45'),
(81, 4, 'Tomato Yellow Leaf Curl Virus', 0.970899, '/uploads/a37dbb73-3cce-412d-b56d-c8bce2bc5d26.jpg', NULL, '2025-10-31 15:50:10'),
(82, 4, 'Tomato Yellow Leaf Curl Virus', 0.970899, '/uploads/c0e90253-bbb2-4bee-9426-de17a9200c30.jpg', NULL, '2025-10-31 22:40:24'),
(83, 4, 'Tomato mosaic virus', 0.796565, '/uploads/91cc37f7-d1a7-480a-979a-f8146ae2fad2.jpg', NULL, '2025-10-31 22:51:04'),
(84, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/26ea5148-38f3-4444-bb67-4def49cd01ee.jpg', NULL, '2025-10-31 22:51:21'),
(85, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/dafe66ba-eaa3-4597-bca0-faae986557c9.jpg', NULL, '2025-10-31 22:51:40'),
(86, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/423cbc51-a5a3-44be-971d-8dceb826fe29.jpg', NULL, '2025-11-01 12:34:04'),
(87, 4, 'Tomato Yellow Leaf Curl Virus', 0.966285, '/uploads/6e468c01-791e-4e1b-a173-5943aeead222.jpg', NULL, '2025-11-02 22:15:01'),
(88, 4, 'Tomato Yellow Leaf Curl Virus', 0.980184, '/uploads/46d0298e-eee3-4c8d-b43a-b834875186ea.jpg', NULL, '2025-11-02 22:15:18'),
(89, 4, 'Tomato Yellow Leaf Curl Virus', 0.980184, '/uploads/559a4373-ab4a-4105-8dc3-b2ba2ca8dcd6.jpg', NULL, '2025-11-02 22:24:29'),
(90, 4, 'Tomato Yellow Leaf Curl Virus', 0.970544, '/uploads/85042087-31c4-420a-8a2b-2af1e99a7a5e.jpg', NULL, '2025-11-02 22:40:25'),
(91, 4, 'Tomato Yellow Leaf Curl Virus', 0.928452, '/uploads/67b57a04-0b15-4979-9a27-07697051b857.jpg', NULL, '2025-11-02 22:42:17'),
(92, 7, 'Healthy', 1, '/uploads/9c2aa7d7-91c5-41f5-bfe5-69de111fa68e.png', NULL, '2025-11-25 23:50:07'),
(93, 1, 'Healthy', 1, '/uploads/675627f6-4ca1-4409-b23d-039beac1c780.png', NULL, '2025-11-28 10:07:20'),
(94, 1, 'Tomato Early blight', 0.689999, '/uploads/b704853e-85ae-48e0-bfce-141f8563ddcd.jpg', NULL, '2025-12-01 13:36:46'),
(95, 1, 'Tomato healthy', 0.939898, '/uploads/ba66e132-7869-4ce9-8df5-81179290389f.jpg', NULL, '2025-12-01 13:37:04'),
(96, 1, 'Tomato mosaic virus', 0.871196, '/uploads/38bd8d61-ce58-493c-a232-51088389a1e2.jpg', NULL, '2025-12-03 21:49:56'),
(97, 1, 'Tomato Bacterial Spot', 0.53557, '/uploads/f6dacebb-6c06-4660-97fc-32aedf9f2936.jpg', NULL, '2025-12-06 10:36:42'),
(98, 1, 'Tomato healthy', 0.939898, '/uploads/d94ea0bd-51a7-45eb-81aa-e427cc7e7d41.jpg', NULL, '2025-12-06 10:37:23'),
(99, 1, 'Tomato Leaf Mold', 0.937, '/uploads/fc043813-7c25-4725-8708-a9b25c600f26.jpg', NULL, '2025-12-06 13:51:21'),
(100, 1, 'Tomato Leaf Mold', 0.944861, '/uploads/e65eb07d-da6e-45b4-9bf8-75356014454c.jpg', NULL, '2025-12-06 13:52:20'),
(101, 1, 'Tomato Leaf Mold', 0.957519, '/uploads/fe9efb10-804b-4a40-ac20-681823934a35.jpg', NULL, '2025-12-06 22:08:15'),
(102, 1, 'Tomato Leaf Mold', 0.957519, '/uploads/0852b461-0862-4dc9-a3b0-f42d85bfb7e9.jpg', NULL, '2025-12-07 10:48:16'),
(103, 1, 'Tomato Leaf Mold', 0.957519, '/uploads/f88902bc-6c27-4f62-b2c1-8206acad7ee3.jpg', NULL, '2025-12-07 10:48:41'),
(104, 1, 'Tomato Leaf Mold', 0.944861, '/uploads/297aa2f3-0ec7-4f31-a722-e0aa6d278a30.jpg', NULL, '2025-12-07 11:08:06'),
(105, 1, 'Tomato Bacterial Spot', 0.53557, '/uploads/278be608-eb24-4e77-ae52-1d3035e5396a.jpg', NULL, '2025-12-07 11:19:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'fajar', 'gamingfajar438@gmail.com', '$2b$12$2OgftI20qypeJ9B3kBXNaO/JYbknIjxKjgA1DnClPqL8JIl0Ew.Qe', '2025-09-15 22:08:24'),
(2, 'fajar5', 'gamingfajar456@gmail.com', '$2b$12$1KtfGFz5rl3iNTDDzniZDu/xgty0o9nTdee1FG5Kr5TP3LJmIW4km', '2025-09-15 22:18:22'),
(3, 'fifa23', 'fifa23@gmail.com', '$2b$12$GnaPDYn8wq7xYYf7UgZAquMwiFHx6KsP4ogFt7d925OmNYQi7YUJm', '2025-09-17 21:16:24'),
(4, 'Fajar Siregar', 'fajar24@gmail.com', '$2b$12$gxLXMOAziZStcjEVKIyhl.H/6rxWv6TbqA4xz2aydtxqlLR6tjXt2', '2025-10-27 15:41:34'),
(7, 'Talep', 'talep@gmail.com', '$2b$12$vbnCsDQMcxaFkXg17pZDXeZ6lu9e8G7.4pnYe631tZ/IfuZxRw3bG', '2025-11-25 23:42:50'),
(8, 'Talep', 'talepp@gmail.com', '$2b$12$9e/eJNog9pbco1o1ZcQciuS3PPo7ykFkQO64A8DhHfBVgdD1uAl/S', '2025-11-25 23:45:36'),
(9, 'Fajar Simajuntak', 'fajar41@gmail.com', '$2b$12$UcNo7SWjfhI/S4moEXMnfuO2fZecX2Bj.wxLMCKpoJDUy6WfCySGa', '2025-12-03 21:40:30'),
(10, 'yasir', 'yasir@gmail.com', '$2b$12$p6xBjCqDsd2wLvbfvhXL9eXM8nrbkvUOSRreEGIQVp1aQoB0nkpXu', '2025-12-08 18:39:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detections`
--
ALTER TABLE `detections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_det_user_created_at` (`user_id`,`created_at`),
  ADD KEY `ix_det_user_disease` (`user_id`,`disease`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detections`
--
ALTER TABLE `detections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detections`
--
ALTER TABLE `detections`
  ADD CONSTRAINT `fk_detections_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
