-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 29, 2025 lúc 07:54 PM
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
  `CommentID` int(11) NOT NULL,
  `PostID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Content` text NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`CommentID`, `PostID`, `UserID`, `Content`, `Timestamp`) VALUES
(1, 1, 2, 'Great post, John!', '2025-03-15 21:45:17'),
(2, 1, 3, 'Really insightful.', '2025-03-15 21:45:17'),
(3, 2, 1, 'I love your design!', '2025-03-15 21:45:17'),
(4, 3, 2, 'Thanks for sharing, Alex!', '2025-03-15 21:45:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friendship`
--

CREATE TABLE `friendship` (
  `FriendshipID` int(11) NOT NULL,
  `UserID1` int(11) NOT NULL,
  `UserID2` int(11) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friendship`
--

INSERT INTO `friendship` (`FriendshipID`, `UserID1`, `UserID2`, `Timestamp`, `accepted_at`) VALUES
(1, 1, 2, '2025-03-15 21:45:17', NULL),
(2, 3, 1, '2025-03-15 21:45:17', NULL),
(3, 2, 3, '2025-03-15 21:45:17', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend_request`
--

CREATE TABLE `friend_request` (
  `RequestID` int(11) NOT NULL,
  `SenderID` int(11) NOT NULL,
  `ReceiverID` int(11) NOT NULL,
  `RequestTime` timestamp NOT NULL DEFAULT current_timestamp(),
  `Status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `request_time` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friend_request`
--

INSERT INTO `friend_request` (`RequestID`, `SenderID`, `ReceiverID`, `RequestTime`, `Status`, `request_time`) VALUES
(1, 2, 1, '2025-03-15 21:45:17', 'accepted', '2025-03-19 03:10:19.329017'),
(2, 3, 2, '2025-03-15 21:45:17', 'pending', '2025-03-19 03:10:19.329017'),
(3, 1, 3, '2025-03-15 21:45:17', 'rejected', '2025-03-19 03:10:19.329017');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend_suggestion`
--

CREATE TABLE `friend_suggestion` (
  `suggestionid` int(11) NOT NULL,
  `suggestion_time` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `suggested_userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friend_suggestion`
--

INSERT INTO `friend_suggestion` (`suggestionid`, `suggestion_time`, `suggested_userid`) VALUES
(1, '2025-03-22 04:13:53.465490', 1),
(2, '2025-03-22 04:13:53.465490', 2),
(3, '2025-03-22 04:13:53.465490', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likes`
--

CREATE TABLE `likes` (
  `LikeID` int(11) NOT NULL,
  `PostID` int(11) DEFAULT NULL,
  `CommentID` int(11) DEFAULT NULL,
  `UserID` int(11) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `post_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `likes`
--

INSERT INTO `likes` (`LikeID`, `PostID`, `CommentID`, `UserID`, `Timestamp`, `post_id`) VALUES
(1, 1, NULL, 2, '2025-03-15 21:45:17', NULL),
(2, NULL, 1, 3, '2025-03-15 21:45:17', NULL),
(3, 2, NULL, 1, '2025-03-15 21:45:17', NULL),
(4, NULL, 2, 1, '2025-03-15 21:45:17', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `PostID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Content` text DEFAULT NULL,
  `MediaType` varchar(20) DEFAULT NULL,
  `MediaURL` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `likeCount` int(11) NOT NULL DEFAULT 0,
  `commentCount` int(11) NOT NULL DEFAULT 0,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `comment_count` int(11) NOT NULL,
  `like_count` int(11) NOT NULL,
  `media_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`PostID`, `UserID`, `Content`, `MediaType`, `MediaURL`, `status`, `likeCount`, `commentCount`, `Timestamp`, `comment_count`, `like_count`, `media_type`) VALUES
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
  `profileImage` varchar(255) NOT NULL,
  `profileCover` varchar(255) NOT NULL,
  `bio` varchar(140) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `profileImage`, `profileCover`, `bio`, `country`, `website`, `role`) VALUES
(1, 'john_doe', 'john@example.com', '123', 'images/john.jpg', 'images/john_cover.jpg', 'Developer and Blogger', 'USA', 'https://johndoe.com', 'user'),
(2, 'jane_smith', 'jane@example.com', 'hashedpassword2', 'images/jane.jpg', 'images/jane_cover.jpg', 'Designer and Photographer', 'UK', 'https://janesmith.com', 'user'),
(3, 'alex_lee', 'alex@example.com', 'hashedpassword3', 'images/alex.jpg', 'images/alex_cover.jpg', 'Digital Marketer', 'Canada', 'https://alexlee.ca', 'user');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`CommentID`),
  ADD KEY `PostID` (`PostID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `friendship`
--
ALTER TABLE `friendship`
  ADD PRIMARY KEY (`FriendshipID`),
  ADD KEY `UserID1` (`UserID1`),
  ADD KEY `UserID2` (`UserID2`);

--
-- Chỉ mục cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `SenderID` (`SenderID`),
  ADD KEY `ReceiverID` (`ReceiverID`);

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
  ADD PRIMARY KEY (`LikeID`),
  ADD KEY `PostID` (`PostID`),
  ADD KEY `CommentID` (`CommentID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `FKry8tnr4x2vwemv2bb0h5hyl0x` (`post_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`PostID`),
  ADD KEY `UserID` (`UserID`);

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
  MODIFY `CommentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `friendship`
--
ALTER TABLE `friendship`
  MODIFY `FriendshipID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  MODIFY `suggestionid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `LikeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `PostID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `posts` (`PostID`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friendship`
--
ALTER TABLE `friendship`
  ADD CONSTRAINT `friendship_ibfk_1` FOREIGN KEY (`UserID1`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friendship_ibfk_2` FOREIGN KEY (`UserID2`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  ADD CONSTRAINT `FKhp7fljfahqqi9peabfpcth2ry` FOREIGN KEY (`ReceiverID`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `FKmvpty05j78tvn14phc7mqkkvx` FOREIGN KEY (`SenderID`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  ADD CONSTRAINT `FKfcsmy9mckd262a6am3tvky476` FOREIGN KEY (`suggested_userid`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `FKalvqqqd3rgterjn6xrdg4dvh5` FOREIGN KEY (`CommentID`) REFERENCES `comments` (`CommentID`),
  ADD CONSTRAINT `FKhtad8wmxkw770qkrkxnm5ijd8` FOREIGN KEY (`UserID`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `FKry8tnr4x2vwemv2bb0h5hyl0x` FOREIGN KEY (`post_id`) REFERENCES `posts` (`PostID`),
  ADD CONSTRAINT `FKtedhkrww6dvgniujgrp0bc93s` FOREIGN KEY (`PostID`) REFERENCES `posts` (`PostID`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FKtc10cvjiaj3p7ldl526coc36a` FOREIGN KEY (`UserID`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
