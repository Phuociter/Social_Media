-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 05, 2025 lúc 11:06 PM
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

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `generate_fake_users` ()   BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE m INT DEFAULT 1;

  WHILE i <= 100 DO
    INSERT INTO users (
      username, email, password, role, status, createat
    ) VALUES (
      CONCAT('user', i),
      CONCAT('user', i, '@example.com'),
      '123456',
      'user',
      1,
      STR_TO_DATE(CONCAT('2024-', m, '-10 10:00:00'), '%Y-%m-%d %H:%i:%s')
    );

    SET i = i + 1;
    SET m = IF(m = 12, 1, m + 1); -- Tăng tháng từ 1 đến 12, rồi quay lại 1
  END WHILE;
END$$

DELIMITER ;

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
(4, 3, 2, 'Thanks for sharing, Alex!', '2025-03-15 21:45:17'),
(5, 4, 1, 'hay quá ạ', '2025-04-12 11:33:49'),
(6, 5, 4, 'thật tuyệt vời', '2025-04-12 11:37:09'),
(7, 6, 5, 'thật đáng quý!', '2025-04-12 11:37:57'),
(8, 4, 6, 'cố lên nha', '2025-04-12 11:38:43'),
(9, 3, 7, 'you\'re so beautiful', '2025-04-12 11:39:44'),
(10, 8, 7, 'Fighting!', '2025-04-12 11:39:59'),
(11, 5, 10, 'thật là một bài học đáng giá <3', '2025-04-12 11:42:13'),
(12, 14, 12, 'yeah, tui cũng vậyyyyy', '2025-04-12 11:44:48'),
(13, 14, 13, 'Hinata mãi đỉnhhhhh', '2025-04-12 11:46:06'),
(14, 18, 1, 'hừ, tsuki là nhất', '2025-04-12 11:48:41'),
(15, 14, 1, 'nhưng ảnh lùn hơn tsuki', '2025-04-12 11:48:53'),
(16, 6, 1, 'bạn là ai??', '2025-04-12 11:49:05'),
(17, 5, 1, 'thật là một bài học quý giá', '2025-04-12 11:49:16'),
(18, 12, 1, 'cố lên nhé', '2025-04-12 11:49:45'),
(19, 30, 2, 'hiii', '2025-04-23 06:15:31'),
(20, 33, 2, 'hello', '2025-05-01 07:31:41'),
(21, 52, 2, 'hi ca nha', '2025-05-05 00:59:11');

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
(3, 2, 3, '2025-03-15 21:45:17', NULL),
(10, 6, 1, '2025-04-12 08:10:26', NULL),
(11, 2, 3, '2025-04-12 10:29:33', NULL),
(12, 4, 1, '2025-04-23 06:50:22', NULL),
(15, 4, 2, '2025-04-23 08:04:31', NULL);

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
(3, 2, NULL, 1, '2025-03-15 21:45:17'),
(4, NULL, 2, 1, '2025-03-15 21:45:17'),
(5, 4, NULL, 1, '2025-04-12 11:33:43'),
(6, 5, NULL, 4, '2025-04-12 11:37:02'),
(7, 6, NULL, 5, '2025-04-12 11:37:47'),
(8, 4, NULL, 6, '2025-04-12 11:38:36'),
(9, 6, NULL, 6, '2025-04-12 11:39:09'),
(10, 2, NULL, 6, '2025-04-12 11:39:11'),
(11, 3, NULL, 7, '2025-04-12 11:39:33'),
(12, 8, NULL, 7, '2025-04-12 11:39:47'),
(13, 7, NULL, 8, '2025-04-12 11:40:28'),
(14, 6, NULL, 8, '2025-04-12 11:40:30'),
(15, 10, NULL, 9, '2025-04-12 11:41:31'),
(16, 5, NULL, 10, '2025-04-12 11:42:03'),
(17, NULL, 6, 10, '2025-04-12 11:42:18'),
(18, 13, NULL, 11, '2025-04-12 11:42:49'),
(19, 14, NULL, 12, '2025-04-12 11:44:36'),
(20, 12, NULL, 13, '2025-04-12 11:45:50'),
(21, 14, NULL, 13, '2025-04-12 11:45:52'),
(22, 18, NULL, 1, '2025-04-12 11:48:31'),
(23, 14, NULL, 1, '2025-04-12 11:48:33'),
(24, 6, NULL, 1, '2025-04-12 11:48:56'),
(25, 5, NULL, 1, '2025-04-12 11:49:18'),
(26, NULL, 6, 1, '2025-04-12 11:49:20'),
(27, NULL, 11, 1, '2025-04-12 11:49:21'),
(28, NULL, 5, 1, '2025-04-12 11:49:24'),
(29, NULL, 8, 1, '2025-04-12 11:49:24'),
(30, NULL, 12, 1, '2025-04-12 11:49:27'),
(31, NULL, 13, 1, '2025-04-12 11:49:28'),
(32, NULL, 3, 1, '2025-04-12 11:49:37'),
(33, 12, NULL, 1, '2025-04-12 11:49:39'),
(34, 8, NULL, 1, '2025-04-12 11:49:40'),
(37, 27, NULL, 1, '2025-04-23 06:53:01'),
(42, 37, NULL, 2, '2025-04-28 08:21:18'),
(44, 34, NULL, 2, '2025-05-01 07:31:35'),
(45, 33, NULL, 2, '2025-05-01 07:31:36'),
(50, 50, NULL, 3, '2025-05-05 00:41:43'),
(51, 52, NULL, 3, '2025-05-05 00:42:52'),
(52, 51, NULL, 3, '2025-05-05 00:48:51'),
(53, 45, NULL, 3, '2025-05-05 00:58:10'),
(54, 44, NULL, 3, '2025-05-05 00:58:14'),
(58, NULL, 21, 2, '2025-05-05 01:04:59'),
(61, NULL, 21, 3, '2025-05-05 01:11:44'),
(65, 52, NULL, 2, '2025-05-05 02:06:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `actor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `content`, `created_at`, `is_read`, `reference_id`, `type`, `actor_id`, `user_id`) VALUES
(1, 'Tâm nè  đã đăng một bài viết mới: \"hiiii\"', '2025-05-05 07:38:10.000000', b'1', 52, 'new_post', 2, 3),
(2, 'Tâm nè  đã đăng một bài viết mới: \"hiiii\"', '2025-05-05 07:38:10.000000', b'0', 52, 'new_post', 2, 4),
(3, 'Tâm nè  đã đăng một bài viết mới: \"hiiii\"', '2025-05-05 07:38:10.000000', b'1', 52, 'new_post', 2, 3),
(4, 'castorice đã thích bài viết của bạn: \"asd\"', '2025-05-05 07:40:18.000000', b'1', 48, 'like_post', 3, 2),
(5, 'castorice đã thích bài viết của bạn: \"Loving the new design trends!\"', '2025-05-05 07:40:20.000000', b'1', 2, 'like_post', 3, 2),
(6, 'castorice đã thích bài viết của bạn: \"asd\"', '2025-05-05 07:40:38.000000', b'1', 49, 'like_post', 3, 2),
(7, 'castorice đã thích bài viết của bạn: \"abcbcc\"', '2025-05-05 07:41:44.000000', b'1', 50, 'like_post', 3, 2),
(8, 'castorice đã thích bài viết của bạn: \"abcbcc\"', '2025-05-05 07:42:50.000000', b'1', 50, 'like_post', 3, 2),
(9, 'castorice đã thích bài viết của bạn: \"abc\"', '2025-05-05 07:42:52.000000', b'1', 51, 'like_post', 3, 2),
(10, 'castorice đã thích bài viết của bạn: \"hiiii\"', '2025-05-05 07:48:52.000000', b'1', 52, 'like_post', 3, 2),
(11, 'castorice đã thích bài viết của bạn: \"😒 sfbj\"', '2025-05-05 07:58:10.000000', b'1', 53, 'like_post', 3, 2),
(12, 'castorice đã thích bài viết của bạn: \"hooo\"', '2025-05-05 07:58:15.000000', b'1', 54, 'like_post', 3, 2),
(13, 'Tâm nè  đã bình luận trên bài viết của bạn: \"hi ca nha\"', '2025-05-05 07:59:11.000000', b'1', 21, 'comment_post', 2, 2),
(14, 'castorice đã thích bình luận của bạn: \"hi ca nha\"', '2025-05-05 08:11:16.000000', b'1', 60, 'like_comment', 3, 2),
(15, 'castorice đã thích bình luận của bạn: \"hi ca nha\"', '2025-05-05 08:11:45.000000', b'1', 61, 'like_comment', 3, 2),
(16, 'Văn Tèo đã thích bài viết của bạn: \"hiiii\"', '2025-05-05 08:39:27.000000', b'1', 62, 'like_post', 1, 2),
(17, 'Văn Tèo đã thích bài viết của bạn: \"Tôi có thể không hạnh phúc như…\"', '2025-05-05 08:39:31.000000', b'1', 37, 'like_post', 1, 2),
(18, 'Văn Tèo đã thích bài viết của bạn: \"hiiii\"', '2025-05-05 08:39:37.000000', b'1', 63, 'like_post', 1, 2),
(19, 'Văn Tèo đã chia sẻ bài viết của bạn: \"hiiii\"', '2025-05-05 08:41:26.000000', b'1', 52, 'share_post', 1, 2),
(20, 'Jane đã thích bài viết của bạn: \"hiiii\"', '2025-05-05 09:05:35.000000', b'0', 64, 'like_post', 2, 2),
(21, 'Văn Tèo đã thích bài viết của bạn: \"Tôi có thể không hạnh phúc như…\"', '2025-05-05 09:05:45.000000', b'0', 37, 'like_post', 1, 2),
(22, 'Jane đã thích bài viết của bạn: \"hiiii\"', '2025-05-05 09:06:10.000000', b'0', 65, 'like_post', 2, 2);

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
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`postid`, `userid`, `content`, `mediatype`, `mediaurl`, `status`, `likecount`, `commentcount`, `timestamp`) VALUES
(1, 1, 'This is my first post on social media!', 'text', NULL, 'approved', 1, 2, '2025-03-15 21:45:17'),
(2, 2, 'Loving the new design trends!', 'image', 'images/design_trend.jpg', 'approved', 3, 1, '2025-03-15 21:45:17'),
(3, 3, 'Check out my latest marketing strategies.', 'text', NULL, 'approved', 1, 2, '2025-03-15 21:45:17'),
(4, 2, 'Đôi khi, tôi tự hỏi liệu thất bại có phải là dấu chấm hết hay chỉ là một bước ngoặt trong hành trình của mình. Mỗi lần vấp ngã, tôi cảm thấy như thế giới xung quanh đang sụp đổ. Nhưng rồi, theo thời gian, tôi nhận ra rằng những thất bại ấy không phải là điểm kết thúc, mà là cơ hội để tôi đứng lên mạnh mẽ hơn. Những thất bại đó dạy tôi cách kiên trì, dạy tôi cách không bao giờ từ bỏ ước mơ dù có khó khăn đến đâu.', 'video', '/uploads/204ae334-b0a0-4d49-9788-d57e51ec18b7_05 (Không Phai) - @tangduytan x T.R.I x Phong Max ( phiên bản Phong Max ).mp4', 'approved', 4, 2, '2025-04-12 11:32:55'),
(5, 1, 'Lòng kiên nhẫn là một món quà quý giá mà tôi đã học được qua những năm tháng trưởng thành. Đôi khi, mọi thứ không diễn ra như chúng ta muốn, và cảm giác bế tắc khiến tôi muốn từ bỏ. Nhưng trong khoảnh khắc ấy, tôi nhớ lại những lần tôi đã kiên nhẫn chờ đợi, những lần tôi không bỏ cuộc. Và tôi nhận ra rằng, mọi sự chờ đợi đều có giá trị, bởi chỉ có kiên nhẫn mới dẫn chúng ta đến đích.', NULL, NULL, 'approved', 6, 3, '2025-04-12 11:33:40'),
(6, 4, 'Có những người bạn mà chỉ cần ở bên cạnh nhau, không cần phải nói gì nhiều, vẫn có thể cảm nhận được sự ấm áp. Tình bạn không cần phải có những lời hứa suông hay những lời dỗ dành, mà là sự hiện diện, là cảm giác an toàn khi ở bên nhau. Dù là những khoảnh khắc vui vẻ hay những lúc buồn bã, bạn vẫn là người tôi có thể dựa vào mà không cần phải nói ra một lời.', NULL, NULL, 'approved', 4, 2, '2025-04-12 11:37:19'),
(7, 5, 'Tôi thường mơ về một tương lai không quá xa vời, nơi mà những ước mơ của tôi trở thành hiện thực. Nhưng đôi khi, những ước mơ ấy lại dường như quá xa vời, như một ngôi sao xa lắc trên bầu trời. Tuy vậy, tôi vẫn giữ vững niềm hy vọng, bởi tôi biết rằng nếu không có ước mơ, cuộc sống này sẽ thật trống rỗng. Mỗi bước đi, dù nhỏ, vẫn đưa tôi gần hơn đến tương lai mà tôi mong muốn.', NULL, NULL, 'approved', 1, 0, '2025-04-12 11:38:06'),
(8, 6, 'Mỗi khi cuộc sống đưa tôi vào những con đường gian nan, tôi luôn tìm thấy niềm an ủi trong lòng biết ơn. Có thể mọi thứ không đi theo kế hoạch, nhưng tôi vẫn còn sức khỏe, vẫn có những người thân yêu bên cạnh. Lòng biết ơn giúp tôi nhìn nhận mọi thứ theo một cách tích cực hơn, giúp tôi nhận ra rằng dù khó khăn đến đâu, tôi vẫn có điều gì đó để trân trọng.', NULL, NULL, 'approved', 2, 1, '2025-04-12 11:39:06'),
(9, 7, 'Có những lúc tôi cảm thấy lạc lõng trong chính cuộc sống của mình. Tất cả như một mớ hỗn độn không thể giải thích, những câu hỏi không có lời đáp. Nhưng rồi, tôi quyết định rời xa tất cả, tìm một không gian yên tĩnh để đối diện với chính mình. Và đó là lúc tôi hiểu rằng, chỉ có khi tôi đối mặt với những cảm xúc thật sự trong lòng, tôi mới có thể tìm lại được con người mà tôi từng quên mất.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:40:08'),
(10, 8, 'Yêu thương không phải là một lời nói dễ dàng, mà là sự thấu hiểu, là sự kiên nhẫn và sẵn sàng hy sinh vì người mình yêu. Tôi đã từng nghĩ rằng yêu thương chỉ là cảm xúc mãnh liệt, nhưng sau tất cả, tôi nhận ra rằng yêu thương là một hành trình dài, nơi hai người có thể cùng nhau vượt qua mọi thử thách, và mỗi lần vượt qua khó khăn đó, tình yêu lại càng thêm sâu sắc.', NULL, NULL, 'approved', 1, 0, '2025-04-12 11:40:38'),
(11, 9, 'Cuộc sống không phải lúc nào cũng dễ dàng, và chúng ta đôi khi phải đối mặt với những thách thức không lường trước. Nhưng điều làm nên sự khác biệt chính là cách chúng ta đối diện với những thử thách ấy. Chúng ta có thể chọn từ bỏ, hoặc chọn đứng lên và tiếp tục. Chính những khoảnh khắc khi chúng ta quyết định không bỏ cuộc mới là những khoảnh khắc tạo nên sự khác biệt.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:41:28'),
(12, 10, 'Có những lúc tôi cảm thấy cô đơn đến mức trái tim như muốn vỡ ra. Nhưng tôi nhận ra rằng, sự cô đơn không phải lúc nào cũng là một điều xấu. Đó là thời gian để tôi tìm hiểu bản thân mình, để tôi lắng nghe những suy nghĩ và cảm xúc mà tôi đã bỏ qua bấy lâu. Đôi khi, chỉ có một mình, tôi mới có thể thực sự tìm thấy được sự bình yên trong lòng.', NULL, NULL, 'approved', 2, 1, '2025-04-12 11:41:57'),
(13, 11, 'Có những vết thương trong lòng tôi không dễ gì chữa lành. Nhưng tôi học được rằng, sự tha thứ không phải dành cho người khác, mà là dành cho chính mình. Tha thứ không có nghĩa là quên đi, mà là để cho bản thân được tự do khỏi những đau đớn trong quá khứ, để có thể sống trọn vẹn hơn trong hiện tại.', NULL, NULL, 'approved', 1, 0, '2025-04-12 11:42:39'),
(14, 11, 'Hinata Shoyo, cậu là một ngọn lửa sáng chói không thể dập tắt! Tình yêu và niềm đam mê dành cho bóng chuyền của cậu thật sự truyền cảm hứng cho tất cả chúng ta. Dù nhỏ bé, nhưng cậu lại có một trái tim và quyết tâm vĩ đại!', NULL, NULL, 'approved', 5, 3, '2025-04-12 11:43:41'),
(15, 11, 'Không ai có thể không yêu Hinata! Dù gặp phải bao nhiêu khó khăn, cậu ấy luôn giữ vững niềm tin vào bản thân và đồng đội. Một hình mẫu của sự kiên trì và lòng dũng cảm!', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:43:50'),
(16, 11, 'Hinata là kiểu người mà bạn chỉ cần nhìn thôi đã cảm thấy tràn đầy năng lượng và hy vọng! Cậu ấy chứng minh rằng không có gì là không thể nếu ta đủ đam mê và quyết tâm!', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:43:59'),
(17, 12, 'my otp is reallllll', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:44:20'),
(18, 12, 'Cậu ấy có thể không phải là người cao nhất, nhưng mỗi cú nhảy của Hinata như thể vượt qua cả bầu trời! Sự kiên cường và không bỏ cuộc của cậu thật sự làm tôi ngưỡng mộ.', NULL, NULL, 'approved', 1, 1, '2025-04-12 11:44:27'),
(19, 12, 'Hinata Shoyo, một chiến binh thật sự! Mỗi khi đối mặt với thử thách, cậu ấy lại vượt qua chúng bằng sự nỗ lực không ngừng. Cậu ấy là minh chứng cho việc mọi thứ đều có thể đạt được nếu bạn không bao giờ từ bỏ!', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:44:34'),
(20, 13, 'Mỗi lần nhìn Hinata cười, tôi lại cảm thấy như được truyền thêm năng lượng. Cậu ấy không chỉ là một vận động viên, mà còn là nguồn cảm hứng vô tận cho tất cả những ai từng cảm thấy yếu đuối hay mất niềm tin vào bản thân.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:45:17'),
(21, 13, 'Hinata Shoyo là hình mẫu của sự vượt lên chính mình. Cậu ấy đã chứng minh rằng không có gì là quá lớn lao khi bạn dám mơ ước và chiến đấu hết mình vì điều đó.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:45:25'),
(22, 13, 'Không thể không nhắc đến Hinata trong mỗi trận đấu! Sự đam mê và nhiệt huyết của cậu ấy khiến mỗi pha bóng trở nên không thể đoán trước và cực kỳ mãn nhãn!', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:45:36'),
(23, 13, 'Mặc dù Hinata không phải là người mạnh nhất, nhưng sự kiên cường, tính cách vui vẻ và sự cống hiến của cậu ấy khiến cậu ấy trở thành ngôi sao sáng trong lòng tôi!', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:45:43'),
(24, 1, 'Tsukishima Kei là một nhân vật vừa thông minh vừa đầy cá tính. Cậu ấy có thể không phải là người thể hiện cảm xúc nhiều nhất, nhưng chính sự sắc sảo và tính cách độc đáo của Tsukishima khiến tôi không thể không yêu thích.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:47:03'),
(25, 1, 'Sự điềm tĩnh và lạnh lùng của Tsukishima thực sự là một sức hút đặc biệt. Cậu ấy luôn giữ được sự tự tin, không bao giờ dễ dàng bị lung lay, và luôn làm mọi thứ theo cách riêng của mình.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:47:13'),
(26, 1, 'Tsukishima không chỉ giỏi về kỹ thuật mà còn rất thông minh trong cách đánh giá tình huống. Cậu ấy có thể không nổi bật như những người khác, nhưng luôn có những pha bóng đỉnh cao khiến tôi phải trầm trồ.', NULL, NULL, 'approved', 0, 0, '2025-04-12 11:47:28'),
(27, 1, 'Tôi có thể không hạnh phúc nhưng otp của tôi phải hạnh phúc!!!!', NULL, NULL, 'approved', 1, 0, '2025-04-12 11:48:04'),
(29, 1, 'aDaD', NULL, NULL, 'approved', 0, 0, '2025-04-22 07:30:19'),
(30, 1, 'sadas', 'image', '/uploads/5c2fa5d1-c0c6-4f41-9070-3884a3143a03_Những năm tháng đã sống hoài sống phí.png', 'approved', 0, 1, '2025-04-22 07:30:28'),
(31, 1, 'hiiiii', NULL, NULL, 'approved', 0, 0, '2025-04-22 07:32:00'),
(32, 1, 'chào mn', 'text', NULL, 'approved', 0, 0, '2025-04-23 06:55:53'),
(33, 1, 'haiizz', 'text', '/uploads/d90b9d1b-f6b3-4cb4-8a54-b776f057341e_Những năm tháng đã sống hoài sống phí.png', 'approved', 1, 1, '2025-04-23 06:56:39'),
(34, 1, 'hmmm', 'text', '/uploads/a884d365-fc97-442f-905c-66a36cc49489_05 (Không Phai) - @tangduytan x T.R.I x Phong Max ( phiên bản Phong Max ).mp4', 'approved', 1, 0, '2025-04-23 06:59:53'),
(36, 5, 'hiii', 'text', NULL, 'approved', 0, 0, '2025-04-23 07:46:48'),
(37, 4, 'hiiiii', 'text', NULL, 'approved', 1, 0, '2025-04-28 07:53:57'),
(38, 2, 'hi', 'text', NULL, 'approved', 0, 0, '2025-05-01 07:30:44'),
(39, 2, 'hii', 'text', '/uploads/1b8c92b1-7ead-4aa3-ae9e-d845eef9634f_chuky3.jpg', 'approved', 0, 0, '2025-05-01 07:31:23'),
(40, 4, 'hiiiii', 'text', NULL, 'rejected', 0, 0, '2025-05-03 20:59:52'),
(41, 2, '😒 sfbj', 'text', '/uploads/6eecff63-a9a0-4308-b341-88880c09fef5_chuky3.jpg', 'approved', 0, 0, '2025-05-04 18:59:05'),
(42, 2, 'hihahiahis', 'text', '/uploads/aad8a362-cdff-4dd0-a947-9418ce617bec_Những năm tháng đã sống hoài sống phí.png', 'approved', 0, 0, '2025-05-04 19:03:52'),
(43, 2, 'hiiii', 'text', NULL, 'approved', 0, 0, '2025-05-04 19:15:32'),
(44, 2, 'hooo', 'text', '/uploads/247b35a5-1f81-4876-b528-3643bcafe330_Những năm tháng đã sống hoài sống phí.png', 'approved', 1, 0, '2025-05-04 19:21:03'),
(45, 2, '😒 sfbj', 'text', '/uploads/a0290c7a-f360-4d56-9453-af13b1ec631c_Những năm tháng đã sống hoài sống phí.png', 'approved', 1, 0, '2025-05-05 00:18:31'),
(46, 2, '😒 sfbj', 'text', '/uploads/9c3a5b75-55ad-498f-99fd-49990a40c744_chuky1.jpg', 'approved', 0, 0, '2025-05-05 00:20:18'),
(47, 2, 'abc', 'text', NULL, 'approved', 0, 0, '2025-05-05 00:22:34'),
(48, 2, 'asd', 'text', NULL, 'approved', 0, 0, '2025-05-05 00:26:34'),
(49, 2, 'asd', 'text', NULL, 'approved', 0, 0, '2025-05-05 00:28:17'),
(50, 2, 'abcbcc', 'text', NULL, 'approved', 1, 0, '2025-05-05 00:33:28'),
(51, 2, 'abc', 'text', NULL, 'approved', 1, 0, '2025-05-05 00:36:18'),
(52, 2, 'hiiii', 'text', NULL, 'approved', 2, 1, '2025-05-05 00:38:10');

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
  `status` int(255) DEFAULT 1,
  `profession` varchar(140) DEFAULT NULL,
  `createat` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `profileimage`, `profilecover`, `bio`, `country`, `website`, `role`, `status`, `profession`, `createat`) VALUES
(1, 'Văn Tèo', 'john@example.com', '123', '/uploads/profile_pics/cc6ea200-a1f1-4b37-a92e-a559c48f1106.jpg', '/uploads/cover_pics/f7554f9d-8254-4514-8c01-dbf7cae34c11.jpg', 'Developer and Blogger', 'USA', 'https://johndoe.com', 'user', 1, 'sinh viên      ', '2025-05-06 00:00:00.000000'),
(2, 'Jane', 'jane@example.com', '123', '/uploads/profile_pics/e14cd4e8-84a9-4154-b95b-bfb971687dc8.jpg', '/uploads/cover_pics/19d87b78-bc8b-4149-b8f8-be89e7b179b1.jpg', 'Designer and Photographer', 'Việt Nam', 'https://janesmith.com', 'user', 1, 'Sinh vien', '2025-05-06 00:00:00.000000'),
(3, 'alex', 'alex@example.com', '123', '/uploads/profile_pics/d528ab1e-5130-4786-9b23-acfbf86bcd00.jpg', '/uploads/cover_pics/1941730f-ece6-4c5f-9776-f354930ba313.jpg', 'Digital Marketer', 'Canada', 'https://alexlee.ca', 'user', 1, 'Sinh vien', '2025-05-06 00:00:00.000000'),
(4, 'NguyenHoang', 'nguyen.hoang@example.com', '123', '/uploads/profile_pics/aaba7555-c88e-43b1-a9ef-e612899672ea.jpg', '/uploads/cover_pics/d272e546-dbe8-4634-a39e-cda42d483c69.jpg', 'Mình là Hoàng, yêu thích công nghệ!', 'Việt Nam', 'http://nguyenhoang.com', 'user', 1, 'Sinh vien', '2025-05-06 00:00:00.000000'),
(5, 'TranThao', 'tran.thao@example.com', '123', '/uploads/profile_pics/2655b2e5-a6db-46a4-8677-f6528bda9f98.jpg', '/uploads/cover_pics/48a6aacf-e484-450d-9af4-26246a244b60.jpg', 'Thảo đây, chuyên gia thiết kế đồ họa.', 'Việt Nam', 'http://tranthao.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(6, 'LeQuang', 'le.quang@example.com', 'hashedpassword3', '/uploads/profile_pics/43aa13ec-96e7-4da5-8fce-e3bb57ef07ff.jpg', '/uploads/cover_pics/271f5ab3-8a3e-4eb3-a113-3d2afa8da6c4.jpg', 'Chào mọi người, mình là Quang.', 'Việt Nam', 'http://lequang.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(7, 'PhamThuy', 'pham.thuy@example.com', 'hashedpassword4', '/uploads/profile_pics/3515c994-37c3-42b7-a5fa-67dbb573b452.jpg', '/uploads/cover_pics/32e7c00f-5a42-4df8-9112-88957fe7a214.jpg', 'Mình là Thùy, thích du lịch!', 'Việt Nam', 'http://phamthuy.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(8, 'HoangKim', 'hoang.kim@example.com', 'hashedpassword5', '/uploads/profile_pics/744c743e-975b-45fb-bb95-8340e7d6ff41.jpg', '/uploads/cover_pics/7ee0000d-576e-42fe-ad81-f0507e0c317b.jpg', 'Kim là tên của mình, thích học lập trình.', 'Việt Nam', 'http://hoangkim.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(9, 'NguyenAnh', 'nguyen.anh@example.com', 'hashedpassword6', '/uploads/profile_pics/dd5a2164-57e4-48fa-a33b-a993e7fd3da8.jpg', '/uploads/cover_pics/3ed4e573-9302-4f29-b038-b453f37dab8e.jpg', 'Mình là Anh, đam mê âm nhạc.', 'Việt Nam', 'http://nguyenanh.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(10, 'VuMai', 'vu.mai@example.com', 'hashedpassword7', '/uploads/profile_pics/dd2aa2e0-9865-41d4-81d8-292732b1ee82.jpg', '/uploads/cover_pics/6b6ff86a-46bf-4f3a-a68a-1ab27902f1e6.jpg', 'Mai ở đây, thích thể thao và fitness.', 'Việt Nam', 'http://vumai.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(11, 'BuiDuc', 'bui.duc@example.com', 'hashedpassword8', '/uploads/profile_pics/30b11fc5-2b15-4da5-aa17-7f31243bd3b5.png', '/uploads/cover_pics/bccf24ae-f5fd-4b45-ab7d-7b83aa8f267b.jpg', 'Duc là tên mình, yêu thích khám phá.', 'Việt Nam', 'http://buiduc.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(12, 'DoanLan', 'doan.lan@example.com', 'hashedpassword9', '/uploads/profile_pics/c74fc4fb-f98c-47e6-98be-6a1a7b8719b6.jpg', '/uploads/cover_pics/895a15ae-75d5-44ae-8987-1d00484bf2af.jpg', 'Lan đây, thích công việc sáng tạo.', 'Việt Nam', 'http://doanlan.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(13, 'NgocHien', 'ngoc.hien@example.com', 'hashedpassword10', '/uploads/profile_pics/6b85283c-adff-4f15-935a-1aea7069ac05.jpg', '/uploads/cover_pics/7dd30fea-e4de-44e3-8d60-1403304c9520.jpg', 'Mình là Hiền, đam mê nhiếp ảnh.', 'Việt Nam', 'http://ngochien.com', 'user', 1, '', '2025-05-06 00:00:00.000000'),
(14, 'phuoc', 'abc@gmail.com', '123456', NULL, NULL, NULL, NULL, NULL, 'user', 1, NULL, '2025-05-05 21:05:19.000000');

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
  ADD KEY `FK4sd9fik0uthbk6d9rsxco4uja` (`actor_id`),
  ADD KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`);

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
  MODIFY `commentid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `friendship`
--
ALTER TABLE `friendship`
  MODIFY `friendshipid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `friend_request`
--
ALTER TABLE `friend_request`
  MODIFY `requestid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `friend_suggestion`
--
ALTER TABLE `friend_suggestion`
  MODIFY `suggestionid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `likes`
--
ALTER TABLE `likes`
  MODIFY `likeid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `postid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  ADD CONSTRAINT `FK4sd9fik0uthbk6d9rsxco4uja` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `FKtc10cvjiaj3p7ldl526coc36a` FOREIGN KEY (`userid`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
