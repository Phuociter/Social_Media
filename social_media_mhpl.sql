-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 01, 2025 lúc 10:21 PM
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
(4, 3, 2, 'Thanks for sharing, Alex!', '2025-03-15 21:45:17');

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
(1, 1, 2, '2025-03-15 21:45:17', NULL),
(2, 3, 1, '2025-03-15 21:45:17', NULL),
(3, 2, 3, '2025-03-15 21:45:17', NULL);

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
(1, 2, 1, '2025-03-15 21:45:17', 'pending', '2025-03-19 03:10:19.329017'),
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
(3, 2, NULL, 1, '2025-03-15 21:45:17'),
(4, NULL, 2, 1, '2025-03-15 21:45:17');

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
  `profileimage` varchar(255) NOT NULL,
  `profilecover` varchar(255) NOT NULL,
  `bio` varchar(140) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` int(255) DEFAULT NULL,
  `profile_cover` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `profileimage`, `profilecover`, `bio`, `country`, `website`, `role`, `status`, `profile_cover`, `profile_image`) VALUES
(1, 'john_doe', 'john@example.com', '123', 'images/john.jpg', 'images/john_cover.jpg', 'Developer and Blogger', 'USA', 'https://johndoe.com', 'user', NULL, NULL, NULL),
(2, 'jane_smith', 'jane@example.com', 'hashedpassword2', 'images/jane.jpg', 'images/jane_cover.jpg', 'Designer and Photographer', 'UK', 'https://janesmith.com', 'user', NULL, NULL, NULL),
(3, 'alex_lee', 'alex@example.com', 'hashedpassword3', 'images/alex.jpg', 'images/alex_cover.jpg', 'Digital Marketer', 'Canada', 'https://alexlee.ca', 'user', NULL, NULL, NULL);

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
  MODIFY `friendshipid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  MODIFY `requestid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  MODIFY `suggestionid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `likeid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `postid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FKtc10cvjiaj3p7ldl526coc36a` FOREIGN KEY (`userid`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
