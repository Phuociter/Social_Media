import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { NoProfile } from "../assets";
import { getFriendList, unfriend } from '../api/FriendAPI';

const FriendsCard = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Giả sử API trả về một đối tượng có thuộc tính `friends` chứa mảng
        const data = await getFriendList(user.user.userId);
        setFriends(data); 
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId, user.user.userId]);

  const handleUnfriend = async (friendId) => {
    try {
      // Gọi API hủy kết bạn: truyền userId của người dùng hiện tại và friendId cần hủy kết bạn
      await unfriend(user.user.userId, friendId);
      // Cập nhật lại danh sách bạn bè sau khi hủy kết bạn thành công
      setFriends(prev =>
        prev.filter((friendship) => {
          const currentFriendId =
            friendship.user1.userId === userId
              ? friendship.user2.userId
              : friendship.user1.userId;
          return currentFriendId !== friendId;
        })
      );
      alert("Đã hủy kết bạn!");
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error);
    }
  };

  return (
    <div>
      <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
        <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>
          <span>Friends</span>
          <span>{friends?.length}</span>
        </div>

        <div className='w-full flex flex-col gap-4 pt-4'>
          {friends?.map((friendship) => {
            const friendId =
              friendship.user1.userId === userId
                ? friendship.user2.userId
                : friendship.user1.userId;
            const friend =
              friendship.user1.userId === userId
                ? friendship.user2
                : friendship.user1;
            return (
              <div key={friendId} className="flex items-center justify-between">
                <Link
                  to={`/profile/${friendId}`}
                  className='flex gap-4 items-center cursor-pointer'
                >
                  <img
                    src={friend?.profileImage ?? NoProfile}
                    alt={friend?.username}
                    className='w-10 h-10 object-cover rounded-full'
                  />
                  <div className='flex-1'>
                    <p className='text-base font-medium text-ascent-1'>
                      {friend?.username}
                    </p>
                    <span className='text-sm text-ascent-2'>
                      {friend?.country ?? "No Profession"}
                    </span>
                  </div>
                </Link>
                <button
                  className='bg-red-500 text-white text-xs px-2 py-1 rounded'
                  onClick={() => handleUnfriend(friendId)}
                >
                  Hủy kết bạn
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default FriendsCard;

