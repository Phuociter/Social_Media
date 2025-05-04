-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 03, 2025 lúc 08:22 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `social_media_mhpl`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `commentid` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`commentid`, `postid`, `userid`, `content`, `timestamp`) VALUES
(1, 1, 2, 'Great post, John!', '2025-03-15 21:45:17'),
(2, 1, 3, 'Really insightful.', '2025-03-15 21:45:17'),
(3, 2, 1, 'I love your design!', '2025-03-15 21:45:17'),
(4, 3, 2, 'Thanks for sharing, Alex!', '2025-03-15 21:46:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friendship`
--

CREATE TABLE `friendship` (
  `friendshipid` int(11) NOT NULL,
  `userId1` int(11) NOT NULL,
  `userId2` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friendship`
--

INSERT INTO `friendship` (`friendshipid`, `userId1`, `userId2`, `timestamp`, `accepted_at`) VALUES
(2, 3, 1, '2025-03-15 21:45:17', NULL),
(12, 3, 1, '2025-04-12 21:30:51', NULL),
(13, 2, 4, '2025-04-13 07:14:24', NULL),
(14, 4, 1, '2025-04-19 21:31:15', NULL),
(16, 10, 1, '2025-04-23 08:09:32', NULL),
(50, 6, 1, '2025-05-02 12:45:13', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend_request`
--

CREATE TABLE `friend_request` (
  `requestid` int(11) NOT NULL,
  `senderid` int(11) NOT NULL,
  `receiverid` int(11) NOT NULL,
  `requesttime` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `request_time` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friend_request`
--

INSERT INTO `friend_request` (`requestid`, `senderid`, `receiverid`, `requesttime`, `status`, `request_time`) VALUES
(1, 2, 1, '2025-03-15 21:45:17', 'accepted', '2025-03-19 03:10:19.329017'),
(3, 1, 3, '2025-03-15 21:45:17', 'accepted', '2025-03-19 03:10:19.329017'),
(11, 5, 2, '2025-04-05 20:38:09', 'accepted', '2025-04-05 20:38:09.000000'),
(12, 2, 10, '2025-04-05 21:23:39', 'pending', '2025-04-05 21:23:39.000000'),
(14, 3, 1, '2025-04-12 15:22:46', 'accepted', '2025-04-12 15:22:46.000000'),
(15, 4, 1, '2025-04-12 15:23:52', 'accepted', '2025-04-12 15:23:52.000000'),
(16, 2, 11, '2025-04-12 15:57:53', 'pending', '2025-04-12 15:57:53.000000'),
(17, 2, 4, '2025-04-12 16:28:09', 'accepted', '2025-04-12 16:28:09.000000'),
(18, 4, 2, '2025-04-12 16:31:10', 'pending', '2025-04-12 16:31:10.000000'),
(20, 3, 4, '2025-04-13 04:40:39', 'pending', '2025-04-13 04:40:39.000000'),
(21, 4, 6, '2025-04-13 14:15:09', 'pending', '2025-04-13 14:15:09.000000'),
(22, 1, 10, '2025-04-23 15:08:01', 'accepted', '2025-04-23 15:08:01.000000'),
(23, 6, 1, '2025-04-23 15:09:11', 'accepted', '2025-04-23 15:09:11.000000'),
(33, 1, 2, '2025-05-02 19:37:52', 'pending', '2025-05-02 19:37:52.000000'),
(34, 1, 6, '2025-05-02 19:42:12', 'pending', '2025-05-02 19:42:12.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend_suggestion`
--

CREATE TABLE `friend_suggestion` (
  `suggestionid` int(11) NOT NULL,
  `suggestion_time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `suggested_userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `likeid` int(11) NOT NULL,
  `postid` int(11) DEFAULT NULL,
  `commentid` int(11) DEFAULT NULL,
  `userid` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `likes`
--

INSERT INTO `likes` (`likeid`, `postid`, `commentid`, `userid`, `timestamp`) VALUES
(1, 1, NULL, 2, '2025-03-15 21:45:17'),
(2, NULL, 1, 3, '2025-03-15 21:45:17'),
(4, NULL, 2, 1, '2025-03-15 21:45:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Người nhận thông báo',
  `actor_id` int(11) DEFAULT NULL COMMENT 'Người gây ra sự kiện (gửi request, đăng post, …)',
  `type` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL COMMENT 'ID của đối tượng liên quan (postid, requestid, commentid, …)',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = chưa đọc, 1 = đã đọc',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `actor_id`, `type`, `content`, `reference_id`, `is_read`, `created_at`) VALUES
(12, 2, 3, 'friend_request_received', 'castorice đã gửi cho bạn lời mời kết bạn', 2, 0, '2025-05-01 02:07:48'),
(13, 2, 3, 'friend_request_accepted', 'castorice đã chấp nhận lời mời kết bạn của bạn', 1, 0, '2025-05-01 02:08:44'),
(14, 1, 2, 'like_post', 'Tâm nè  đã thích bài viết của bạn: \"This is my first post on socia…\"', 1, 1, '2025-05-01 02:09:13'),
(15, 1, 2, 'comment_post', 'Tâm nè  đã bình luận trên bài viết của bạn: \"Great post, John!\"', 1, 1, '2025-05-01 02:09:26'),
(16, 2, 1, 'new_post', 'Văn Tèo đã đăng một bài viết mới: \"This is my first post on socia…\"', 1, 0, '2025-05-01 02:09:39'),
(17, 3, 1, 'share_post', 'Văn Tèo đã chia sẻ bài viết của bạn: \"This is my first post on socia…\"', 1, 1, '2025-05-01 02:19:29'),
(20, 2, 1, 'like_comment', 'Văn Tèo đã thích bình luận của bạn: \"I love your design!\"', 3, 0, '2025-05-02 10:38:20'),
(22, 6, 1, 'friend_request_received', 'Văn Tèo đã gửi cho bạn lời mời kết bạn', 23, 0, '2025-05-02 12:42:13'),
(24, 6, 1, 'friend_request_accepted', 'Văn Tèo đã chấp nhận lời mời kết bạn của bạn', 23, 0, '2025-05-02 12:45:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `postid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `mediatype` varchar(20) DEFAULT NULL,
  `mediaurl` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `likecount` int(11) NOT NULL DEFAULT 0,
  `commentcount` int(11) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `comment_count` int(11) NOT NULL,
  `like_count` int(11) NOT NULL,
  `media_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`postid`, `userid`, `content`, `mediatype`, `mediaurl`, `status`, `likecount`, `commentcount`, `timestamp`, `comment_count`, `like_count`, `media_type`) VALUES
(1, 1, 'This is my first post on social media!', 'text', NULL, 'approved', 0, 0, '2025-03-15 21:45:17', 0, 0, NULL),
(2, 2, 'Loving the new design trends!', 'image', 'images/design_trend.jpg', 'approved', 0, 0, '2025-03-15 21:45:17', 0, 0, NULL),
(3, 3, 'Check out my latest marketing strategies.', 'text', NULL, 'approved', 0, 0, '2025-03-15 21:45:17', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profileimage` varchar(255) DEFAULT NULL,
  `profilecover` varchar(255) DEFAULT NULL,
  `bio` varchar(140) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` int(255) DEFAULT NULL,
  `profession` varchar(140) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `profileimage`, `profilecover`, `bio`, `country`, `website`, `role`, `status`, `profession`) VALUES
(1, 'Văn Tèo', 'john@example.com', '123', '/uploads/profile_pics/decc1aa1-de04-40ee-99d1-caeb1605de24.jpg', '/uploads/cover_pics/6005277a-7bca-4d2e-af7d-d754984a1ab5.jpg', 'Developer and Blogger', 'USA', 'https://johndoe.com', 'user', 1, '                                             '),
(2, 'Tâm nè ', 'jane@example.com', '123', '/uploads/profile_pics/77a481a0-fe6c-4ae8-8790-8f2783cc9485.jpg', '/uploads/cover_pics/254536ad-a9c3-4f58-8248-65b9d85ba08d.jpg', 'Designer and Photographer', 'Việt Nam', 'https://janesmith.com', 'user', 1, 'Sinh vien'),
(3, 'castorice', 'alex@example.com', '123', '/uploads/profile_pics/7d3170a7-6f4c-4e5b-9fce-002d9c1b9f7f.jpg', '/uploads/cover_pics/a659e8e0-a2ac-404f-9750-71643dfe7654.jpg', 'Digital Marketer', 'Canada', 'https://alexlee.ca', 'user', 1, 'Sinh vien'),
(4, 'NguyenHoang', 'nguyen.hoang@example.com', '123', 'profile1.jpg', 'cover1.jpg', 'Mình là Hoàng, yêu thích công nghệ!', 'Việt Nam', 'http://nguyenhoang.com', 'user', NULL, ''),
(5, 'TranThao', 'tran.thao@example.com', '123', 'profile2.jpg', 'cover2.jpg', 'Thảo đây, chuyên gia thiết kế đồ họa.', 'Việt Nam', 'http://tranthao.com', 'user', NULL, ''),
(6, 'LeQuang', 'le.quang@example.com', 'hashedpassword3', 'profile3.jpg', 'cover3.jpg', 'Chào mọi người, mình là Quang.', 'Việt Nam', 'http://lequang.com', 'user', NULL, ''),
(7, 'PhamThuy', 'pham.thuy@example.com', 'hashedpassword4', 'profile4.jpg', 'cover4.jpg', 'Mình là Thùy, thích du lịch!', 'Việt Nam', 'http://phamthuy.com', 'user', NULL, ''),
(8, 'HoangKim', 'hoang.kim@example.com', 'hashedpassword5', 'profile5.jpg', 'cover5.jpg', 'Kim là tên của mình, thích học lập trình.', 'Việt Nam', 'http://hoangkim.com', 'user', NULL, ''),
(9, 'NguyenAnh', 'nguyen.anh@example.com', 'hashedpassword6', 'profile6.jpg', 'cover6.jpg', 'Mình là Anh, đam mê âm nhạc.', 'Việt Nam', 'http://nguyenanh.com', 'user', 1, ''),
(10, 'VuMai', 'vu.mai@example.com', 'hashedpassword7', 'profile7.jpg', 'cover7.jpg', 'Mai ở đây, thích thể thao và fitness.', 'Việt Nam', 'http://vumai.com', 'user', 1, ''),
(11, 'BuiDuc', 'bui.duc@example.com', 'hashedpassword8', 'profile8.jpg', 'cover8.jpg', 'Duc là tên mình, yêu thích khám phá.', 'Việt Nam', 'http://buiduc.com', 'user', 1, ''),
(12, 'DoanLan', 'doan.lan@example.com', 'hashedpassword9', 'profile9.jpg', 'cover9.jpg', 'Lan đây, thích công việc sáng tạo.', 'Việt Nam', 'http://doanlan.com', 'user', 1, ''),
(13, 'NgocHien', 'ngoc.hien@example.com', 'hashedpassword10', 'profile10.jpg', 'cover10.jpg', 'Mình là Hiền, đam mê nhiếp ảnh.', 'Việt Nam', 'http://ngochien.com', 'user', 1, '');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentid`),
  ADD KEY `PostID` (`postid`),
  ADD KEY `UserID` (`userid`);

--
-- Chỉ mục cho bảng `friendship`
--
ALTER TABLE `friendship`
  ADD PRIMARY KEY (`friendshipid`),
  ADD KEY `UserID1` (`userId1`),
  ADD KEY `UserID2` (`userId2`);

--
-- Chỉ mục cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  ADD PRIMARY KEY (`requestid`),
  ADD KEY `SenderID` (`senderid`),
  ADD KEY `ReceiverID` (`receiverid`);

--
-- Chỉ mục cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  ADD PRIMARY KEY (`suggestionid`),
  ADD KEY `FKfcsmy9mckd262a6am3tvky476` (`suggested_userid`);

--
-- Chỉ mục cho bảng `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`likeid`),
  ADD KEY `PostID` (`postid`),
  ADD KEY `CommentID` (`commentid`),
  ADD KEY `UserID` (`userid`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_actor` (`actor_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postid`),
  ADD KEY `UserID` (`userid`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `commentid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `friendship`
--
ALTER TABLE `friendship`
  MODIFY `friendshipid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  MODIFY `requestid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  MODIFY `suggestionid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `likeid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `postid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postid`) REFERENCES `posts` (`postid`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friendship`
--
ALTER TABLE `friendship`
  ADD CONSTRAINT `friendship_ibfk_1` FOREIGN KEY (`userId1`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendship_ibfk_2` FOREIGN KEY (`userId2`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  ADD CONSTRAINT `FKhp7fljfahqqi9peabfpcth2ry` FOREIGN KEY (`receiverid`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `FKmvpty05j78tvn14phc7mqkkvx` FOREIGN KEY (`senderid`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  ADD CONSTRAINT `FKfcsmy9mckd262a6am3tvky476` FOREIGN KEY (`suggested_userid`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `FKalvqqqd3rgterjn6xrdg4dvh5` FOREIGN KEY (`commentid`) REFERENCES `comments` (`commentid`),
  ADD CONSTRAINT `FKhtad8wmxkw770qkrkxnm5ijd8` FOREIGN KEY (`userid`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `FKtedhkrww6dvgniujgrp0bc93s` FOREIGN KEY (`postid`) REFERENCES `posts` (`postid`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FKtc10cvjiaj3p7ldl526coc36a` FOREIGN KEY (`userid`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
