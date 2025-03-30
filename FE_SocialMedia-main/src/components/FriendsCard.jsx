// src/components/FriendList.jsx
import React, { useEffect, useState } from 'react';
import FriendsCard from './FriendsCard';
import { getFriendList, unfriend } from '../api/FriendAPI';
import Loading from './Loading';

const FriendList = ({ currentUserId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const data = await getFriendList(currentUserId);
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [currentUserId]);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Danh sách bạn bè</h2>
      {friends.length === 0 ? (
        <p>Không có bạn bè nào.</p>
      ) : (
        <div className="friend-list">
          {friends.map((friendship) => {
            // Giả sử FriendsCard nhận prop "friend" chứa thông tin bạn bè.
            // Nếu mối quan hệ lưu hai user, hãy xác định bạn là ai và bạn bè là user còn lại.
            const friendId = friendship.userID1 === currentUserId ? friendship.userID2 : friendship.userID1;
            return (
              <FriendsCard
                key={friendship.friendshipID}
                friendId={friendId}
                currentUserId={currentUserId}
                onUnfriend={() => {
                  unfriend(currentUserId, friendId).then(fetchFriends);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendList;
